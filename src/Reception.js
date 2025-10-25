import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/dashboard.css';
import { fa1, faBan, faCheckDouble, faCheckToSlot, faCircleXmark, faComputer, faDeleteLeft, faEye, faEyeDropper, faGraduationCap, faRefresh, faRightFromBracket, faSearch, faSquareCheck, faTrashCan, faUserGraduate, faXmark } from '@fortawesome/free-solid-svg-icons';
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
import Delete2 from './delete';
import SendDenial from './denial';
import { useSelector } from 'react-redux';

const Reception = () => {
    return (
        <div id='body'>
            <LeftSideBar />
            <ReceRight />
        </div>
    )
}

const ReceRight = () => {

    const [status1, setStatus] = useState("Inactive")
    const [selected, setSelected] = useState([])
    const [applicants, setApplicants] = useState([])
    const [applicants2, setApplicants2] = useState([])

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])

    const [refresh, setRefresh] = useState(false)

    const [autoComplete, setAutocomplete] = useState([])
    const [mode, setMode] = useState("All")
    let allComplete = []

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch('http://localhost:1000/applicants', {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error("Failed to retrive news")
                }
                const data = await response.json();

                const sortedData = [...data].sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                setApplicants2(sortedData);
                setApplicants(sortedData);
                const i = 0;
                data.forEach(element => {
                    allComplete.push(element.firstName + element.surname)
                });

                setAutocomplete(allComplete)
                getData2();
            } catch (e) {
                openDialog();
                setMessage(["Fetching problem", "Can't find applicants, please try again later!"])
            }
        }
        getData();
    }, [refresh])

    const getData2 = async () => {
        try {
            const response = await fetch('http://localhost:2000/postgradApplicants', {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error("Failed to retrive news")
            }
            const data = await response.json();

            setApplicants2(prev => [...prev, ...data]);
            setApplicants(prev => [...prev, ...data]);


            const i = 0;
            data.forEach(element => {
                allComplete.push(element.firstName + " " + element.surname)

            });
        } catch (e) {
            openDialog();
            setMessage(["Fetching problem", "Can't find applicants, please try again later!"])
        }
    }


    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };



    const updateApplicants = async (update, reason, additionalText) => {
        try {
            for (const applicant of selected) {
                applicant.status = update

                if (applicant.form === "undergrad") {
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
                        unCheckAll()
                        saveHistory(applicant, update, reason, additionalText)
                    }
                } else {
                    const response = await fetch(`http://localhost:2000/postgradApply/${applicant._id}`, {
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
                        unCheckAll()
                        saveHistory(applicant, update, reason, additionalText)
                    }
                }


            }


        } catch (e) {
            console.log("Hello", e)
            openDialog();
            setMessage(["Update problem", `Can't be ${update}, try again letter`])
        }
    }

    const user = useSelector((state) => state.user.user);
    const saveHistory = async (selected, update, reason1, additionalText1) => {

        try {
            const response = await fetch("http://localhost:1200/history", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    operator: user._id,
                    operatorOn: selected._id,
                    operatorOnName: selected.firstName+" "+selected.surname,
                    operation: update,
                    operatedType: selected.form,
                    reason: reason1 ? reason1 : "Common reason",
                    additionalText: additionalText1 ? additionalText1 : "We would like to inform any information!",
                })
            })
        } catch (err) {
            console.log("error", err)
        }
    }


    const [loader, setLoader] = useState(false);

    const delete1 = (msg1, msg2) => {
        openDialog();
        setMessage([msg1, msg2])
    }

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
    const [checkOverlay2, setOverlay2] = useState(false)
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


    const [isOpen2, setIsOpen2] = useState(false);
    const [showDialog2, setShowDialog2] = useState(false);
    const [msg2, setMessage2] = useState([])

    const openDialog2 = () => {
        setShowDialog2(true);
        setTimeout(() => setIsOpen2(true), 10);
    }

    const [allChecked, setAllChecked] = useState([])

    const checkAll = () => {
        const check = document.querySelectorAll("#checkB");
        check.forEach(element => {
            element.checked = true
        });
        setSelected(applicants);
    }

    const unCheckAll = () => {
        const check = document.querySelectorAll("#checkB");
        check.forEach(element => {
            element.checked = false
        });
        setSelected([]);
    }



    return (
        <div id='rightSide'>
            {/* delete dialog */}
            <div style={{ display: isOpen2 ? "block" : "none" }}>
                {showDialog2 && (<Delete2 isOpen2={isOpen2} msg2={msg2} setShowDialog2={setShowDialog2} setIsOpen2={setIsOpen2} setMessage2={setMessage2} selected={selected} setLoader={setLoader} openDialog={openDialog} setMessage={setMessage} setRefresh={setRefresh} setSelected={setSelected} saveHistory={saveHistory}/>)}
            </div>

            <SendDenial selected={selected} setSelected={setSelected} setOverlay2={setOverlay2} checkOverlay2={checkOverlay2} updateApplicants={updateApplicants} method={"disapproval"} />

            <div id='rightDown2'>
                <ViewApplicant checkOverlay={checkOverlay} setOverlay={setOverlay} applicant={view} refresh={refresh} setRefresh={setRefresh} />
                {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}

                <div id='rightUp'>
                    <div id='name3'>{mode}</div>
                    <div id='search'>
                        <input type='text' id='sarchInput' placeholder='Search' onChange={autoFind}></input>
                        <FontAwesomeIcon icon={faSearch} id='searchIcon'></FontAwesomeIcon>
                    </div>
                    <div id='ops'>
                        <button id='accept' disabled={selected.length > 0 ? false : true} onClick={() => updateApplicants("Approved")}>
                            <FontAwesomeIcon icon={faCheckToSlot}></FontAwesomeIcon>
                            <div id='approve'>Approve</div>
                        </button>

                        <button id='disapprove' disabled={selected.length > 0 ? false : true} onClick={() => setOverlay2(true)}>
                            <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
                            <div id='approve'>Disapprove</div>
                        </button>

                        <button id='disapprove' disabled={selected.length > 0 ? false : true} onClick={() => updateApplicants("Inactive")}>
                            <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
                            <div id='approve'>Inactivate</div>
                        </button>

                        <button id='delete' disabled={selected.length > 0 ? false : true} onClick={() => {
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
                                <button onClick={(e) => selected.length > 0 ? unCheckAll() : checkAll()} id='checkAll' style={{ border: "0px", color: selected.length > 0 ? "#08bb26" : "rgb(128, 128, 128)", padding: "0px" }}>
                                    <FontAwesomeIcon icon={faSquareCheck} style={{ fontSize: "1.5rem" }} />
                                    <div>{selected.length > 0 ? "Uncheck all" : "Check all"}</div>
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

                                                <input type='checkbox' onClick={(e) => {
                                                    if (e.target.checked === true) {
                                                        setSelected(prev => [...prev, applicant]);
                                                        //setAllChecked(prev => [...prev, e.target]);
                                                    } else {
                                                        setSelected(prev => prev.filter(a => a !== applicant));
                                                        //setAllChecked(prev => prev.filter(a => a !== e.target));
                                                    }
                                                }} id='checkB' ></input>
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