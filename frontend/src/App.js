import { Routes, Route } from "react-router-dom";
import "./css/global.css";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="achievements" element={<Achievements />} />
    </Routes>
  );
}
