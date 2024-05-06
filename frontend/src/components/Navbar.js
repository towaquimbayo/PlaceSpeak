import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSession } from "../redux/actions/UserAction";

export default function Navbar() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <nav className="navbar">
      <div className="navContainer">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" className="logo">
            <img src="./logo.svg" alt="PlaceSpeak Logo" />
          </Link>
          <input type="text" placeholder="Search..." className="searchBar" />
        </div>
        <div className="navLinksContainer">
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
      </div>
    </nav>
  );
}
