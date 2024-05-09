import { NavLink } from "react-router-dom";
import { IoMdHome, IoMdPin } from "react-icons/io";
import { MdExplore, MdPrivacyTip, MdTopic, MdVerified } from "react-icons/md";
import { IoNewspaper, IoNotifications, IoPeople } from "react-icons/io5";
import { FaAward, FaUser, FaUserTimes } from "react-icons/fa";

export default function SideNav() {
  return (
    <div className="sideNav">
      <div className="sideNavLinks">
        <h3>General</h3>
        <NavLink className="sideNavLink" to="/">
          <IoMdHome />
          Dashboard
        </NavLink>
        <NavLink className="sideNavLink" to="/topics">
          <MdTopic />
          Topics
        </NavLink>
        <NavLink className="sideNavLink" to="/neighborhood">
          <IoPeople />
          Neighborhood
        </NavLink>
        <NavLink className="sideNavLink" to="/news">
          <IoNewspaper />
          News
        </NavLink>
        <NavLink className="sideNavLink" to="/explore">
          <MdExplore />
          Explore
        </NavLink>
      </div>

      <div className="sideNavLinks">
        <h3>Account</h3>
        <NavLink className="sideNavLink" to="/profile">
          <FaUser />
          Profile
        </NavLink>
        <NavLink className="sideNavLink" to="/places">
          <IoMdPin />
          Places
        </NavLink>
        <NavLink className="sideNavLink" to="/achievements">
          <FaAward />
          Achievements
        </NavLink>
        <NavLink className="sideNavLink" to="/verification">
          <MdVerified />
          Verification
        </NavLink>
        <NavLink className="sideNavLink" to="/topic-privacy">
          <MdPrivacyTip />
          Topic Privacy
        </NavLink>
        <NavLink className="sideNavLink" to="/notifications">
          <IoNotifications />
          Notifications
        </NavLink>
        <NavLink className="sideNavLink" to="/deactivate">
          <FaUserTimes />
          Deactivate
        </NavLink>
      </div>
    </div>
  );
}
