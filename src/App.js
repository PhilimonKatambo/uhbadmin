import { Routes, Route, Link } from "react-router-dom";
import DashBoard from "./dashboard";
import Reception from "./Reception";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Reception />} />
        <Route path="/UnderGraduate" element={<DashBoard />} />
      </Routes>
    </div>
  );
}

export default App;
