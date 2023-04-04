import { Routes, Route } from "react-router-dom";
import Signup from "./view/Signup";
import Login from "./view/Login";
import FanProfilepage from "./view/FanProfilepage";
// import "./App.css";
const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user/fan" element={<FanProfilepage />} />
    </Routes>
  );
};

export default App;
