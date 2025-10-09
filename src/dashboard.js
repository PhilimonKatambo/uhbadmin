import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/dashboard.css';
import { fa1, faAddressCard, faBan, faCheckDouble, faCheckToSlot, faComputer, faEye, faEyeDropper, faGraduationCap, faHeading, faHeadSideCough, faRightFromBracket, faSearch, faSquareCheck, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare, faNewspaper, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faFirstOrderAlt } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';
import Dialog from './dialog';
import ViewApplicant from './viewApplicant';
import $ from "jquery"
import "jquery-ui-bundle";
import "jquery-ui-bundle/jquery-ui.css";
import Reception from './Reception';
import { useNavigate } from 'react-router-dom';
import { icon } from '@fortawesome/fontawesome-svg-core';


const DashBoard = () => {
    return (
        <div id='body'>
            <LeftSideBar />
            <RightSide />
        </div>
    )
}

const LeftSideBar = () => {
    const navigate = useNavigate()

    useEffect(() => {
        $("#headAcc").accordion({
            collapsible: true,
            icons: false,
            active: false
        });

        $("#headAcc2").accordion({
            collapsible: true,
            icons: false,
            active: false
        })
    })
    return (
        <div id='leftSideT'>
            <div id='leftSide'>
                <div id='upSideBar'>
                    <img src='./assets/logos/logo3.jpg' id='schoolLogo'></img>
                    <div id='schoolName'>
                        University Of Hebron
                    </div>
                </div>
                <div id='sections'>
                    <div id='section' onClick={() => { navigate("/") }}>
                        <FontAwesomeIcon icon={faComputer} id='icon'></FontAwesomeIcon>
                        <div id='secWord'>Reception</div>
                    </div>
                    <div id='headAcc'>
                        <div id='section'>
                            <FontAwesomeIcon icon={faHeading} id='icon'></FontAwesomeIcon>
                            <div id='secWord'>Head of Schools</div>
                        </div>
                        <div id='headSchools'>
                            <div id='section' onClick={() => { navigate("/UnderGraduate") }}>
                                <FontAwesomeIcon icon={faUserGraduate} id='icon'></FontAwesomeIcon>
                                <div id='secWord'>UnderGraduate Applications</div>
                            </div>
                            <div id='section'>
                                <FontAwesomeIcon icon={faGraduationCap} id='icon'></FontAwesomeIcon>
                                <div id='secWord'>PostGraduate Applications</div>
                            </div>
                        </div>
                    </div>

                    <div id='headAcc2'>
                        <div id='section'>
                            <FontAwesomeIcon icon={faAddressCard} id='icon'></FontAwesomeIcon>
                            <div id='secWord'>Registrar</div>
                        </div>
                        <div id='headSchools'>
                            <div id='section' onClick={() => { navigate("/UnderGraduate") }}>
                                <FontAwesomeIcon icon={faUserGraduate} id='icon'></FontAwesomeIcon>
                                <div id='secWord'>UnderGraduate Applications</div>
                            </div>
                            <div id='section'>
                                <FontAwesomeIcon icon={faGraduationCap} id='icon'></FontAwesomeIcon>
                                <div id='secWord'>PostGraduate Applications</div>
                            </div>
                        </div>
                    </div>

                    <div id='section'>
                        <FontAwesomeIcon icon={faNewspaper} id='icon'></FontAwesomeIcon>
                        <div id='secWord'>Manage News</div>
                    </div>
                </div>

                <div id='section'>
                    <FontAwesomeIcon icon={faRightFromBracket} id='icon'></FontAwesomeIcon>
                    <div id='secWord'>Log Out</div>
                </div>
            </div>
        </div>
    )
}

const RightSide = () => {
    const [applicants, setApplicants] = useState([])

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])
    const [refresh, setRefresh] = useState(false)

    const [rightMode, setRightMode] = useState("BBA");

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const [autoComplete, setAutocomplete] = useState([])
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
                setApplicants(data);
                const i = 0;
                data.forEach(element => {
                    allComplete.push(element.firstName + " " + element.surname)

                });

            } catch (e) {
                openDialog();
                setMessage(["Fetching problem", "Can't find applicants, please try again later!"])
            }
        }
        getData();
    }, [refresh])


    const xools = ["BBA", "ADD", "BPHA", "IT", "hs", "kkd", "slsd"]
    return (
        <div id='rightSide'>
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}
            <div id='sectionCards'>
                {
                    xools.map((key, index) => (
                        <XoolCard key={index} mode={rightMode} setMode={setRightMode} index={index} applicants={applicants} xool={xools[index]} />
                    ))
                }
            </div>
            <RightSideDown applicants={applicants} mode={rightMode} setMode={setRightMode} refresh={refresh} setRefresh={setRefresh} autoComplete={allComplete} />
        </div>
    )
}

const XoolCard = (props) => {
    const index = props.index;
    let number = 0
    const [num, setNum] = useState(0);

    useEffect(() => {
        props.applicants.forEach(element => {
            if (element.academicDetails[0].programme === props.xool) {
                number += 1;
            }
        });
        setNum(number)
    })
    const colors = ["#e6e5fa", "#f8e5e9", "#deeff7", "#ffeadb", "#ecedff", "#92dce7"];
    const colors2 = ["#4b37cb", "#dc1e4c", "#1c8ceb", "#f7a027", "#ca58fe", "#022a5d"];
    return (
        <div id='secCard' style={{ backgroundColor: `${colors[index]}` }} onClick={() => { props.setMode(props.xool) }}>
            <FontAwesomeIcon icon={faGraduationCap} id='icon2' style={{ backgroundColor: `${colors2[index]}` }}></FontAwesomeIcon>
            <div id='schoolName2'>{props.xool}</div>
            <div id='number'>{num}</div>
        </div>
    )
}


const RightSideDown = (props) => {

    const [status1, setStatus] = useState("All")
    const [selected, setSelected] = useState([])
    const [applicants, setApplicants] = useState([])

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])

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
                    props.setRefresh(!props.refresh)
                    setSelected([])
                }
            }


        } catch (e) {
            openDialog();
            setMessage(["Update problem", `Can't be ${update}, try again letter`])
        }
    }

    useEffect(() => {
        setApplicants(props.applicants || []);
        $(function () {
            $("#sarchInput").autocomplete({
                source: props.autoComplete
            });
        });
    }, [props.applicants, props.autoComplete])

    const check = (main, sub) => {
        main = main.toLowerCase();
        sub = sub.toLowerCase();
        return [...sub].every(ch => main.includes(ch))
    }

    const autoFind = (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filtered = props.applicants.filter(applicant => {
            const fullName = (applicant.firstName + applicant.surname).toLowerCase();
            return check(fullName, searchTerm);
        });

        setApplicants(filtered);
    }



    const [checkOverlay, setOverlay] = useState(false)
    const [view, setView] = useState([]);

    return (
        <div id='rightDown'>
            <ViewApplicant checkOverlay={checkOverlay} setOverlay={setOverlay} applicant={view} refresh={props.refresh} setRefresh={props.setRefresh} />
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}

            <div id='rightUp'>
                <div id='name'>{props.mode}</div>
                <div id='search'>
                    <input type='text' id='sarchInput' placeholder='Search' onChange={autoFind}></input>
                    <FontAwesomeIcon icon={faSearch} id='searchIcon'></FontAwesomeIcon>
                </div>
                <div id='ops'>
                    <button id='accept' disabled={selected.length > 0 ? false : true} onClick={() => updateApplicants("Accepted")}>
                        <FontAwesomeIcon icon={faCheckToSlot}></FontAwesomeIcon>
                        <div id='approve'>accept</div>
                    </button>

                    <button id='recommend' disabled={selected.length > 0 ? false : true} onClick={() => updateApplicants("Recommended")}>
                        <FontAwesomeIcon icon={faCheckDouble}></FontAwesomeIcon>
                        <div id='approve'>Recommend</div>
                    </button>
                    <button id='deny' disabled={selected.length > 0 ? false : true} onClick={() => updateApplicants("Denied")}>
                        <FontAwesomeIcon icon={faBan}></FontAwesomeIcon>
                        <div id='approve'>Deny</div>
                    </button>
                </div>
            </div>

            <div id='otherButtons'>
                <div id='otherLeft'>
                    <button id='butts' onClick={() => setStatus("All")} style={{ color: status1 === "All" ? "#25517e" : "grey" }}>All</button>
                    <button id='butts' onClick={() => setStatus("Accepted")} style={{ color: status1 === "Accepted" ? "#25517e" : "grey" }}>Accepted</button>
                    <button id='butts' onClick={() => setStatus("Recommended")} style={{ color: status1 === "Recommended" ? "#25517e" : "grey" }}>Recommended</button>
                    <button id='butts' onClick={() => setStatus("Denied")} style={{ color: status1 === "Denied" ? "#25517e" : "grey" }}>Denied</button>
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
                                (status1 === "All" || applicant.status === status1) &&
                                    applicant.academicDetails[0].programme === props.mode ? (
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
                                ) : null
                            )) : <div id='loadingFetch'>
                                <div id='loader'></div>
                                <div id='getFetch'>Loading...</div>
                            </div>
                    }
                </table>
            </div>
        </div>
    )
}

export { LeftSideBar }
export default DashBoard