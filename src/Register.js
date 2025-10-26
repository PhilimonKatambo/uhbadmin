import { useRef, useState } from 'react';
import './css/login.css';
import { animate } from "animejs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUserPlus, faEnvelope, faIdCard, faPlus, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const items = []
  for (let i = 1; i <= 30; i++) {
    items.push(i.toString())
  }

  const makeIt = async (el) => {
    await animate(el, {
      duration: 0,
      easing: "easeOut",
      keyframes: [{ opacity: 0.5 }],
    });
  };

  const makeIt2 = async (el) => {
    await animate(el, {
      duration: 500,
      easing: "easeOut",
      keyframes: [{ opacity: 0, backgroundColor: "#fcfbf8" }],
    });
  };

  const [visible, setVisible] = useState(false);

  const makeID = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [msg, setMessage] = useState([])
  const [feedBack, setFeedBack] = useState("")

  const openDialog = () => {
    setShowDialog(true);
    setTimeout(() => setIsOpen(true), 10);
  };

  const [userRole, setUserRole] = useState(null)
  const [loader, setLoader] = useState(false)

  const [pass1, setPass1] = useState("")
  const [pass2, setPass2] = useState("")
  const [allSet, setAllSet] = useState(false)

  const checkPass = (e) => {
    const userPassword = document.getElementById("passInp").value;
    if (e.target.value !== userPassword) {
      setPass2("Confirm password should match with first password")
    } else if (userPassword.length < 8) {
      setPass1("Password should be 8 or above characters")
    } else {
      setAllSet(true)
      setPass1("")
      setPass2("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstNameInp").value;
    const surName = document.getElementById("surNameInp").value;
    const userId = makeID()
    const userEmail = document.getElementById("emailInp").value;
    const userPassword = document.getElementById("passInp").value;

    if (allSet)
      try {

        setLoader(true)
        const res = await fetch("https://mongodb-5-7rnl.onrender.com/auth/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            surName,
            userId,
            userEmail,
            userPassword,
            userRole
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setFeedBack("Register successful, user can login")
          setLoader(false)
        } else {
          setMessage(["Register failed", "User cannot be registered, try agin later"]);
          openDialog()
          setLoader(false)
          setAllSet(false)
        }
      } catch (error) {
        setMessage(["Register failed", "User cannot be registered, try agin later"]);
        openDialog()
        setLoader(false)
      }
  };

  const navigate = useNavigate()


  return (
    <div id="loginPage" style={{ backgroundImage: "url('./assets/images/course_ed.jpg')" }}>
      <div id='blur'>
        <form id="form2" onSubmit={handleSubmit}>
          <div id='logoFooter2' style={{ backgroundImage: "url('./assets/logos/logo3.jpg')" }}></div>

          <div id='formDown'>
            <div id='nameTh'>
              <input type='text' id='firstNameInp' placeholder='First Name' required />
              <FontAwesomeIcon icon={faUserPlus} id='icon' />
            </div>
            <div id='nameTh'>
              <input type='text' id='surNameInp' placeholder='Surname' required />
              <FontAwesomeIcon icon={faUserPlus} id='icon' />
            </div>
            <div id='nameTh'>
              <select required onChange={(e) => setUserRole(e.target.value)}>
                <option>-- Select user role --</option>
                <option value={"Reception"}>Reception</option>
                <option value={"Head of department"}>Head of department</option>
                <option value={"Registrer"}>Registrer</option>
                <option value={"Superior"}>Superior</option>
              </select>
            </div>
            <div id='nameTh'>
              <input type='email' id='emailInp' placeholder='Email' required />
              <FontAwesomeIcon icon={faEnvelope} id='icon' />
            </div>
            <div id='inpd'>
              <div id='nameTh'>
                <input
                  type={visible ? "text" : "password"}
                  id='passInp'
                  placeholder='Password'
                  required

                  onChange={checkPass}
                />
              </div>
              <div style={{ color: "red", fontSize: ".8rem" }}>{pass1}</div>
            </div>

            <div id='inpd'>
              <div id='nameTh'>
                <input
                  type={visible ? "text" : "password"}
                  id='confInp'
                  placeholder='Password'
                  required

                  onChange={checkPass}
                />
              </div>
              <div style={{ color: "red", fontSize: ".8rem" }}>{pass2}</div>
            </div>
          </div>

          <div id='feedB' onClick={() => { navigate("/") }}>
            {feedBack}
            {!feedBack ? <div></div> : <FontAwesomeIcon icon={faArrowRightFromBracket}></FontAwesomeIcon>}
          </div>

          <button type='submit' id='loginB'>
            <div>{loader ? "Register..." : "Register"}</div>
            {loader ? <div className='loader'></div> : <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>}
          </button>
        </form>

        {items.map((key, index) => (
          <div
            key={index}
            id="box"
            onMouseEnter={(e) => makeIt(e.currentTarget)}
            onMouseLeave={(e) => makeIt2(e.currentTarget)}
          >
            <div id='boxIn'></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Register;
