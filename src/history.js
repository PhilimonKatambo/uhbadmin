import { useEffect, useRef, useState } from 'react'
import './css/history.css'
import { LeftSideBar } from './dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faGreaterThanEqual, faRefresh, faSearch, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { animate, stagger } from "animejs";
import $ from 'jquery'
import Dialog from './dialog'
import ViewHis from './viewHis'

const History = () => {
    const [history, setHistory] = useState([])
    const [history2, setHistory2] = useState([])
    const [status1, setStatus] = useState("All")
    const [refresh, setRefresh] = useState(false)
    const reload = useRef(null)
    useEffect(() => {
        const getHistory = async () => {
            try {
                const response = await fetch("https://mongodb-5-7rnl.onrender.com/history/", {
                    method: 'GET',
                })
                if (!response.ok) {
                    throw new Error("Failed to retrive history")
                } else {
                    const data = await response.json();

                    const sortedData = [...data].sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setHistory(sortedData);
                    setHistory2(sortedData);
                }
            } catch (err) {
                console.log("error", err)
            }
        }

        getHistory()
    }, [refresh])

    useEffect(() => {
        $("#filter").accordion({
            collapsible: true,
            active: false,
            icons: false
        })
    })

    const refreshed = () => {
        setRefresh(prev => (!prev));
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

    const checkDateInRange = (startDate, endDate) => {
        setHistory([])
        history2.map((key, index) => {
            const check = new Date(history2[index].createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            if (check >= start && check <= end) {
                setHistory(prev => [...prev, history2[index]])
            }
        })

        reset()
    };

    const reset = () => {
        document.getElementById("from").value = "";
        document.getElementById("to").value = "";
    }

    const checkDateRange = (dateVar) => {
        const fromDate = document.getElementById("from").value;
        if (fromDate) {
            checkDateInRange(fromDate, dateVar)
        }
    }

    const [autoComplete, setAutoComplete] = useState([])

    const check = (main, sub) => {
        main = main.toLowerCase();
        sub = sub.toLowerCase();
        return [...sub].every(ch => main.includes(ch))
    }

    const autoFind = (e) => {
        const searchTerm = e.target.value.toLowerCase();

        if (!searchTerm.trim()) {
            setHistory(history2);
            return;
        }

        const filteredApplicants = autoComplete.filter(applicant =>
            check(applicant.name, searchTerm)
        );
        const matchedHistory = history2.filter(his =>
            filteredApplicants.some(app => app.id === his.operatorOn)
        );

        setHistory(matchedHistory);
    };

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const deleteAll = async () => {
        try {
            history.map(async (hist) => {
                const response = await fetch(`https://mongodb-5-7rnl.onrender.com/history/${hist._id}`, {
                    method: "DELETE"
                })
                if (!response.ok) {
                    setMessage(["Failed delete", "Can't delete news"])
                    openDialog()
                }
            })
            refreshed()
        } catch (e) {
            setMessage(["Failed delete", "Can't delete news"])
            openDialog()
        }
    }

    return (
        <div id='history'>
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}

            <LeftSideBar />
            <div id='rightSideHis'>
                <div id='filter'>
                    <div id='accordion'>
                        <div>Filter</div>
                        <FontAwesomeIcon icon={faGreaterThanEqual}></FontAwesomeIcon>
                    </div>
                    <div id='filterC'>
                        <div id='inps1'>
                            <label>From:</label>
                            <input type='date' id='from'></input>
                        </div>
                        <div id='inps1'>
                            <label>To:</label>
                            <input type='date' onChange={(e) => checkDateRange(e.target.value)} id='to'></input>
                        </div>
                    </div>
                </div>
                <div id='downFilter'>
                    <div id='otherLeft2'>
                        <button id='butts' onClick={() => setStatus("All")} style={{ color: status1 === "All" ? "#25517e" : "grey" }}>All</button>
                        <button id='butts' onClick={() => setStatus("Offered")} style={{ color: status1 === "Offered" ? "#25517e" : "grey" }}>Offered</button>
                        <button id='butts' onClick={() => setStatus("Accepted")} style={{ color: status1 === "Accepted" ? "#25517e" : "grey" }}>Accepted</button>
                        <button id='butts' onClick={() => setStatus("Approved")} style={{ color: status1 === "Approved" ? "#25517e" : "grey" }}>Approved</button>
                        <button id='butts' onClick={() => setStatus("Recommended")} style={{ color: status1 === "Recommended" ? "#25517e" : "grey" }}>Recommended</button>
                        <button id='butts' onClick={() => setStatus("Disapproved")} style={{ color: status1 === "Disapproved" ? "#25517e" : "grey" }}>Disapproved</button>
                        <button id='butts' onClick={() => setStatus("Denied")} style={{ color: status1 === "Denied" ? "#25517e" : "grey" }}>Denied</button>
                        <button id='butts' onClick={() => setStatus("Deleted")} style={{ color: status1 === "Deleted" ? "#25517e" : "grey" }}>Deleted</button>

                        <FontAwesomeIcon icon={faRefresh} ref={reload} onClick={refreshed} id='refresh'></FontAwesomeIcon>
                    </div>

                    <div id='search'>
                        <input type='text' id='sarchInput' placeholder='Search' onChange={autoFind}></input>
                        <FontAwesomeIcon icon={faSearch} id='searchIcon'></FontAwesomeIcon>
                    </div>
                </div>
                <div id='hisFeed'>
                    <div>
                        <table id='tbb'>
                            <tr>
                                <th></th>
                                <th>Admin</th>
                                <th>Operation</th>
                                <th>Applicant</th>
                                <th>Level</th>
                                <th>Date & Time</th>
                                <th>Reason</th>
                                <th>Description</th>
                                <th id='tdd' title='Delete All'><FontAwesomeIcon icon={faTrashCan} id='delete2' onClick={() => deleteAll()}></FontAwesomeIcon></th>
                            </tr>

                            {
                                history.length <= 0 ? <div id='loader9'></div> : history.map((item, index) => {
                                    if (status1 === "All" || status1 === item.operation) {
                                        return (
                                            <HistoryCard
                                                key={index}
                                                history={item}
                                                refresh={refresh}
                                                setRefresh={setRefresh}
                                                setAutoComplete={setAutoComplete}
                                                autoComplete={autoComplete}
                                            />
                                        );
                                    }
                                    return null;
                                })
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const HistoryCard = (props) => {
    const history = props.history
    const [operated, setOperated] = useState({})
    const [operator, setOperator] = useState({})

    const [msg, setMessage] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const deleteNews = async (id) => {
        try {
            //alert(id)
            const response = await fetch(`https://mongodb-5-7rnl.onrender.com/history/${id}`, {
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

    const [checkOverlay2, setOverlay2] = useState(false)

    return (
        <tr>
            {/* <ViewApplicant checkOverlay={checkOverlay} setOverlay={setOverlay} applicant={view} refresh={props.refresh} setRefresh={props.setRefresh} /> */}
            <ViewHis checkOverlay2={checkOverlay2} setOverlay2={setOverlay2} history={history} operator={operator} operated={operated} /*refresh={props.refresh} setRefresh={props.setRefresh}*/ />
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}
            <td><button id='viewMore' onClick={() => {
                setOverlay2(true)
            }}>
                <FontAwesomeIcon icon={faEye} />
            </button></td>
            <td id='tdd' title={`${history?.operator}`}>{history?.operator}</td>
            <td id='tdd' title={`${history?.operation}`}>{history?.operation}</td>
            <td id='tdd' title={`${history.operatorOnName}`}>{history.operatorOnName}</td>
            <td id='tdd' title={`${history?.operatedType === "postgrad" ? "PostGraduate applicant" : "UnderGraduate applicant"}`}>{history?.operatedType === "postgrad" ? "PostGraduate applicant" : "UnderGraduate applicant"}</td>
            <td id='tdd' title={`${new Date(history?.createdAt).toLocaleString()}`}>{new Date(history?.createdAt).toLocaleString()}</td>
            <td id='tdd' title={`${history?.reason}`} >{history?.reason}</td>
            <td id='tdd' title={`${history?.additionalText}`} >{history?.additionalText}</td>
            <td id='tdd'><FontAwesomeIcon icon={faTrashCan} id='delete2' onClick={() => deleteNews(history?._id)}></FontAwesomeIcon></td>
        </tr>
    )
}

export default History