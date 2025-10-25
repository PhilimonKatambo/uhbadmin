import { useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "./userSlice"; 
import DashBoard from "./dashboard";
import Reception from "./Reception";
import PostG from "./postG";
import PostG2 from "./postG2";
import DashBoard2 from "./under2";
import NewsPage from "./newsPage";
import Register from "./Register";
import Login from "./Login";
import OfferLetterForm from "./entryModes";
import History from "./history";
import Users from "./users";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const TIME_LIMIT = 300000;

  useEffect(() => {
    const clearLocalStorage = () => {
      localStorage.clear();
      dispatch(logout());
      navigate("/");
    };

    const resetTimer = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(clearLocalStorage, TIME_LIMIT);
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    timeoutRef.current = setTimeout(clearLocalStorage, TIME_LIMIT);

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timeoutRef.current);
    };
  }, [dispatch, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Reception" element={<Reception />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/UnderGraduate" element={<DashBoard />} />
        <Route path="/PostGraduate" element={<PostG />} />
        <Route path="/UnderGraduate2" element={<DashBoard2 />} />
        <Route path="/PostGraduate2" element={<PostG2 />} />
        <Route path="/News" element={<NewsPage />} />
        <Route path="/History" element={<History />} />
      </Routes>
    </div>
  );
}

export default App;
