import html2pdf from 'html2pdf.js';
import './css/entryMode.css';
import { useState } from "react";

const OfferLetterForm = (props) => {
    const [form, setForm] = useState({
        date: "16th September 2025",
        name: "Graciam Ngwira",
        year: "3 and 4",
        numberInstall: "6",
        years: "2",
        program: "Bachelor of Arts in Accounting and Finance (Degree Completion Programme)",
        registrationFee: "50,000.00",
        tuitionFeeWords: "Four Hundred and Fifty Thousand Kwacha",
        tuitionFee: "450,000.00",
        instalMentFee: "75,000.00",
        totalPayment: "450,000.00",
        orientationFull: "2nd August 2025",
        orientationOnline: "3rd August 2025",
        commencementFull: "4th August 2025",
        commencementWeekend: "9th August 2025",
        registrer: "Dr. M Thindwa PhD",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [user, setUsers] = useState({ name: "phido", email: "phidophidz@gmail.com" });
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
        <>
            <div className="offer-letter" id='offer-letter'>
                <div style={{ backgroundImage: "url(./assets/logos/logo3.jpg" }} id='logoBack'></div>

                <div id='formStafff'>
                    <img id="coverPage" src="./assets/images/coverPage.png" alt="cover" />
                    <p className="date">{form.date}</p>
                    <p>Private Bag 94, Mzuzu</p>

                    <p>Dear <input name="name" value={form.name} onChange={handleChange} className="editable" /></p>

                    <h3>CONDITIONAL OFFER LETTER TO STUDY</h3>
                    <h4>
                        <input
                            name="program"
                            value={form.program}
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
                    <table>
                        <thead>
                            <tr>
                                <th>Payment Plan</th>
                                <th>Payment and Instalment Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1st Instalment</td>
                                <td>50% of tuition Fee Upfront before starting classes</td>
                            </tr>
                            <tr>
                                <td>2nd Instalment</td>
                                <td>25% of balance before mid-semester exams</td>
                            </tr>
                            <tr>
                                <td>3rd Instalment</td>
                                <td>25% before end of semester exams</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4>MONTHLY INSTALMENT PLAN</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Fees Per Sem</th>
                                <th>Monthly Instalment</th>
                                <th>No. Instalments</th>
                                <th>Total Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{form.year}</td>
                                <td>K{form.tuitionFee}</td>
                                <td>K{form.instalMentFee}</td>
                                <td>6</td>
                                <td>K{form.totalPayment}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4>Orientation Schedule</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Dates</th>
                                <th>Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input name="orientationFull" value={form.orientationFull} onChange={handleChange} className="editable short" /></td>
                                <td>Orientation for Full-time, Evening & Weekend Students</td>
                            </tr>
                            <tr>
                                <td><input name="orientationOnline" value={form.orientationOnline} onChange={handleChange} className="editable short" /></td>
                                <td>Orientation for Online Distance E Learning Students</td>
                            </tr>
                            <tr>
                                <td><input name="commencementFull" value={form.commencementFull} onChange={handleChange} className="editable short" /></td>
                                <td>Commencement of Full-time & Evening Classes</td>
                            </tr>
                            <tr>
                                <td><input name="commencementWeekend" value={form.commencementWeekend} onChange={handleChange} className="editable short" /></td>
                                <td>Commencement of Weekend Classes</td>
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
            </div>
            <button onClick={sendEmails} disabled={loading} /*style={styles.sendBtn}*/>
                {loading ? "Sending..." : "Send Emails"}
            </button>
        </>
    );
};

export default OfferLetterForm;
