import Button from "./Button";
import { MdVerified } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { ImFacebook2 } from "react-icons/im";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function DashboardHeader() {
  return (
    <div className="dashboardHeaderContainer">
      <div className="dashboardInfo">
        <div className="dashboardDescription">
          <img className="profileImage" src="./img/profile-pic.jpg" alt="Profile" />
          <div className="dashboardNameContainer">
            <div className="dashboardName">
              <h1>Colleen Hardwick</h1>
              <MdVerified />
            </div>
            <p>Vancouver, BC</p>
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
