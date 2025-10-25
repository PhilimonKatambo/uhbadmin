import React, { useState } from "react";
import "./css/dialog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheckDouble, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";

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
                            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                            <div>Close</div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const RecoDialog = (props) => {

    const setIsOpen = props.setIsOpen;
    const setShowDialog = props.setShowDialog;
    const isOpen = props.isOpen;
    const showDialog = props.showDialog;
    const closeDialog = () => {
        setIsOpen(false);
        setTimeout(() => setShowDialog(false), 300);
    };

    const [selected, setSelected] = useState()

    return (
        <div style={{ display: isOpen ? "block" : "none" }}>
            {showDialog && (
                <div className={`dialog-overlay ${isOpen ? "open" : ""}`}>
                    <div className={`dialog-box ${isOpen ? "open" : ""}`}>
                        <h2 id="diaT">Recommend</h2>
                        <p id="diaMgs">Recommend Selected applicants to:</p>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <input id="reason" type="text" placeholder="Common Reason of recommending"></input>
                            <textarea id="additional" placeholder="Addition reason"></textarea>
                        </div>
                        {/* <textarea id="additional" vaule={"According to applicants' qualifications"} placeholder="Addition reason"></textarea> */}

                        <select name="programme" onChange={(e) => setSelected(e.target.value)} id="select">
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

                        <div id='buttsdia'>
                            <button onClick={closeDialog} id="readMore">
                                <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                                <div>Close</div>
                            </button>
                            <button onClick={() => {
                                props.updateApplicants("Recommended", document.getElementById("reason").value, document.getElementById("additional").value)
                                props.updateApplicantsReco(selected,)
                                closeDialog()
                            }} id="readMore2" style={{ backgroundColor: "red" }}>
                                <FontAwesomeIcon icon={faCheckDouble}></FontAwesomeIcon>
                                <div>Recommend</div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export { RecoDialog }
export default Dialog;
