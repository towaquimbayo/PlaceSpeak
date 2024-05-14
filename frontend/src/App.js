import { Routes, Route } from "react-router-dom";
import "./css/global.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import Places from "./pages/Places";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="profile" element={<Profile />} />
      <Route path="achievements" element={<Achievements />} />
      <Route path="places" element={<Places />} />
    </Routes>
  );
}
