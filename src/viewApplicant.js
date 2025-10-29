import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faRightToBracket, faPrint, faFile, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import './css/view.css'
import './css/views2.css'
import { useRef, useState } from 'react';
import Dialog from './dialog';


const ViewApplicant = (props) => {
    const applicant = props.applicant;

    const [checkSubmit, setCheckSubmit] = useState(false);
    const [checkSubmit2, setCheckSubmit2] = useState(false);
    const formRef = useRef(null)

    const [isOpen, setIsOpen] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [msg, setMsg] = useState([])

    const [status1,setStatus1] = useState(false)
    const [status2,setStatus2] = useState(false)
    

    const printForm = () => {
        const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
            .map(node => node.outerHTML)
            .join("\n")
        const win = window.open("", "", "height=700,width=900")
        win.document.write("<html><head><title>Print PDF</title></head><body>")
        win.document.write(formRef.current.innerHTML)
        win.document.write(styles)
        win.document.write("</body></html>")
        win.document.close()
        win.print()
    }

    const [loading, setLoading] = useState(false);

    const downLoadFiles = async (uploader, uploaderId, use) => {
        try {
            const response = await fetch(`https://mongodb-5-7rnl.onrender.com/fileserver/files/${uploader}/${uploaderId}/${use}`);

            if (!response.ok) {
                throw new Error("File not found");
            }

            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const contentDisposition = response.headers.get("Content-Disposition");
            const filename = `${uploader}-files`;

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setMsg(["File problem", `Can't find file`])
            setShowDialog(true)
            setIsOpen(true)
        } finally {
            setLoading(false);
        }
    }


    return (
        <div id='newOverlay' style={{ display: props.checkOverlay ? "flex" : "none" }} >
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}

            <div id="undergradPage">

                <div className="form-container" ref={formRef}>
                    <h2>UHB Undergraduate Application Form</h2>
                    <img id="coverPage" src="./assets/images/coverPage.png" alt="cover" />

                    <div id="fileNames">
                        <div id="fLeft">
                            <div id='fileMore' onClick={() => { downLoadFiles(applicant?.firstName + "-" + applicant?.surname, applicant?.uploaderId, "file1") }}>
                                View Fee Payment Receipt
                                <FontAwesomeIcon icon={faFile}></FontAwesomeIcon>
                            </div>
                        </div>
                        {/* <div id="fRight">
                            {indQual1?.map((file, i) => (
                                <div key={i} id="fName">
                                    <FontAwesomeIcon icon={faFileClipboard} /> <div>{file.name}</div>
                                </div>
                            ))}
                        </div> */}
                    </div>


                    <h2>A. STUDENT DETAILS</h2>
                    <div id="studentDetails">
                        <div id="inps">
                            <div id='label'>Surname:</div>
                            <div>{applicant?.surname}</div>
                        </div>
                        <div id="inps"><div id='label'>First Name:</div><div>{applicant?.firstName}</div></div>
                        <div id="inps"><div id='label'>Middle Name:</div><div>{applicant?.middleName}</div></div>
                        <div id="inps"><div id='label'>Marital Status:</div><div>{applicant?.maritalStatus}</div></div>
                        <div id="inps"><div id='label'>Gender:</div><div>{applicant?.gender}</div></div>
                        <div id="inps"><div id='label'>Nationality:</div><div>{applicant?.nationality}</div></div>
                        <div id="inps"><div id='label'>Country:</div><div>{applicant?.country}</div></div>
                        <div id="inps"><div id='label'>NRC / Passport No.:</div><div>{applicant?.idNumber}</div></div>
                        <div id="inps"><div id='label'>District:</div><div>{applicant?.district}</div></div>
                        <div id="inps"><div id='label'>T/A:</div><div>{applicant?.ta}</div></div>
                        <div id="inps"><div id='label'>Village:</div><div>{applicant?.village}</div></div>
                        <div id="inps"><div id='label'>Date of Birth:</div><div>{new Date(applicant?.dateOfBirth).toLocaleString("en-GB")}</div></div>
                        <div id="inps"><div id='label'>Place of Birth:</div><div>{applicant?.placeOfBirth}</div></div>
                        <div id="inps"><div id='label'>Contact Address:</div><div>{applicant?.address}</div></div>
                        <div id="inps"><div id='label'>Cell:</div><div>{applicant?.phoneCell}</div></div>
                        <div id="inps"><div id='label'>Home Phone:</div><div>{applicant?.phoneHome}</div></div>
                        <div id="inps"><div id='label'>Office Phone:</div><div>{applicant?.phoneOffice}</div></div>
                        <div id="inps"><div id='label'>Email:</div><div>{applicant?.email}</div></div>
                    </div>


                    <h2>B. ACADEMIC DETAILS</h2>
                    <div id="studentDetails">
                        <div id="inps"><div id='label'>Programme Applying For:</div><div>{applicant?.academicDetails?.[0]?.programme || "N/A"}</div></div>
                        <div id="inps"><div id='label'>Highest Qualification:</div><div>{applicant?.academicDetails?.[0]?.qualification}</div></div>
                        <div id="inps"><div id='label'>Adv. Dip / Diploma / MSCE:</div><div>{applicant?.academicDetails?.[0]?.advDiploma ? "Yes" : "No"}</div></div>
                        <div id="inps"><div id='label'>Other Qualification:</div><div>{applicant?.academicDetails?.[0]?.otherQualification}</div></div>
                        <div id="inps"><div id='label'>Year Obtained:</div><div>{applicant?.academicDetails?.[0]?.yearObtained}</div></div>
                    </div>


                    <div id="fileNames">
                        <div id="fLeft">
                            <div id='fileMore' onClick={() => { downLoadFiles(applicant?.firstName + "-" + applicant?.surname, applicant?.uploaderId, "file2") }}>
                                View Certificate
                                <FontAwesomeIcon icon={faFile}></FontAwesomeIcon>
                            </div>
                        </div>
                        {/* <div id="fRight">
                            {indQual2?.map((file, i) => (
                                <div key={i} id="fName">
                                    <FontAwesomeIcon icon={faFileClipboard} /> <div>{file.name}</div>
                                </div>
                            ))}
                        </div> */}
                    </div>


                    <table>
                        <thead><tr><th>Subject</th><th>Grade</th></tr></thead>
                        <tbody>
                            {applicant?.academicDetails?.[0]?.subjects?.map((s, i) => (
                                <tr key={i}><td>{s.subject}</td><td>{s.grade}</td></tr>
                            ))}
                        </tbody>
                    </table>


                    <h2>C. MODE OF STUDY</h2>
                    <div id="modeST">
                        {applicant?.modeOfStudy?.map((mode, i) => <div key={i} style={{ marginLeft: "20px" }}>{mode}</div>)}
                    </div>


                    <h2>D. GUARDIAN</h2>
                    <div id="studentDetails">
                        <div id="inps">
                            <div id='label'>Full Name:</div>
                            <div>{applicant?.guardian?.name}</div>
                        </div>
                        <div id="inps"><div id='label'>Address:</div><div>{applicant?.guardian?.address}</div></div>
                        <div id="inps"><div id='label'>Email:</div><div>{applicant?.guardian?.email}</div></div>
                        <div id="inps"><div id='label'>Cell:</div><div>{applicant?.guardian?.cell}</div></div>
                    </div>


                    <h2>E. Motivation & Expectations</h2>
                    <div>{applicant?.expectation}</div>
                    <div id='label'>How did you know about UHB?</div>
                    <div id="modeST">
                        {applicant?.refSource?.map((src, i) => <div key={i} style={{ marginLeft: "20px" }}>{src}</div>)}
                    </div>


                    <h2>F. Student Declaration</h2>
                    <div id="studentDetails">
                        <div id="inps"><div id='label'>Signature:</div><div>{applicant?.studentDeclaration?.signature}</div></div>
                        <div id="inps"><div id='label'>Date:</div><div>{new Date(applicant?.studentDeclaration?.date).toLocaleString("en-GB")}</div></div>
                    </div>


                    <div id="fileNames">
                        <div id="fLeft">
                            <div id='fileMore' onClick={() => { downLoadFiles(applicant?.firstName + "-" + applicant?.surname, applicant?.uploaderId, "file3") }}>
                                Additional Qualifications
                                <FontAwesomeIcon icon={faFile}></FontAwesomeIcon>
                            </div>
                        </div>
                        {/* <div id="fRight">
                            {indQual3?.map((file, i) => (
                                <div key={i} id="fName">
                                    <FontAwesomeIcon icon={faFileClipboard} /> <div>{file.name}</div>
                                </div>
                            ))}
                        </div> */}
                    </div>


                    <h2>Office Use</h2>
                    <div id="studentDetails">
                        <div id="inps"><div id='label'>Academic Year:</div><div>{applicant?.officeUse?.academicYear}</div></div>
                        <div id="inps"><div id='label'>Application No.:</div><div>{applicant?.officeUse?.applicationNo}</div></div>
                        <div id="inps"><div id='label'>Receipt No.:</div><div>{applicant?.officeUse?.receiptNo}</div></div>
                        <div id="inps"><div id='label'>Review Date:</div><div>{new Date(applicant?.officeUse?.reviewDate).toLocaleString("en-GB")}</div></div>
                        <div id="inps"><div id='label'>Approved:</div><div>{applicant?.officeUse?.approved ? "Yes" : "No"}</div></div>
                        <div id="inps"><div id='label'>Student No.:</div><div>{applicant?.officeUse?.studentNo}</div></div>
                        <div id="inps"><div id='label'>Admin Signature:</div><div>{applicant?.officeUse?.signature}</div></div>
                    </div>

                    {/* <div id="downButt">
                        <button type="submit" id='submit1' className="submit-btn" onClick={() => { updateApplicant?s("Approved") }} disabled={applicant?.status === "Approved" ? true : false}>
                            {checkSubmit ? "Approving..." : "Approve"}
                            {checkSubmit ? <div className="loader"></div> : <FontAwesomeIcon icon={faRightToBracket} />}
                        </button>

                        <button type="submit2" id='submit2' onClick={() => { updateApplicant?s("Disapproved") }} disabled={applicant?.status === "Disapproved" ? true : false}>
                            {checkSubmit2 ? "Disapproving..." : "Disapprove"}
                            {checkSubmit2 ? <div className="loader"></div> : <FontAwesomeIcon icon={faThumbsDown} />}
                        </button>
                        
                        <button type="button3" className="submit-btn" onClick={printForm}>
                            <div>Print</div>
                            <FontAwesomeIcon icon={faPrint} />
                        </button>
                    </div> */}

                </div>
            </div>

            <FontAwesomeIcon icon={faCircleXmark} id='cancel' onClick={() => { props.setOverlay(false) }}></FontAwesomeIcon>
        </div>
    )
}

export default ViewApplicant
