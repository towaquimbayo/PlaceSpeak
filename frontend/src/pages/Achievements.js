import { useState } from "react";
import AlertMessage from "../components/AlertMessage";
import DashboardHeader from "../components/DashboardHeader";
import Layout from "../components/Layout";
import SideNav from "../components/SidenNav";
import "../css/achievements.css";

export default function Achievements() {
  const totalAchieve = 180;
  const completedAchieve = 152;
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <Layout title="Achievements">
      <DashboardHeader />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <div className="headingContainer">
            <div className="achievementsHeading">
              <h2>My Achievements</h2>
              <p className="achievementsCount">{completedAchieve}</p>
            </div>
            <div className="progressBarContainer">
              <span>
                {completedAchieve}/{totalAchieve}
              </span>
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{
                    width: (completedAchieve / totalAchieve) * 100 + "%",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <p className="description">
            Unlock achievements and badges by actively engaging in neighborhood
            discussions, creating polls, and verifying your identity
            information.
          </p>
          {errorMsg && <AlertMessage type="error" msg={errorMsg} />}
          <div className="achievementsContainer">
            <div className="achievement">
              <h4 className="achievementNumber">152</h4>
              <p className="achievementTitle">Achievements</p>
            </div>
            <div className="achievement">
              <h4 className="achievementNumber">3</h4>
              <p className="achievementTitle">Badges</p>
            </div>
            <div className="achievement">
              <h4 className="achievementNumber">589</h4>
              <p className="achievementTitle">Quest Points</p>
            </div>
            <div className="achievement">
              <h4 className="achievementNumber">462</h4>
              <p className="achievementTitle">Days Active</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
