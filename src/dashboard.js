import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/dashboard.css';
import { fa1, faBan, faCheckDouble, faCheckToSlot, faEye, faEyeDropper, faGraduationCap, faRightFromBracket, faSearch, faSquareCheck, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare, faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { faFirstOrderAlt } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';
import Dialog from './dialog';

const DashBoard = () => {
    return (
        <div id='body'>
            <LeftSideBar />
            <RightSide />
        </div>
    )
}

const LeftSideBar = () => {
    return (
        <div id='leftSide'>
            <div id='upSideBar'>
                <img src='./assets/logos/logo3.jpg' id='schoolLogo'></img>
                <div id='schoolName'>
                    University Of Hebron
                </div>
            </div>
            <div id='sections'>
                <div id='section'>
                    <FontAwesomeIcon icon={faUserGraduate} id='icon'></FontAwesomeIcon>
                    <div id='secWord'>UnderGraduate Applications</div>
                </div>
                <div id='section'>
                    <FontAwesomeIcon icon={faGraduationCap} id='icon'></FontAwesomeIcon>
                    <div id='secWord'>PostGraduate Applications</div>
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
    )
}

const RightSide = () => {
    const colors = ["#e6e5fa", "#f8e5e9", "#deeff7", "#ffeadb", "#ecedff"];
    const colors2 = ["#4b37cb", "#dc1e4c", "#1c8ceb", "#f7a027", "#ca58fe"]
    return (
        <div id='rightSide'>
            <div id='sectionCards'>

                {
                    colors.map((key, index) => (
                        <div id='secCard' style={{ backgroundColor: `${colors[index]}` }}>
                            <FontAwesomeIcon icon={faGraduationCap} id='icon2' style={{ backgroundColor: `${colors2[index]}` }}></FontAwesomeIcon>
                            <div id='schoolName2'>BBA</div>
                            <div id='number'>200</div>
                        </div>
                    ))
                }
            </div>
            <RightSideDown />
        </div>
    )
}

const RightSideDown = () => {

    const [check, setCheck] = useState(false)
    const [applicants, setApplicants] = useState([])

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg,setMessage] = useState([])

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const changeCheck = (div) => {
        console.log(window.getComputedStyle(div).color)
        if (window.getComputedStyle(div).color === "rgb(128, 128, 128)") {
            div.style.color = "#08bb26";
        } else {
            div.style.color = "grey";
        }
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch('http://localhost:000/applicants', {
                    method: 'Get',
                });
                if (!response.ok) {
                    throw new Error("Failed to retrive news")
                }
                const data = await response.json();
                console.log(data)
                setApplicants(data);
            } catch (e) {
                console.log('Error: ', e.message);
                openDialog();
                setMessage(["Fetching problem","Can't find applicants, please try again later!"])
            }
        }

        getData();
    }, [])

    return (
        <div id='rightDown'>
            {showDialog?<Dialog msg={msg} isOpen = {isOpen}  showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} />:<div style={{display:"none"}}></div>}
            <div id='rightUp'>
                <div id='name'>BBA</div>
                <div id='search'>
                    <input type='text' id='sarchInput' placeholder='Search'></input>
                    <FontAwesomeIcon icon={faSearch} id='searchIcon'></FontAwesomeIcon>
                </div>
                <div id='ops'>
                    <button id='accept'>
                        <FontAwesomeIcon icon={faCheckToSlot}></FontAwesomeIcon>
                        <div id='approve'>Approve</div>
                    </button>
                    <button id='recommend'>
                        <FontAwesomeIcon icon={faCheckDouble}></FontAwesomeIcon>
                        <div id='approve'>Recommend</div>
                    </button>
                    <button id='deny'>
                        <FontAwesomeIcon icon={faBan}></FontAwesomeIcon>
                        <div id='approve'>Deny</div>
                    </button>
                </div>
            </div>

            <div id='table'>
                <table>
                    <tr>
                        <th></th>
                        <th>
                            <div id='th'>
                                <FontAwesomeIcon icon={fa1} id='icoo'></FontAwesomeIcon>
                                <div>First name</div>
                            </div>
                        </th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Nationarity</th>
                        <th>Academic-details</th>
                        <th>Data</th>
                        <th></th>

                    </tr>
                    <tr>
                        <td>
                            <FontAwesomeIcon icon={faSquareCheck} id='dekldje' onClick={(e) => changeCheck(e.target)} style={{ padding: "10px", fontSize: "1.5rem" }}></FontAwesomeIcon>
                        </td>
                        <td>Philimon</td>
                        <td>Katambo</td>
                        <td>Phil@gmail.com</td>
                        <td>Malawi</td>
                        <td>MSCE</td>
                        <td>All</td>
                        <td>
                            <button id='viewMore'>
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                <div>View More</div>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <FontAwesomeIcon icon={faSquareCheck} id='dekldje' onClick={(e) => changeCheck(e.target)} style={{ padding: "10px", fontSize: "1.5rem" }}></FontAwesomeIcon>
                        </td>
                        <td>Philimon</td>
                        <td>Katambo</td>
                        <td>Phil@gmail.com</td>
                        <td>Malawi</td>
                        <td>MSCE</td>
                        <td>All</td>
                        <td>
                            <button id='viewMore'>
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                <div>View More</div>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <FontAwesomeIcon icon={faSquareCheck} id='dekldje' onClick={(e) => changeCheck(e.target)} style={{ padding: "10px", fontSize: "1.5rem" }}></FontAwesomeIcon>
                        </td>
                        <td>Philimon</td>
                        <td>Katambo</td>
                        <td>Phil@gmail.com</td>
                        <td>Malawi</td>
                        <td>MSCE</td>
                        <td>All</td>
                        <td>
                            <button id='viewMore'>
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                <div>View More</div>
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <FontAwesomeIcon icon={faSquareCheck} id='dekldje' onClick={(e) => changeCheck(e.target)} style={{ padding: "10px", fontSize: "1.5rem" }}></FontAwesomeIcon>
                        </td>
                        <td>Philimon</td>
                        <td>Katambo</td>
                        <td>Phil@gmail.com</td>
                        <td>Malawi</td>
                        <td>MSCE</td>
                        <td>All</td>
                        <td>
                            <button id='viewMore'>
                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                <div>View More</div>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default DashBoard