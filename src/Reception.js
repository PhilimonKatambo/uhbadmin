import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/dashboard.css';
import { fa1, faBan, faCheckDouble, faCheckToSlot, faComputer, faDeleteLeft, faEye, faEyeDropper, faGraduationCap, faRefresh, faRightFromBracket, faSearch, faSquareCheck, faTrashCan, faUserGraduate, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare, faNewspaper, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faFirstOrderAlt } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useRef, useState } from 'react';
import Dialog from './dialog';
import ViewApplicant from './viewApplicant';
import $ from "jquery"
import "jquery-ui-bundle";
import "jquery-ui-bundle/jquery-ui.css";
import { LeftSideBar } from './dashboard';
import { animate, stagger } from "animejs";

const Reception = () => {
    return (
        <div id='body'>
            <LeftSideBar />
            <ReceRight />
        </div>
    )
}

const ReceRight = () => {

    const [status1, setStatus] = useState("All")
    const [selected, setSelected] = useState([])
    const [applicants, setApplicants] = useState([])
    const [applicants2, setApplicants2] = useState([])

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])

    const [isOpen2, setIsOpen2] = useState(false);
    const [showDialog2, setShowDialog2] = useState(false);
    const [msg2, setMessage2] = useState([])
    const [typa, setTypa] = useState('normal')

    const [refresh, setRefresh] = useState(false)

    const [autoComplete, setAutocomplete] = useState([])
    const [mode, setMode] = useState("All")
    let allComplete = []

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch('http://localhost:1000/applicants', {
                    method: 'Get',
                });
                if (!response.ok) {
                    throw new Error("Failed to retrive news")
                }
                const data = await response.json();
                setApplicants2(data);
                setApplicants(data);
                const i = 0;
                data.forEach(element => {
                    allComplete.push(element.firstName + element.surname)
                });

                setAutocomplete(allComplete)

            } catch (e) {
                openDialog();
                setMessage(["Fetching problem", "Can't find applicants, please try again later!"])
            }
        }
        getData();
    }, [refresh])

    const changeCheck = (div, applicant) => {
        if (!selected.includes(applicant)) {
            div.style.color = "#08bb26";
            setSelected(prev => [...prev, applicant]);

        } else {
            div.style.color = "grey";
            setSelected(prev => prev.filter(a => a !== applicant));
        }
    };

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const selectAll = (div) => {
        const color = window.getComputedStyle(div).color
        if (color === "rgb(128, 128, 128)") {
            div.style.color = "#08bb26";
            //setSelected([...selected, applicants])
        } else {
            div.style.color = "grey";
            // setSelected([])
        }
    }

    const updateApplicants = async (update) => {
        try {
            for (const applicant of selected) {
                applicant.status = update

                const response = await fetch(`http://localhost:1000/underApply/${applicant._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status: update })
                })

                if (!response.ok) {

                } else {
                    const updatedData = await response.json()
                    setRefresh(!refresh)
                    setSelected([])
                }
            }


        } catch (e) {
            openDialog();
            setMessage(["Update problem", `Can't be ${update}, try again letter`])
        }
    }

    const [loader, setLoader] = useState(false);

    const deleteFirst = async () => {
        try {
            setLoader(true)
            await Promise.all(
                selected.map(async (applicant) => {
                    const response = await fetch(`http://localhost:1000/applicants/${applicant._id}`, {
                        method: "DELETE",
                    });
                    if (!response.ok) {
                        console.error(`Failed to delete files for ${applicant._id}`);
                    }
                })
            );
            deleteApplicants()
            // setRefresh(prev => !prev);
            // setSelected([]);
        } catch (e) {
            openDialog();
            setMessage(["Deleting problem", `Can't be deleted, try again later`]);
        }
    }

    const deleteApplicants = async () => {
        try {
            await Promise.all(
                selected.map(async (applicant) => {
                    console.log(applicant.uploaderId)
                    const response = await fetch(`http://localhost:4000/files/${applicant.uploaderId}`, {
                        method: "DELETE",
                    });
                    if (!response.ok) {
                        console.error(`Failed to delete files for ${applicant.uploaderId}`);
                    }
                })
            );
            setRefresh(prev => !prev);
            setSelected([]);
            openDialog();
            setMessage(["Deleting", 'Selected applicants are deleted']);
            setLoader(false)
        } catch (e) {
            openDialog();
            setMessage(["Deleting problem", `Can't be deleted, try again later`]);
            setLoader(false)
        }
    };


    useEffect(() => {
        setApplicants(applicants || []);
        // $(function () {
        //     $("#sarchInput").autocomplete({
        //         source: autoComplete
        //     });
        // });
    }, [applicants, autoComplete])



    const check = (main, sub) => {
        main = main.toLowerCase();
        sub = sub.toLowerCase();
        return [...sub].every(ch => main.includes(ch))
    }

    const autoFind = (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filtered = applicants2.filter(applicant => {
            const fullName = (applicant.firstName + applicant.surname).toLowerCase();
            return check(fullName, searchTerm);
        });

        setApplicants(filtered);
    }


    const [checkOverlay, setOverlay] = useState(false)
    const [view, setView] = useState([]);

    const reload = useRef(null)

    const refreshed = () => {
        setRefresh(!refresh);
        animate(reload.current, {
            duration: 1200,
            easing: "easeOutExpo",
            keyframes: [
                { opacity: 0, rotate: 360 },
                { opacity: 1, rotate: 0 }
            ],
        });
    }

    const openDialog2 = () => {
        setShowDialog2(true);
        setTimeout(() => setIsOpen2(true), 10);
    }

    const closeDialog2 = () => {
        setIsOpen2(false);
        setTimeout(() => setShowDialog2(false), 300);
        setTypa('normal')
    };

    return (
        <div id='rightSide'>
            {/* delete dialog */}
            <div style={{ display: isOpen2 ? "block" : "none" }}>
                {showDialog2 && (
                    <div className={`dialog-overlay ${isOpen2 ? "open" : ""}`}>
                        <div className={`dialog-box ${isOpen2 ? "open" : ""}`}>
                            <h2 id="diaT">{msg2[0]}</h2>
                            <p id="diaMgs">{msg2[1]}</p>
                            <div id='buttsdia'>
                                <button onClick={closeDialog2} id="readMore">
                                    <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                                    <div>Close</div>
                                </button>
                                {typa === "delete" ? <button onClick={() => {
                                    deleteFirst();
                                    closeDialog2()
                                }} id="readMore2" style={{backgroundColor:"red"}}>
                                    <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                                    <div>Yes</div>
                                </button> : <div></div>}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div id='rightDown2'>
                <ViewApplicant checkOverlay={checkOverlay} setOverlay={setOverlay} applicant={view} refresh={refresh} setRefresh={setRefresh} />
                {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}

                <div id='rightUp'>
                    <div id='name'>{mode}</div>
                    <div id='search'>
                        <input type='text' id='sarchInput' placeholder='Search' onChange={autoFind}></input>
                        <FontAwesomeIcon icon={faSearch} id='searchIcon'></FontAwesomeIcon>
                    </div>
                    <div id='ops'>
                        <button id='accept' disabled={selected.length > 0 ? false : true} onClick={() => updateApplicants("Approved")}>
                            <FontAwesomeIcon icon={faCheckToSlot}></FontAwesomeIcon>
                            <div id='approve'>Approve</div>
                        </button>

                        <button id='disapprove' disabled={selected.length > 0 ? false : true} onClick={() => updateApplicants("Disapproved")}>
                            <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
                            <div id='approve'>Disapprove</div>
                        </button>

                        <button id='delete' disabled={selected.length > 0 ? false : true} onClick={() => {
                            setTypa("delete")
                            setMessage2(["Confirm", `Are your sure, deleting ${selected.length === 1 ? "1 applicant" : selected.length + " applicants"} `]);
                            openDialog2()
                        }}>
                            {loader ? <div class='loader'></div> : <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>}
                            {loader ? <div id='approve'>Deleting...</div> : <div id='approve'>Delete</div>}
                        </button>
                    </div>
                </div>

                <div id='otherButtons'>
                    <div id='otherLeft'>
                        <button id='butts' onClick={() => setStatus("All")} style={{ color: status1 === "All" ? "#25517e" : "grey" }}>All</button>
                        <button id='butts' onClick={() => setStatus("Inactive")} style={{ color: status1 === "Inactive" ? "#25517e" : "grey" }}>Inactive</button>
                        <button id='butts' onClick={() => setStatus("Approved")} style={{ color: status1 === "Approved" ? "#25517e" : "grey" }}>Approved</button>
                        <button id='butts' onClick={() => setStatus("Disapproved")} style={{ color: status1 === "Disapproved" ? "#25517e" : "grey" }}>Disapproved</button>
                        <FontAwesomeIcon icon={faRefresh} ref={reload} onClick={refreshed} id='refresh'></FontAwesomeIcon>
                    </div>
                    <div id='otherRight'>
                        {selected.length} Selected
                    </div>
                </div>

                <div id='table'>
                    <table>
                        <tr>
                            <th>
                                <button onClick={(e) => { selectAll(e.target) }} id='checkAll' style={{ border: "0px", color: "rgb(128, 128, 128)", padding: "0px" }}>
                                    <FontAwesomeIcon icon={faSquareCheck} style={{ fontSize: "1.5rem" }} />
                                    <div>Check all</div>
                                </button>
                            </th>
                            <td></td>
                            <th>
                                <div id='th'>
                                    <FontAwesomeIcon icon={fa1} id='icoo'></FontAwesomeIcon>
                                    <div>First name</div>
                                </div>
                            </th>
                            <th>Surname</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Nationality</th>
                            <th>Home Phone</th>
                            <th></th>
                        </tr>

                        {
                            applicants.length > 0 ?
                                applicants.map((applicant, index) => (
                                    (status1 === "All" || applicant.status === status1) ?
                                        <tr key={applicant._id}>
                                            <td>
                                                <button onClick={(e) => { changeCheck(e.target, applicant) }} style={{ border: "0px", color: "rgb(128, 128, 128)", padding: "0px" }}>
                                                    <FontAwesomeIcon icon={faSquareCheck} style={{ fontSize: "1.5rem" }} />
                                                </button>
                                            </td>
                                            <td>
                                                <div id='th'>
                                                    <button id='viewMore' onClick={() => {
                                                        setView(applicant);
                                                        setOverlay(true)
                                                    }}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <div>{applicant.status === "All" ? "No status" : applicant.status}</div>
                                                </div>
                                            </td>
                                            <td>{applicant.firstName}</td>
                                            <td>{applicant.surname}</td>
                                            <td>{applicant.email}</td>
                                            <td>{applicant.gender}</td>
                                            <td>{applicant.nationality}</td>
                                            <td>{applicant.phoneHome}</td>
                                        </tr>
                                        : null //<div id='noData'>There is no applicants here</div>
                                )) : <div id='loadingFetch'>
                                    <div id='loader'></div>
                                    <div id='getFetch'>Loading...</div>
                                </div>
                        }

                    </table>
                </div>
            </div>
        </div>
    )
}

export default Reception