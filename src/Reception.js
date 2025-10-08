import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/dashboard.css';
import { fa1, faBan, faCheckDouble, faCheckToSlot, faComputer, faEye, faEyeDropper, faGraduationCap, faRightFromBracket, faSearch, faSquareCheck, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare, faNewspaper, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faFirstOrderAlt } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';
import Dialog from './dialog';
import ViewApplicant from './viewApplicant';
import $ from "jquery"
import "jquery-ui-bundle";
import "jquery-ui-bundle/jquery-ui.css";
import { LeftSideBar } from './dashboard';

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

    return (
        <div id='rightSide'>
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
                    </div>
                </div>

                <div id='otherButtons'>
                    <div id='otherLeft'>
                        <button id='butts' onClick={() => setStatus("All")} style={{ color: status1 === "All" ? "#25517e" : "grey" }}>All</button>
                        <button id='butts' onClick={() => setStatus("Inactive")} style={{ color: status1 === "Inactive" ? "#25517e" : "grey" }}>Inactive</button>
                        <button id='butts' onClick={() => setStatus("Approved")} style={{ color: status1 === "Approved" ? "#25517e" : "grey" }}>Approved</button>
                        <button id='butts' onClick={() => setStatus("Disapproved")} style={{ color: status1 === "Disapproved" ? "#25517e" : "grey" }}>Disapproved</button>
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
                                        : null
                                )) : <div>No data</div>
                        }

                    </table>
                </div>
            </div>
        </div>
    )
}

export default Reception