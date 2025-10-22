import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faRightToBracket, faPrint, faFile, faThumbsDown, faCircleCheck, faSquareCheck, faUserPlus, faUser, faGraduationCap, faWind, faCalendar, faTurnUp, faEye, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import './css/view.css'
import './css/views2.css'
import './css/viewHis.css'
import { useRef, useState } from 'react';
import Dialog from './dialog';
import ViewApplicant from './viewApplicant';
import { faLetterboxd } from '@fortawesome/free-brands-svg-icons';


const ViewHis = (props) => {

    const [checkOverlay, setOverlay] = useState(false)
    const formRef = useRef(null)
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

    return (
        <div id='newOverlay' style={{ display: props.checkOverlay2 ? "flex" : "none" }} >
            {/* {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>} */}
            <div id='hisBody' ref={formRef}>
                <h2>History details</h2>
                <div style={{ backgroundImage: "url(./assets/logos/logo3.jpg" }} id='logoBack2'></div>

                <div id='data90'>
                    <FontAwesomeIcon icon={faCircleCheck} id='icon1'></FontAwesomeIcon>
                    <label>Operation:</label>
                    <div id='actual'>{props.history.operation}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faUserPlus} id='icon1'></FontAwesomeIcon>
                    <label>Operator:</label>
                    <div id='actual'>{props.operator.firstName + " " + props.operator.surName}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faGraduationCap} id='icon1'></FontAwesomeIcon>
                    <label>Applicant:</label>
                    <div id='actual'>{props.operated.firstName + " " + props.operated.surname}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faTurnUp} id='icon1'></FontAwesomeIcon>
                    <label>Level:</label>
                    <div id='actual'>{props.history.operatedType === "postgrad" ? "PostGraduate applicant" : "UnderGraduate applicant"}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faWind} id='icon1'></FontAwesomeIcon>
                    <label>Purpose:</label>
                    <div id='actual2'>{props.history.reason === "" ? "All required" : props.history.reason}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faEnvelopeOpenText} id='icon1'></FontAwesomeIcon>
                    <label>Explaination:</label>
                    <div id='actual2'>{props.history.additionalText === "" ? "All required" : props.history.additionalText}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faCalendar} id='icon1'></FontAwesomeIcon>
                    <label>Date & Time:</label>
                    <div id='actual'>{new Date(props.history.createdAt).toLocaleString()}</div>
                </div>

                <div id="downButt" style={{ zIndex: "100000" }}>
                    <button id='submit1' onClick={() => setOverlay(true)}>
                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                        <div>View Applicant details</div>
                    </button>
                    <button id='submit1' onClick={() => setOverlay(true)}>
                        <FontAwesomeIcon icon={faFile}></FontAwesomeIcon>
                        <div>View offer later</div>
                    </button>
                    <button id='submit1' onClick={() => printForm()}>
                        <FontAwesomeIcon icon={faPrint}></FontAwesomeIcon>
                        <div>Print</div>
                    </button>
                </div>
            </div>

            <ViewApplicant checkOverlay={checkOverlay} setOverlay={setOverlay} applicant={props.operated} />
            <FontAwesomeIcon icon={faCircleXmark} id='cancel' onClick={() => { props.setOverlay2(false) }}></FontAwesomeIcon>
        </div>
    )
}

export default ViewHis

