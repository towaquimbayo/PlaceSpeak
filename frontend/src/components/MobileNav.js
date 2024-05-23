import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { clearSession } from "../redux/actions/UserAction";
import { IoMdHome, IoMdMedal, IoMdPin } from "react-icons/io";
import {
  MdExplore,
  MdPeople,
  MdPoll,
  MdPrivacyTip,
  MdTopic,
  MdVerified,
} from "react-icons/md";
import {
  IoClose,
  IoNewspaper,
  IoNotifications,
  IoPeople,
} from "react-icons/io5";
import { FaAward, FaUser, FaUserTimes } from "react-icons/fa";
import { useEffect } from "react";

export default function MobileNav({ isMobileNavOpen, setIsMobileNavOpen }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Close the mobile nav when clicking outside of it
  useEffect(() => {
    const closeMobileNav = (e) => {
      if (
        isMobileNavOpen &&
        !document.querySelector(".hamburgerMenu").contains(e.target) &&
        !document.querySelector(".mobileNavContainer").contains(e.target)
      ) {
        setIsMobileNavOpen(false);
      }
    };
    document.addEventListener("click", closeMobileNav);
    return () => document.removeEventListener("click", closeMobileNav);
  }, [isMobileNavOpen, setIsMobileNavOpen]);

  return (
    <div className={`mobileNavContainer ${isMobileNavOpen ? "open" : ""}`}>
      <div className="mobileNavHeader">
        <Link to="/" className="navLogo">
          <img src="./logo.svg" alt="PlaceSpeak Logo" />
        </Link>
        <IoClose size={30} onClick={() => setIsMobileNavOpen(false)} />
      </div>
      <div className="mobileNavLinks">
        <NavLink className="navLink" to="/topics" activeclassname="active">
          Topics
        </NavLink>
        <NavLink
          className="navLink"
          to="/consultation"
          activeclassname="active"
        >
          Consultation
        </NavLink>
        {isLoggedIn ? (
          <Link
            className="navLink"
            onClick={async () => dispatch(clearSession())}
          >
            Logout
          </Link>
        ) : (
          <NavLink className="navLink" to="/login" activeclassname="active">
            Login
          </NavLink>
        )}
        <div className="navLinkGroup">
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
          <NavLink className="sideNavLink" to="/polls">
            <MdPoll />
            Polls
          </NavLink>
          <NavLink className="sideNavLink" to="/invite">
            <MdPeople />
            Invite
          </NavLink>
          <NavLink className="sideNavLink" to="/legacy-citizen">
            <IoMdMedal />
            Legacy Citizen
          </NavLink>
        </div>
        <div className="navLinkGroup">
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
    </div>
  );
}
