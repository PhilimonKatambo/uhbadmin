import { Routes, Route, Link } from "react-router-dom";
import DashBoard from "./dashboard";
import Reception from "./Reception";
import PostG from "./postG";
import PostG2 from "./postG2";
import DashBoard2 from "./under2";
import NewsPage from "./newsPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Reception />} />
        <Route path="/UnderGraduate" element={<DashBoard />} />
        <Route path="/PostGraduate" element={<PostG />} />
  

        <Route path="/UnderGraduate2" element={<DashBoard2 />} />
        <Route path="/PostGraduate2" element={<PostG2 />} />
        <Route path="/News" element={<NewsPage />} />
      </Routes>
    </div>
  );
}

export default App;
