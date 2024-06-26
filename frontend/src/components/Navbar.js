import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiMenu } from "react-icons/bi";
import { clearSession } from "../redux/actions/UserAction";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navContainer">
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}
        >
          <Link to="/" className="navLogo">
            <img src="./logo.svg" alt="PlaceSpeak Logo" />
          </Link>
          <input type="text" placeholder="Search..." className="searchBar" />
        </div>
        <div className="navLinksContainer">
          <BiMenu
            className="hamburgerMenu"
            size={30}
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
          />
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
        </div>
        <MobileNav
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
        />
      </div>
    </nav>
  );
}
