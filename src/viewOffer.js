import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEye } from '@fortawesome/free-solid-svg-icons';
import './css/view.css'
import './css/views2.css'
import { useEffect, useRef, useState } from 'react';
import Dialog from './dialog';
import html2pdf from 'html2pdf.js';
import './css/entryMode.css';


const ViewOffer = (props) => {

    const [form, setForm] = useState(props.form);

    useEffect(() => {
        setForm(props.form);
    }, [props.form]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const [subject, setSubject] = useState(props.subject);
    const [message, setMessage] = useState(props.message);
    const [user, setUsers] = useState({ firstName: props.applicant.firstName, surname: props.applicant.surname, email: props.applicant.email });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    const sendEmails = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback("");

        try {
            const formData = new FormData();
            formData.append("data", JSON.stringify({ subject, message, user }));
            const div = document.getElementById("offer-letter");

            const opt = {
                margin: 0.5,
                filename: "offer-letter.pdf",
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            };

            const pdfBlob = await html2pdf().from(div).set(opt).outputPdf("blob");
            const pdfFile = new File([pdfBlob], "offer-letter.pdf", { type: "application/pdf" });

            formData.append("attachments", pdfFile);
            const response = await fetch("https://mongodb-5-7rnl.onrender.com/sendEmail/send-emails2", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                props.updateApplicants("Offered")
            } else {
                setFeedback("❌ Failed to send: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            setFeedback("⚠️ Network or server error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id='newOverlay2' style={{ display: props.checkOverlay ? "flex" : "none" }} >
            {/* {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>} */}


            <div className="offer-letter" id='offer-letter'>
                <div style={{ backgroundImage: "url(./assets/logos/logo3.jpg" }} id='logoBack'></div>

                <div id='formStafff'>
                    <img id="coverPage" src="./assets/images/coverPage.png" alt="cover" />
                    <p className="date">{form.date}</p>
                    <p>Private Bag 94, Mzuzu</p>

                    <p>Dear <input name="name" value={props.applicant.firstName + " " + props.applicant.surname} onChange={handleChange} className="editable" /></p>

                    <h3>CONDITIONAL OFFER LETTER TO STUDY</h3>
                    <h4>
                        <input
                            name="program"
                            value={props.prog!==""?props.prog:props.applicant.form === "postgrad" ? props.applicant?.programme : props.applicant?.academicDetails?.[0].programme}
                            onChange={handleChange}
                            className="editable long"
                        />
                    </h4>

                    <p>
                        I am writing to congratulate you on behalf of the <b>University of Hebron</b> for
                        accepting your application and admitting you for the program above. We are pleased
                        to inform you that after a thorough assessment of the application, you have been
                        successfully enrolled in a {form.years} years degree completion programme from three year.
                    </p>

                    <p>
                        Following this offer letter, you are required to pay <b>Registration Fee</b>{" "}
                        <input name="registrationFee" value={`K${form.registrationFee}`} onChange={handleChange} className="editable short" />{" "}
                        and commence payment of your tuition fees which is{" "}
                        <b>{form.tuitionFeeWords}</b>{" "}
                        <input name="tuitionFee" value={form.tuitionFee} onChange={handleChange} className="editable short" />{" "}
                        per semester. Your tuition fees can be paid through either of these available payment plans as indicated below.
                    </p>

                    <h4>THREE MONTHS INSTALMENT PLAN</h4>
                    <table id='tb'>
                        <thead>
                            <tr>
                                <th id='th1'>Payment Plan</th>
                                <th id='th1'>Payment and Instalment Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id='td1'>1st Instalment</td>
                                <td id='td1'>50% of tuition Fee Upfront before starting classes</td>
                            </tr>
                            <tr>
                                <td id='td1'>2nd Instalment</td>
                                <td id='td1'>25% of balance before mid-semester exams</td>
                            </tr>
                            <tr>
                                <td id='td1'>3rd Instalment</td>
                                <td id='td1'>25% before end of semester exams</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4>MONTHLY INSTALMENT PLAN</h4>
                    <table id='tb'>
                        <thead>
                            <tr>
                                <th id='th1'>Year</th>
                                <th id='th1'>Fees Per Sem</th>
                                <th id='th1'>Monthly Instalment</th>
                                <th id='th1'>No. Instalments</th>
                                <th id='th1'>Total Payment</th>
                            </tr>
                        </thead>
                        <tbody >
                            <tr>
                                <td id='td1'>{form.year}</td>
                                <td id='td1'>K{form.tuitionFee}</td>
                                <td id='td1'>K{form.instalMentFee}</td>
                                <td id='td1'>6</td>
                                <td id='td1'>K{form.totalPayment}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4>Orientation Schedule</h4>
                    <table id='tb'>
                        <thead>
                            <tr>
                                <th id='th1'>Dates</th>
                                <th id='th1'>Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id='td1'><input name="orientationFull" value={form.orientationFull} onChange={handleChange} className="editable short" /></td>
                                <td id='td1'>Orientation for Full-time, Evening & Weekend Students</td>
                            </tr>
                            <tr>
                                <td id='td1'><input name="orientationOnline" value={form.orientationOnline} onChange={handleChange} className="editable short" /></td>
                                <td id='td1'>Orientation for Online Distance E Learning Students</td>
                            </tr>
                            <tr>
                                <td id='td1'><input name="commencementFull" value={form.commencementFull} onChange={handleChange} className="editable short" /></td>
                                <td id='td1'>Commencement of Full-time & Evening Classes</td>
                            </tr>
                            <tr>
                                <td id='td1'><input name="commencementWeekend" value={form.commencementWeekend} onChange={handleChange} className="editable short" /></td>
                                <td id='td1'>Commencement of Weekend Classes</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>
                        We trust that the honor of your acceptance is met with dignity. We also hope that
                        you will find the experience of University of Hebron fulfilling and satisfying.
                    </p>

                    <p>Yours Sincerely,</p>
                    <p><b>For and on behalf of the University of Hebron</b></p>
                    <p><b>{form.registrer}</b><br />Deputy Vice Chancellor – Administration and Registration Services</p>
                </div>

                <button onClick={sendEmails} disabled={loading} /*style={styles.sendBtn}*/>
                    {loading ? "Sending email....." : "Email"}
                </button>
            </div>


            <FontAwesomeIcon icon={faCircleXmark} id='cancel' onClick={() => { props.setOverlay(false) }}></FontAwesomeIcon>
        </div>
    )
}

export default ViewOffer
