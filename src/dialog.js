import React, { useState } from "react";
import "./css/dialog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel } from "@fortawesome/free-solid-svg-icons";

const Dialog = (props) => {

    const setIsOpen = props.setIsOpen;
    const setShowDialog = props.setShowDialog;
    const isOpen = props.isOpen;
    const showDialog = props.showDialog;
    const closeDialog = () => {
        setIsOpen(false);
        setTimeout(() => setShowDialog(false), 300);
    };

    return (
        <div style={{ display: isOpen ? "block" : "none" }}>
            {showDialog && (
                <div className={`dialog-overlay ${isOpen ? "open" : ""}`}>
                    <div className={`dialog-box ${isOpen ? "open" : ""}`}>
                        <h2 id="diaT">{props.msg[0]}</h2>
                        <p id="diaMgs">{props.msg[1]}</p>
                        <button onClick={closeDialog} id="readMore">
                            <FontAwesomeIcon icon={faCancel}></FontAwesomeIcon>
                            <div>Close</div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dialog;
