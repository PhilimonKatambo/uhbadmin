import { useRef, useState } from 'react';
import './css/login.css'
import { animate, stagger } from "animejs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Dialog from './dialog';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './userSlice';

const Login = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    const items = []
    for (let i = 1; i <= 30; i++) {
        items.push(i.toString())
    }
    const hover = useRef(null)

    const makeIt = async (el) => {
        await animate(el, {
            duration: 0,
            easing: "easeOut",
            keyframes: [
                { opacity: .5 },

            ],
        })
    }
    const makeIt2 = async (el) => {
        await animate(el, {
            duration: 500,
            easing: "easeOut",
            keyframes: [
                { opacity: 0, backgroundColor: "#fcfbf8" },
            ],
        })
    }

    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const [loader, setLoader] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = document.getElementById("nameInp").value;
        const pass = document.getElementById("passInp").value;
        setLoader(true)
        try {
            const res = await fetch("https://mongodb-5-7rnl.onrender.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, pass })
            });

            if (res.ok) {
                const data = await res.json();
                dispatch(login(data.user));
                navigate("reception")
            } else {
                setMessage(["Login failed", "Login unsuccessful user not found"])
                openDialog()
            }
            setLoader(false)
        } catch (error) {
            setMessage(["Login failed", "Login unsuccessful"])
            openDialog()
            setLoader(false)
        }
    };


    return (
        <div id="loginPage" style={{ backgroundImage: "url('./assets/images/course_ed.jpg')" }}>
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}
            <div id='blur'>
                <form id="form" onSubmit={handleSubmit}>
                    <div id='logoFooter' style={{ backgroundImage: "url('./assets/logos/logo3.jpg')" }}></div>
                    <div id='formDown'>

                        <div id='nameTh'>
                            <input type='text' id='nameInp' placeholder='Name' required></input>
                            <FontAwesomeIcon icon={faUser} id='icon'></FontAwesomeIcon>
                        </div>
                        <div id='nameTh'>
                            <input type='password' id='passInp' placeholder='Password' required></input>
                            {/* <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} id='icon' onClick={() => setVisible(!visible)}></FontAwesomeIcon> */}
                        </div>
                    </div>

                    <button type='submit' id='loginB'>
                        <div>{loader ? "Logging..." : "Login"}</div>
                        {loader ? <div className='loader'></div> : <FontAwesomeIcon icon={faRightToBracket}></FontAwesomeIcon>}
                    </button>
                </form>
                {
                    items.map((key, index) => (
                        <div key={index} id="box" ref={hover} onMouseEnter={(e) => makeIt(e.currentTarget)} onMouseLeave={(e) => makeIt2(e.currentTarget)}>
                            <div id='boxIn'></div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Login