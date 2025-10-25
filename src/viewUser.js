import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faRightToBracket, faPrint, faFile, faThumbsDown, faCircleCheck, faSquareCheck, faUserPlus, faUser, faGraduationCap, faWind, faCalendar, faTurnUp, faEye, faEnvelopeOpenText, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './css/view.css'
import './css/views2.css'
import './css/viewHis.css'
import { useEffect, useRef, useState } from 'react';
import Dialog from './dialog';
import ViewApplicant from './viewApplicant';
import { faLetterboxd } from '@fortawesome/free-brands-svg-icons';


const ViewUser = (props) => {

    const User=props.User
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

    const [operated, setOperated] = useState({})

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const deleteNews = async (id) => {
        try {
            //alert(id)
            const response = await fetch(`http://localhost:9000/users/${id}`, {
                method: "DELETE"
            })
            if (!response.ok) {
                setMessage(["Failed delete", "Can't delete news"])
                openDialog()
            }
            props.setRefresh(prev => !prev);
        } catch (e) {
            setMessage(["Failed delete", "Can't delete news"])
            openDialog()
        }
    }

    return (

        <div id='newOverlay' style={{ display: props.checkOverlay2 ? "flex" : "none" }} >
            {/* {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>} */}
            <div id='hisBody' ref={formRef}>
                <h2>User details</h2>
                <div style={{ backgroundImage: "url(./assets/logos/logo3.jpg" }} id='logoBack2'></div>

                <div id='data90'>
                    <FontAwesomeIcon icon={faCircleCheck} id='icon1'></FontAwesomeIcon>
                    <label>First name:</label>
                    <div id='actual'>{User?.firstName}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faUserPlus} id='icon1'></FontAwesomeIcon>
                    <label>Surname:</label>
                    <div id='actual'>{User?.surName}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faGraduationCap} id='icon1'></FontAwesomeIcon>
                    <label>User ID:</label>
                    <div id='actual'>{User?.userId}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faGraduationCap} id='icon1'></FontAwesomeIcon>
                    <label>Email:</label>
                    <div id='actual'>{User?.userEmail}</div>
                </div>
                <div id='data90'>
                    <FontAwesomeIcon icon={faTurnUp} id='icon1'></FontAwesomeIcon>
                    <label>UserRole:</label>
                    <div id='actual'>{User?.userRole}</div>
                </div>
                
                <div id="downButt" style={{ zIndex: "100000" }}>
                    <button id='submit1' onClick={() => setOverlay(true)}>
                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                        <div>Update</div>
                    </button>
                    <button id='submit1' onClick={() => printForm()}>
                        <FontAwesomeIcon icon={faPrint}></FontAwesomeIcon>
                        <div>Print</div>
                    </button>
                    <button  onClick={() => props.deleteNews(User?._id)} style={{backgroundColor:"red",color:"White",border:"0px", padding:"10px 20px",borderRadius:"10px",display:"flex",width:"fit-content",gap:"10px"}}>
                        <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                        <div>Delete</div>
                    </button>
                </div>
            </div>

            {/* <ViewApplicant checkOverlay={checkOverlay} setOverlay={setOverlay} applicant={operated} /> */}
            <FontAwesomeIcon icon={faCircleXmark} id='cancel' onClick={() => { props.setOverlay2(false) }}></FontAwesomeIcon>
        </div>
    )
}

export default ViewUser

