import { useEffect, useRef, useState } from 'react'
import './css/history.css'
import './css/users.css'
import { LeftSideBar } from './dashboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faGreaterThanEqual, faPlus, faRefresh, faSearch, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons'
import { animate, stagger } from "animejs";
import $ from 'jquery'
import Dialog from './dialog'
import ViewHis from './viewHis'
import ViewUser from './viewUser'
import { useNavigate } from 'react-router-dom'

const Users = () => {
    const [Users, setUsers] = useState([])
    const [Users2, setUsers2] = useState([])
    const [status1, setStatus] = useState("All")
    const [refresh, setRefresh] = useState(false)
    const reload = useRef(null)
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch("https://mongodb-5-7rnl.onrender.com/auth/users", {
                    method: 'GET',
                })
                if (!response.ok) {
                    throw new Error("Failed to retrive Users")
                } else {
                    const data = await response.json();

                    const sortedData = [...data].sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setUsers(sortedData);
                    setUsers2(sortedData);
                }
            } catch (err) {
                console.log("error", err)
            }
        }

        getUsers()
    }, [refresh])

    useEffect(() => {
        $("#filter").accordion({
            collapsible: true,
            active: false,
            icons: false
        })
    })

    const refreshed = () => {
        setRefresh(!refresh);
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
        setUsers([])
        Users2.map((key, index) => {
            const check = new Date(Users2[index].createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            if (check >= start && check <= end) {
                setUsers(prev => [...prev, Users2[index]])
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

        const filtered = Users2.filter(applicant => {
            const fullName = (applicant.firstName + applicant.surName).toLowerCase();
            return check(fullName, searchTerm);
        });

        setUsers(filtered)

    }

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const deleteAll = async () => {
        try {
            Users.map(async (hist) => {
                const response = await fetch(`http://localhost:1200/Users/${hist._id}`, {
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

    const navigate = useNavigate()

    return (
        <div id='history'>
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}
            <LeftSideBar />
            <div id='rightSideHis'>
                <div id='filter'>
                    <div id='accordion' style={{justifyContent:"space-between"}}>
                        <div style={{display:"flex",gap:"10px"}}>
                            <div>Filter</div>
                            <FontAwesomeIcon icon={faGreaterThanEqual}></FontAwesomeIcon>
                        </div>
                        <button onClick={() => { navigate("/Register") }} id='reg1'>
                            <div>Add user</div>
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        </button>
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
                        <button id='butts' onClick={() => setStatus("Superior")} style={{ color: status1 === "Superior" ? "#25517e" : "grey" }}>Superior</button>
                        <button id='butts' onClick={() => setStatus("Reception")} style={{ color: status1 === "Reception" ? "#25517e" : "grey" }}>Reception</button>
                        <button id='butts' onClick={() => setStatus("Head of department")} style={{ color: status1 === "Head of department" ? "#25517e" : "grey" }}>Head of department</button>
                        <button id='butts' onClick={() => setStatus("Registrer")} style={{ color: status1 === "Registrer" ? "#25517e" : "grey" }}>Registrer</button>
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
                                <th>First name</th>
                                <th>Surname</th>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Role</th>
                                <th>Date</th>
                                <th id='tdd' title='Delete All'><FontAwesomeIcon icon={faTrashCan} id='delete2' onClick={() => deleteAll()}></FontAwesomeIcon></th>
                            </tr>

                            {
                                Users.length <= 0 ? <div id='loader9'></div> : Users.map((item, index) => {
                                    if (status1 === "All" || status1 === item.userRole) {
                                        return (
                                            <UsersCard
                                                key={index}
                                                Users={item}
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

const UsersCard = (props) => {
    const User = props.Users

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
            }else{
                
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
            {/* <ViewApplicant checkOverlay={checkOverlay} setOverlay={setOverlay} applicant={view} refresh={props.refresh} setRefresh={props.setRefresh} />  */}
            <ViewUser checkOverlay2={checkOverlay2} setOverlay2={setOverlay2} User={User} deleteNews={deleteNews}/>
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}
            <td><button id='viewMore' onClick={() => {
                setOverlay2(true)
            }}>
                <FontAwesomeIcon icon={faEye} />
            </button></td>
            <td id='tdd' title={`${User?.firstName}`}>{User?.firstName}</td>
            <td id='tdd' title={`${User?.surName}`}>{User?.surName}</td>
            <td id='tdd' title={`${User?.userId}`}>{User?.userId}</td>
            <td id='tdd' title={`${User?.userEmail}`}>{User?.userEmail}</td>
            <td id='tdd' title={`${User?.userPassword}`}>{User?.userPassword}</td>
            <td id='tdd' title={`${User?.userRole}`}>{User?.userRole}</td>
            <td id='tdd' title={`${new Date(User?.createdAt).toLocaleString()}`}>{new Date(User?.createdAt).toLocaleString()}</td>
            <td id='tdd'><FontAwesomeIcon icon={faTrashCan} id='delete2' onClick={() => deleteNews(User?._id)}></FontAwesomeIcon></td>
        </tr>
    )
}

export default Users