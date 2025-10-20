import { useRef, useState } from 'react';
import './css/login.css';
import { animate } from "animejs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUserPlus, faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons';

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

  const [userRole,setUserRole] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstNameInp").value;
    const surName = document.getElementById("surNameInp").value;
    const userId = makeID()
    const userEmail = document.getElementById("emailInp").value;
    const userPassword = document.getElementById("passInp").value;
    try {
      const res = await fetch("http://localhost:9000/users", {
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
      } else {
        setMessage(["Register failed", "User cannot be registered, try agin later"]);
        openDialog()
      }
    } catch (error) {
      setMessage(["Register failed", "User cannot be registered, try agin later"]);
      openDialog()
    }
  };

  return (
    <div id="loginPage" style={{ backgroundImage: "url('./assets/images/course_ed.jpg')" }}>
      <div id='blur'>
        <form id="form2" onSubmit={handleSubmit}>
          <div id='logoFooter2' style={{ backgroundImage: "url('./assets/logos/logo3.jpg')" }}></div>
          <div id='feedB'>{feedBack}</div>
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
              <select required onChange={(e)=>setUserRole(e.target.value)}>
                <option>-- Select user role --</option>
                <option value={"Reception"}>Reception</option>
                <option value={"Head"}>Head of department</option>
                <option value={"Registrer"}>Registrer</option>
                 <option value={"superior"}>Superior</option>
              </select>
            </div>
            <div id='nameTh'>
              <input type='email' id='emailInp' placeholder='Email' required />
              <FontAwesomeIcon icon={faEnvelope} id='icon' />
            </div>
            <div id='nameTh'>
              <input
                type={visible ? "text" : "password"}
                id='passInp'
                placeholder='Password'
                required
              />
              {/* <FontAwesomeIcon
                icon={visible ? faEye : faEyeSlash}
                id='icon'
                onClick={() => setVisible(!visible)}
              /> */}
            </div>
          </div>

          <button type='submit' id='loginB'>
            <div>Register</div>
            <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
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
