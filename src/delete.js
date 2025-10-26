import { faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./css/dialog.css";
const Delete2 = (props) => {

    const selected = props.selected

    const closeDialog2 = () => {
        props.setIsOpen2(false);
        setTimeout(() => props.setShowDialog2(false), 300);
    };

    const deleteFirst = async () => {
        try {
            props.setLoader(true)
            await Promise.all(
                selected.map(async (applicant) => {
                    if (applicant.form === "undergrad") {
                        const response = await fetch(`https://mongodb-5-7rnl.onrender.com/undergraduate/applicants/${applicant._id}`, {
                            method: "DELETE",
                        });
                        if (!response.ok) {
                            console.error(`Failed to delete files for ${applicant._id}`);
                        }
                    } else {
                        const response = await fetch(`https://mongodb-5-7rnl.onrender.com/postgraduate/applicants/${applicant._id}`, {
                            method: "DELETE",
                        });
                        if (!response.ok) {
                            console.error(`Failed to delete files for ${applicant._id}`);
                        }
                    }
                })
            );
            deleteApplicants()
            // setRefresh(prev => !prev);
            // setSelected([]);
        } catch (e) {
            props.openDialog();
            props.setMessage(["Deleting problem", `Can't be deleted, try again later`]);
        }
    }

    const deleteApplicants = async () => {
        try {
            await Promise.all(
                selected.map(async (applicant) => {
                    const response = await fetch(`https://mongodb-5-7rnl.onrender.com/fileserver/files/${applicant.uploaderId}`, {
                        method: "DELETE",
                    });
                    if (!response.ok) {
                        console.error(`Failed to delete files for ${applicant.uploaderId}`);
                    }
                })
            );
            props.setRefresh(prev => !prev);
            props.setSelected([]);
            props.openDialog();
            props.setMessage(["Deleting", 'Selected applicants are deleted']);
            props.setLoader(false)

            selected.map((applicant)=>{
                props.saveHistory(applicant,"Deleted","Deleting", "Deletion")
            })
        } catch (e) {
            props.openDialog();
            props.setMessage(["Deleting problem", `Can't be deleted, try again later`]);
            props.setLoader(false)
        }
    };

    return (
        <div className={`dialog-overlay ${props.isOpen2 ? "open" : ""}`}>
            <div className={`dialog-box ${props.isOpen2 ? "open" : ""}`}>
                <h2 id="diaT">{props.msg2[0]}</h2>
                <p id="diaMgs">{props.msg2[1]}</p>
                <div id='buttsdia'>
                    <button onClick={closeDialog2} id="readMore">
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                        <div>Close</div>
                    </button>
                    <button onClick={() => {
                        deleteFirst();
                        closeDialog2()
                    }} id="readMore2" style={{ backgroundColor: "red" }}>
                        <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                        <div>Yes</div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Delete2