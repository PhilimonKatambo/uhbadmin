import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faRightToBracket, faPrint, faFile, faThumbsDown, faXmark, faPlane, faPaperPlane, faAdd, faFileClipboard } from '@fortawesome/free-solid-svg-icons';
import './css/view.css'
import './css/views2.css'
import { useEffect, useRef, useState } from 'react';
import Dialog from './dialog';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { animate } from 'animejs';


const SendOffer = (props) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

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
            } else {
                setFeedback("❌ Failed to send: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            setFeedback("⚠️ Network or server error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (props.checkOverlay2) {
            animate(dialog, {
                duration: 300,
                easing: "easeOut",
                keyframes: [
                    { x: 0, opacity: 1 }
                ]
            });
        } else {
            animate(dialog, { x: "10%", opacity: 0 }, { duration: 0.05, ease: "easeIn" });
        }
    }, [props.checkOverlay2]);


    return (
        <div id='newOverlay' style={{ display: props.checkOverlay2 ? "flex" : "none" }} >
            {/* {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>} */}

            <div id='sendEmail' ref={dialogRef}>
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
                                <div>Attach Offer Letter</div>
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

                        <button type="submit" disabled={users.length <= 0 ? true : false} id='readMorE'>
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



export default SendOffer
