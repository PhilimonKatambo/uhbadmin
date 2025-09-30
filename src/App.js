import { Routes, Route, Link } from "react-router-dom";
import DashBoard from "./dashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DashBoard />} />
      </Routes>
    </div>
  );
}

export default App;
