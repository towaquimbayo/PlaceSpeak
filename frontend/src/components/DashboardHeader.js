import Button from "./Button";
import { MdVerified } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { ImFacebook2 } from "react-icons/im";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { isLoggedIn, firstName, lastName, city, province, pfp_link } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  return (
    <div className="dashboardHeaderContainer">
      <div className="dashboardInfo">
        <div className="dashboardDescription">
          <img
            className="profileImage"
            src={pfp_link || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${firstName}`}
            alt="Profile"
          />
          <div className="dashboardNameContainer">
            <div className="dashboardName">
              <h1>{`${firstName} ${lastName}`}</h1>
              <MdVerified />
            </div>
            {city && province ? (
              <p>{`${city}, ${province}`}</p>
            ) : (
              <p>You haven't set your location yet.</p>
            )}
          </div>
        </div>
        <div className="dashboardSocials">
          <div className="socialIcons">
            <ImFacebook2 color="#1877F2" style={{ padding: "2px" }} />
            <FaLinkedin color="#0762C8" />
            <FaSquareXTwitter color="black" />
          </div>
          <Button text="Invite Friends" />
        </div>
      </div>
    </div>
  );
}
