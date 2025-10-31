import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/dashboard.css';
import { fa1, faAddressCard, faBan, faCheckDouble, faCheckToSlot, faComputer, faEye, faEyeDropper, faGraduationCap, faHeading, faHeadSideCough, faRefresh, faRightFromBracket, faSearch, faSquareCheck, faTrashCan, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare, faNewspaper, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faFirstOrderAlt } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useRef, useState } from 'react';
import Dialog, { RecoDialog } from './dialog';
import ViewApplicant from './viewApplicant';
import $ from "jquery"
import "jquery-ui-bundle";
import "jquery-ui-bundle/jquery-ui.css";
import Reception from './Reception';
import { useNavigate } from 'react-router-dom';
import { icon } from '@fortawesome/fontawesome-svg-core';
import Delete2 from './delete';
import SendEmail from './sendEmail';
import { animate, stagger } from "animejs";
import SendDenial from './denial';
import { LeftSideBar } from './dashboard';
import SendOffer from './offerLetter';
import SendOfferGen from './offerLateGen';
import { useDispatch, useSelector } from 'react-redux';


const DashBoard2 = () => {
    return (
        <div id='body'>
            <LeftSideBar />
            <RightSide />
            {/* <SendEmail /> */}
        </div>
    )
}

const RightSide = () => {
    const [applicants, setApplicants] = useState([])

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])
    const [refresh, setRefresh] = useState(false)

    const [rightMode, setRightMode] = useState("");

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const [autoComplete, setAutocomplete] = useState([])
    let allComplete = []
    const [xools, setXools] = useState([])
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch('https://mongodb-5-7rnl.onrender.com/undergraduate/applicants', {
                    method: 'Get',
                });
                if (!response.ok) {
                    throw new Error("Failed to retrive news")
                }
                const data = await response.json();
                const sortedData = [...data].sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setApplicants(sortedData);

                const i = 0;
                let xool = []
                data.forEach(element => {
                    allComplete.push(element.firstName + " " + element.surname)
                    xool.push(element.academicDetails[0].programme)
                });
                setXools(Array.from(new Set(xool)))
                setRightMode(Array.from(new Set(xool))[0])
            } catch (e) {
                openDialog();
                setMessage(["Fetching problem", "Can't find applicants, please try again later!"])
            }
        }
        getData();
    }, [refresh])


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
        <div id='secCard' style={{ backgroundColor: `${colors[index]}`, boxShadow: props.mode === props.xool ? "0px 10px 5px 1px #022a5d" : "0px 5px 50px 1px #25517e" }} onClick={() => { props.setMode(props.xool) }}>
            <FontAwesomeIcon icon={faGraduationCap} id='icon2' style={{ backgroundColor: `${colors2[index]}` }}></FontAwesomeIcon>
            <div id='schoolName2'>{props.xool}</div>
            <div id='number'>{num}</div>
        </div>
    )
}


const RightSideDown = (props) => {

    const [status1, setStatus] = useState("Accepted")
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


    const user = useSelector((state) => state.user.user);
    const updateApplicants = async (update, reason, additionalText) => {
        try {
            for (const applicant of selected) {
                applicant.status = update

                const response = await fetch(`https://mongodb-5-7rnl.onrender.com/undergraduate/underApply/${applicant._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status: update })
                })

                if (!response.ok) {
                } else {
                    const updatedData = await response.json()
                    refreshed()
                    setSelected([])
                    unCheckAll()
                    saveHistory(applicant, update, reason, additionalText)
                }
            }


        } catch (e) {
            openDialog();
            setMessage(["Update problem", `Can't be ${update}, try again letter`])
        }
    }

    //   const user = useSelector((state) => state.user.user);

    const updateApplicantsReco = async (update, reason, additionalText) => {
        try {
            for (const applicant of selected) {
                applicant.programme = update
                console.log(update)
                const response = await fetch(`https://mongodb-5-7rnl.onrender.com/undergraduate/underApplyReco/${applicant._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ "academicDetails.0.programme": update })
                })

                if (!response.ok) {

                } else {
                    const updatedData = await response.json()
                    refreshed()
                    setSelected([])
                    unCheckAll()
                    //saveHistory(applicant, update,reason,additionalText)
                }
            }


        } catch (e) {
            openDialog();
            setMessage(["Update problem", `Can't be ${update}, try again letter`])
        }
    }

    const saveHistory = async (applicant, update, reason1, additionalText1) => {
        try {
            const response = await fetch("https://mongodb-5-7rnl.onrender.com/history/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    operator:user.firstName+" "+user.surName,
                    operatorId: user._id,
                    operatorOn: applicant._id,
                    operatorOnName: applicant.firstName + " " + applicant.surname,
                    operation: update,
                    operatedType: applicant.form,
                    reason: reason1 ? reason1 : "Common reason",
                    additionalText: additionalText1 ? additionalText1 : "We would like to inform any information!",
                })
            })
        } catch (err) {
            console.log("error", err)
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



    const setRefresh = props.setRefresh;
    const [loader, setLoader] = useState()
    const [checkOverlay, setOverlay] = useState(false)
    const [checkOverlay3, setOverlay3] = useState(false)
    const [view, setView] = useState([]);

    const [isOpen2, setIsOpen2] = useState(false);
    const [showDialog2, setShowDialog2] = useState(false);
    const [msg2, setMessage2] = useState([])

    const [isOpen3, setIsOpen3] = useState(false);
    const [showDialog3, setShowDialog3] = useState(false);
    const [msg3, setMessage3] = useState([])

    const openDialog2 = () => {
        setShowDialog2(true);
        setTimeout(() => setIsOpen2(true), 10);
    }

    const openDialog3 = () => {
        setShowDialog3(true);
        setTimeout(() => setIsOpen3(true), 10);
    }

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

    const [checkOverlay2, setOverlay2] = useState(false)
    const reload = useRef(null)
    const refreshed = () => {
        props.setRefresh(!props.refresh);
        animate(reload.current, {
            duration: 1200,
            easing: "easeOutExpo",
            keyframes: [
                { opacity: 0, rotate: 360 },
                { opacity: 1, rotate: 0 }
            ],
        }
        )
    }

    return (
        <div id='rightDown'>
            <SendOfferGen selected={selected} setSelected={setSelected} setOverlay2={setOverlay3} checkOverlay2={checkOverlay3} updateApplicants={updateApplicants} />
            <SendDenial selected={selected} setSelected={setSelected} setOverlay2={setOverlay2} checkOverlay2={checkOverlay2} updateApplicants={updateApplicants} method={"denial"} />
            <ViewApplicant checkOverlay={checkOverlay} setOverlay={setOverlay} applicant={view} refresh={props.refresh} setRefresh={props.setRefresh} />
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}
            {showDialog2 && (<Delete2 isOpen2={isOpen2} msg2={msg2} setShowDialog2={setShowDialog2} setIsOpen2={setIsOpen2} setMessage2={setMessage2} selected={selected} setLoader={setLoader} openDialog={openDialog} setMessage={setMessage} setRefresh={setRefresh} setSelected={setSelected} saveHistory={saveHistory} />)}
            {showDialog3 ? <RecoDialog msg={msg} isOpen={isOpen3} showDialog={showDialog3} setIsOpen={setIsOpen3} setShowDialog={setShowDialog3} refresh={props.refresh} setRefresh={props.setRefresh} updateApplicants={updateApplicants} updateApplicantsReco={updateApplicantsReco} /> : <div style={{ display: "none" }}></div>}

            <div id='rightUp'>
                <div id='name' data-title={props.mode}>
                    <div id='name2'>{props.mode}</div>
                </div>
                <div id='search'>
                    <input type='text' id='sarchInput' placeholder='Search' onChange={autoFind}></input>
                    <FontAwesomeIcon icon={faSearch} id='searchIcon'></FontAwesomeIcon>
                </div>
                <div id='ops'>
                    <button id='accept' disabled={selected.length > 0 ? false : true} onClick={() => setOverlay3(true)}>
                        <FontAwesomeIcon icon={faCheckToSlot}></FontAwesomeIcon>
                        <div id='approve'>Send offer letter</div>
                    </button>

                     <button id='recommend' disabled={selected.length > 0 ? false : true} onClick={() => openDialog3()}>
                        <FontAwesomeIcon icon={faCheckDouble}></FontAwesomeIcon>
                        <div id='approve'>Recommend</div>
                    </button>

                    <button id='deny' disabled={selected.length > 0 ? false : true} onClick={() => setOverlay2(true)}>
                        <FontAwesomeIcon icon={faBan}></FontAwesomeIcon>
                        <div id='approve'>Deny</div>
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
                    <button id='butts' onClick={() => setStatus("Offered")} style={{ color: status1 === "Offered" ? "#25517e" : "grey" }}>Offered</button>
                    <button id='butts' onClick={() => setStatus("Accepted")} style={{ color: status1 === "Accepted" ? "#25517e" : "grey" }}>Accepted</button>
                    <button id='butts' onClick={() => setStatus("Approved")} style={{ color: status1 === "Approved" ? "#25517e" : "grey" }}>Approved</button>
                    <button id='butts' onClick={() => setStatus("Recommended")} style={{ color: status1 === "Recommended" ? "#25517e" : "grey" }}>Recommended</button>
                    <button id='butts' onClick={() => setStatus("Denied")} style={{ color: status1 === "Denied" ? "#25517e" : "grey" }}>Denied</button>
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
                        <th></th>
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

export default DashBoard2