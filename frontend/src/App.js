import { Routes, Route } from "react-router-dom";
import "./css/global.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import Places from "./pages/Places";
import Topics from "./pages/Topics";
import Neighborhood from "./pages/Neighborhood";
import News from "./pages/News";
import Explore from "./pages/Explore";
import Verification from "./pages/Verification";
import TopicPrivacy from "./pages/TopicPrivacy";
import Notifications from "./pages/Notifications";
import Deactivate from "./pages/Deactivate";
import Consultation from "./pages/Consultation";
import Polls from "./pages/Polls";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="profile" element={<Profile />} />
      <Route path="achievements" element={<Achievements />} />
      <Route path="places" element={<Places />} />
      <Route path="verification" element={<Verification />} />
      <Route path="polls" element={<Polls />} />
      <Route path="*" element={<Dashboard />} />

      {/* The following routes are not yet implemented */}
      <Route path="consultation" element={<Consultation />} />
      <Route path="topics" element={<Topics />} />
      <Route path="neighborhood" element={<Neighborhood />} />
      <Route path="news" element={<News />} />
      <Route path="explore" element={<Explore />} />
      <Route path="topic-privacy" element={<TopicPrivacy />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="deactivate" element={<Deactivate />} />
    </Routes>
  );
}
