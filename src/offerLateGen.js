import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEye, faRightToBracket, faPrint, faFile, faThumbsDown, faXmark, faPlane, faPaperPlane, faAdd, faFileClipboard } from '@fortawesome/free-solid-svg-icons';
import './css/view.css'
import './css/views2.css'
import { useEffect, useRef, useState } from 'react';
import Dialog from './dialog';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import ViewOffer from './viewOffer';
import html2pdf from 'html2pdf.js';


const SendOfferGen = (props) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [view, setView] = useState([])

    useEffect(() => {
        setUsers(props.selected)
    })

    const handleUserChange = (index, field, value) => {
        const updated = [...users];
        updated[index][field] = value;
        setUsers(updated);
    };

    const addUser = () => {
        setUsers([...users, { firstName: "", email: "" }]);
    };

    const removeUser = (user) => {
        const updated = users.filter((applicant) => applicant !== user);
        props.setSelected(updated);
    };

    const [receiptFiles, setReceiptFiles] = useState([]);
    const [qualifications, setQualifications] = useState([]);

    const handleReceiptFiles = (e) => {
        const files = Array.from(e.target.files);
        setReceiptFiles(files);
        setQualifications((prev) => [...prev, ...files]);
        // setUseTags((prev) => [...prev, ...files.map(() => "file1")]);
    };


    const sendEmails = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback("");

        try {
            const formData = new FormData();
            formData.append("data", JSON.stringify({ subject, message, users }));

            for (let file of receiptFiles) {
                formData.append("attachments", file);
            }

            const response = await fetch("https://mongodb-5-7rnl.onrender.com/sendEmail/send-emails", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setFeedback("✅ Emails sent successfully!");
                setReceiptFiles([]);
                setQualifications([]);
                props.updateApplicants("Offered")
                setUsers(props.selected)
            } else {
                setFeedback("❌ Failed to send: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            setFeedback("⚠️ Network or server error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const [form, setForm] = useState({
        date: "16th September 2025",
        year: "3 and 4",
        numberInstall: "6",
        years: "2",
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
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const [prog,setProg] = useState("")

    const handleProg = (e) =>{
        setProg(e.target.value)
    }

    const [checkOverlay, setOverlay] = useState(false)


    const sendGen = () => {
        props.selected.map((key, index) => {
            // console.log(props.selected[index].firstName)
            makeOffer({ firstName: props.selected[index].firstName, surname: props.selected[index].surname, email: props.selected[index].email, programe: props.selected[index].form === "postgrad" ? props.selected[index].programme : props.selected[index].academicDetails[0].programme })
        })
    }

    const makeOffer = async (user) => {
        setLoading(true);
        setFeedback("");
        console.log(user.firstName)
        try {
            const formData = new FormData();
            formData.append("data", JSON.stringify({ subject, message, user }));

            const html = `<div class="offer-letter" id="offer-letter">
                    <div style="background-image: url('./assets/logos/logo3.jpg')" id="logoBack"></div>

                    <div id="formStafff">
                        <img id="coverPage" src="./assets/images/coverPage.png" alt="cover" />
                        <p class="date">${form.date}</p>
                        <p>Private Bag 94, Mzuzu</p>

                        <p>Dear ${user.firstName} ${user.surname}</p>

                        <h3>CONDITIONAL OFFER LETTER TO STUDY</h3>
                        <h4>${prog!==""?prog:user.programe}</h4>

                        <p>
                        I am writing to congratulate you on behalf of the <b>University of Hebron</b>
                        for accepting your application and admitting you for the program above.
                        We are pleased to inform you that after a thorough assessment of your
                        application, you have been successfully enrolled in a ${form.years}-year degree
                        completion programme from three years.
                        </p>

                        <p>
                        Following this offer letter, you are required to pay a <b>Registration Fee</b> of
                        <b>K${form.registrationFee}</b> and commence payment of your tuition fees,
                        which is <b>${form.tuitionFeeWords}</b> (K${form.tuitionFee}) per semester.
                        Your tuition fees can be paid through either of the payment plans indicated below.
                        </p>

                        <h4>THREE MONTHS INSTALMENT PLAN</h4>
                        <table id="tb">
                        <thead>
                            <tr>
                            <th id="th1">Payment Plan</th>
                            <th id="th1">Payment and Instalment Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td id="td1">1st Instalment</td>
                            <td id="td1">50% of tuition fee upfront before starting classes</td>
                            </tr>
                            <tr>
                            <td id="td1">2nd Instalment</td>
                            <td id="td1">25% of balance before mid-semester exams</td>
                            </tr>
                            <tr>
                            <td id="td1">3rd Instalment</td>
                            <td id="td1">25% before end of semester exams</td>
                            </tr>
                        </tbody>
                        </table>

                        <h4>MONTHLY INSTALMENT PLAN</h4>
                        <table id="tb">
                        <thead>
                            <tr>
                            <th id="th1">Year</th>
                            <th id="th1">Fees Per Sem</th>
                            <th id="th1">Monthly Instalment</th>
                            <th id="th1">No. Instalments</th>
                            <th id="th1">Total Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td id="td1">${form.year}</td>
                            <td id="td1">K${form.tuitionFee}</td>
                            <td id="td1">K${form.instalMentFee}</td>
                            <td id="td1">6</td>
                            <td id="td1">K${form.totalPayment}</td>
                            </tr>
                        </tbody>
                        </table>

                        <h4>Orientation Schedule</h4>
                        <table id="tb">
                        <thead>
                            <tr>
                            <th id="th1">Dates</th>
                            <th id="th1">Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td id="td1">${form.orientationFull}</td>
                            <td id="td1">Orientation for Full-time, Evening & Weekend Students</td>
                            </tr>
                            <tr>
                            <td id="td1">${form.orientationOnline}</td>
                            <td id="td1">Orientation for Online Distance E-Learning Students</td>
                            </tr>
                            <tr>
                            <td id="td1">${form.commencementFull}</td>
                            <td id="td1">Commencement of Full-time & Evening Classes</td>
                            </tr>
                            <tr>
                            <td id="td1">${form.commencementWeekend}</td>
                            <td id="td1">Commencement of Weekend Classes</td>
                            </tr>
                        </tbody>
                        </table>

                        <p>
                        We trust that the honor of your acceptance is met with dignity.
                        We also hope that you will find the experience at the University of Hebron
                        fulfilling and satisfying.
                        </p>

                        <p>Yours sincerely,</p>
                        <p><b>For and on behalf of the University of Hebron</b></p>
                        <p>
                        <b>${form.registrer}</b><br />
                        Deputy Vice Chancellor – Administration and Registration Services
                        </p>
                    </div>
                    </div>
                    `;

            const opt = {
                margin: 0.5,
                filename: "offer-letter.pdf",
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            };

            const pdfBlob = await html2pdf().from(html).set(opt).outputPdf("blob");
            const pdfFile = new File([pdfBlob], `${user.firstName} ${user.surname}.pdf`, { type: "application/pdf" });

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


    }

    return (
        <div id='newOverlay' style={{ display: props.checkOverlay2 ? "flex" : "none" }} >
            {/* {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>} */}
            <ViewOffer prog={prog} checkOverlay={checkOverlay} setOverlay={setOverlay} applicant={view} form={form} refresh={props.refresh} setRefresh={props.setRefresh} subject={subject} message={message} />

            <div id='sendEmail'>
                <h2 id='sendTitle'>📧 Send Offers</h2>

                <form onSubmit={sendEmails} id='sendForm1'>
                    <input
                        type="text"
                        placeholder="Email subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        id='emailSub'
                        required
                    />

                    <textarea
                        placeholder="Write your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        id='emailMsg'
                        required
                    />

                    <div id="fileNames" style={{ border: receiptFiles.length > 0 ? "none" : "1px solid red" }}>
                        <div id="fLeft">
                            <label htmlFor="uploadReceipt" id="fileMore">
                                <div>{"Attach Offer Letter (Optional)"}</div>
                                <FontAwesomeIcon icon={faFile} />
                            </label>
                            <input type="file" id="uploadReceipt" onChange={handleReceiptFiles} style={{ display: "none" }} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                        </div>
                        <div id="fRight">
                            {receiptFiles.map((f, i) => (
                                <div key={i} id="fName">
                                    <FontAwesomeIcon icon={faFileClipboard} /> <div>{f.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <h2>Editing here will apply to all selected applicants</h2>
                    <form id='formChange'>
                        <div id='inpss'>
                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Programme:</label>
                            <select name="programme" onChange={handleProg} id="select">
                                <option value="">-- Select Programme --</option>
                                <option value="School of Business Innovation">School of Business Innovation</option>
                                <option value="School of Business Innovation / Bachelor of Arts Accounting and Finance">
                                    School of Business Innovation / Bachelor of Arts Accounting and Finance
                                </option>
                                <option value="School of Business Innovation / Bachelor of Arts in Banking and Finance">
                                    School of Business Innovation / Bachelor of Arts in Banking and Finance
                                </option>
                                <option value="School of Business Innovation / Bachelor of Arts in Business Administration">
                                    School of Business Innovation / Bachelor of Arts in Business Administration
                                </option>
                                <option value="School of Business Innovation / Bachelor of Arts in Entrepreneurship">
                                    School of Business Innovation / Bachelor of Arts in Entrepreneurship
                                </option>
                                <option value="School of Business Innovation / Bachelor of Arts in Procurement and Supply Chain Management">
                                    School of Business Innovation / Bachelor of Arts in Procurement and Supply Chain Management
                                </option>
                                <option value="School of Business Innovation / Bachelor of Arts in Marketing">
                                    School of Business Innovation / Bachelor of Arts in Marketing
                                </option>
                                <option value="School of Business Innovation / Master of Arts in Business Administration">
                                    School of Business Innovation / Master of Arts in Business Administration
                                </option>

                                <option value="School of Sustainable Development">School of Sustainable Development</option>
                                <option value="School of Sustainable Development / Bachelor of Arts in Human Resource Development">
                                    School of Sustainable Development / Bachelor of Arts in Human Resource Development
                                </option>
                                <option value="School of Sustainable Development / Bachelor of Arts in Youth Development">
                                    School of Sustainable Development / Bachelor of Arts in Youth Development
                                </option>
                                <option value="School of Sustainable Development / Bachelor of Arts in Community Development">
                                    School of Sustainable Development / Bachelor of Arts in Community Development
                                </option>
                                <option value="School of Sustainable Development / Bachelor of Arts in Guidance and Counseling">
                                    School of Sustainable Development / Bachelor of Arts in Guidance and Counseling
                                </option>
                                <option value="School of Sustainable Development / Bachelor of Science in Public Health">
                                    School of Sustainable Development / Bachelor of Science in Public Health
                                </option>
                                <option value="School of Sustainable Development / Masters in Mass Communication">
                                    School of Sustainable Development / Masters in Mass Communication
                                </option>
                                <option value="School of Sustainable Development / Master of Science in Health Management">
                                    School of Sustainable Development / Master of Science in Health Management
                                </option>
                                <option value="School of Sustainable Development / Master of Arts in Guidance and Counseling">
                                    School of Sustainable Development / Master of Arts in Guidance and Counseling
                                </option>

                                <option value="School of Diplomacy and International Relations">School of Diplomacy and International Relations</option>
                                <option value="School of Diplomacy and International Relations / Master of Arts in Diplomacy and International Relations">
                                    School of Diplomacy and International Relations / Master of Arts in Diplomacy and International Relations
                                </option>

                                <option value="School of Theology">School of Theology</option>
                                <option value="School of Theology / Bachelor of Arts in Theology and Religious Studies">
                                    School of Theology / Bachelor of Arts in Theology and Religious Studies
                                </option>
                                <option value="School of Theology / Masters in Theology and Religious Studies">
                                    School of Theology / Masters in Theology and Religious Studies
                                </option>
                                <option value="School of Theology / PhD in Theology and Religious Studies">
                                    School of Theology / PhD in Theology and Religious Studies
                                </option>

                                <option value="School of Education">School of Education</option>
                                <option value="School of Education / Bachelor of Arts in Education">
                                    School of Education / Bachelor of Arts in Education
                                </option>
                                <option value="School of Education / Bachelor of Science in Education">
                                    School of Education / Bachelor of Science in Education
                                </option>
                            </select>
                        </div>


                        {Object.keys(form).map((key) => (
                            <div key={key} id='inpss'>
                                <label
                                    htmlFor={key}
                                    style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                                </label>
                                <input
                                    type="text"
                                    id={key}
                                    name={key}
                                    value={form[key]}
                                    onChange={handleChange}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                    }}
                                />
                            </div>
                        ))}
                    </form>

                    <h4 style={{ marginTop: "10px" }} id='rec'>Recipients:</h4>
                    <div id='recepients'>
                        {users.map((user, index) => (
                            <div key={index} id='emailStaff'>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={user.firstName + " " + user.surname}
                                    onChange={(e) => handleUserChange(index, "name", e.target.value)}
                                    required
                                    id='name1'
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={user.email}
                                    onChange={(e) => handleUserChange(index, "email", e.target.value)}
                                    required
                                    id='name1'
                                />
                                <button id='viewMore' onClick={() => {
                                    setView(user);
                                    setOverlay(true)
                                }}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeUser(user)}
                                    id='remove'
                                >
                                    <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                                </button>
                            </div>
                        ))}
                    </div>
                    {feedback && <div id='feedBack'>{feedback}</div>}
                    <div id='emailButts'>
                        {/* <button type="button" onClick={addUser} id='readMorE1'>
                            <FontAwesomeIcon icon={faWhatsapp} id='iconn'></FontAwesomeIcon>
                            <div>Send WhatsApp</div>
                        </button> */}

                        <button onClick={sendGen} disabled={users.length <= 0 ? true : false} id='readMorE' style={{ marginBottom: "20px" }}>
                            <div>{loading ? "Sending..." : "Send generated Emails"}</div>
                            {loading ? <div id='loader4'></div> : <FontAwesomeIcon icon={faPaperPlane} id='iconn'></FontAwesomeIcon>}
                        </button>

                        <button type="submit" disabled={users.length <= 0 ? true : false} id='readMorE' style={{ marginBottom: "20px" }}>
                            <div>{loading ? "Sending..." : "Send Emails"}</div>
                            {loading ? <div id='loader4'></div> : <FontAwesomeIcon icon={faPaperPlane} id='iconn'></FontAwesomeIcon>}
                        </button>
                    </div>
                </form>


            </div>

            <FontAwesomeIcon icon={faCircleXmark} id='cancel' onClick={() => { props.setOverlay2(false) }}></FontAwesomeIcon>
        </div>
    )
}



export default SendOfferGen
