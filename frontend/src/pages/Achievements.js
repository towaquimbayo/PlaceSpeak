import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../components/AlertMessage";
import DashboardHeader from "../components/DashboardHeader";
import Layout from "../components/Layout";
import SideNav from "../components/SidenNav";
import "../css/achievements.css";
import { config } from "../config";

export default function Achievements() {
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState({
    num_achievements: 0,
    num_badges: 0,
    quest_points: 0,
    days_active: 0,
  });
  const [badges, setBadges] = useState({
    badges: [],
  });
  const totalAchievements = 180;

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user_id = useSelector((state) => state.user.user_id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const endpoint = config.url;
        const response = await fetch(`${endpoint}/api/users/achievement`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user_id }),
        });

        if (!response.ok) {
          throw new Error(
            `Error fetching user achievements: ${response.statusText}`
          );
        }

        const data = await response.json();
        // console.log("Data:", data);
        setUser({
          num_achievements: data.num_achievements,
          num_badges: data.num_badges,
          quest_points: data.quest_points,
          days_active: data.days_active,
        });
      } catch (error) {
        console.error("Error:", error);
        setErrorMsg("An unexpected error occurred. Please try again later.");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const endpoint = config.url;
        const response = await fetch(`${endpoint}/api/badges`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBadges({ badges: data });
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };
    fetchBadges();
  }, []);

  function Badge({ imgSrc, imgAlt, title, description, locked }) {
    return (
      <div className={`badge ${locked ? "locked" : ""}`}>
        <img src={imgSrc} alt={imgAlt} />
        <div className="badgeInfo">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      </div>
    );
  }

  return (
    <Layout title="Achievements">
      <DashboardHeader />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <div className="headingContainer">
            <div className="achievementsHeading">
              <h2>My Achievements</h2>
              <p className="achievementsCount">{user.num_achievements}</p>
            </div>
            <div className="progressBarContainer">
              <span>
                {user.num_achievements}/{totalAchievements}
              </span>
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{
                    width:
                      (user.num_achievements / totalAchievements) * 100 + "%",
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
              <h4 className="achievementNumber">{user.num_achievements}</h4>
              <p>Achievements</p>
            </div>
            <div className="achievement">
              <h4 className="achievementNumber">{user.num_badges}</h4>
              <p>Badges</p>
            </div>
            <div className="achievement">
              <h4 className="achievementNumber">{user.quest_points}</h4>
              <p>Quest Points</p>
            </div>
            <div className="achievement">
              <h4 className="achievementNumber">{user.days_active}</h4>
              <p>Days Active</p>
            </div>
          </div>
          <div className="badgesList">
            {badges.badges
              .reduce((rows, badge, index) => {
                if (index % 2 === 0) {
                  rows.push([]);
                }
                rows[rows.length - 1].push(
                  <Badge
                    key={badge.badge_id}
                    imgSrc={`./img/badges/${badge.name}.svg`}
                    imgAlt={badge.name}
                    title={badge.name}
                    description={badge.description}
                    locked={true}
                  />
                );
                return rows;
              }, [])
              .map((row, index) => (
                <div key={index} className="badgeRow">
                  {row}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
