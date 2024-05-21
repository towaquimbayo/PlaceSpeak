import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AlertMessage from "../components/AlertMessage";
import DashboardHeader from "../components/DashboardHeader";
import Layout from "../components/Layout";
import SideNav from "../components/SidenNav";
import "../css/achievements.css";
import { config } from "../config";

export default function Achievements() {
  const user_id = useSelector((state) => state.user.user_id);

  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState({
    num_achievements: 0,
    num_badges: 0,
    quest_points: 0,
    days_active: 0,
  });
  const [badges, setBadges] = useState( [] );

  const totalAchievements = 180;

  // fetch achievement stats for the current user
  useEffect(() => {
    const fetchAchievements = async () => {
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
        console.log("Data:", data);
        setUser(data);
      } catch (error) {
        console.error("Error:", error);
        setErrorMsg("An unexpected error occurred. Please try again later.");
      }
    };
    fetchAchievements();
  }, [user_id]);

  // fetch all badges from the database and store in a state list
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const endpoint = config.url;
        const response = await fetch(`${endpoint}/api/badges`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Initialize all badges as locked
        const lockedBadges = data.map(badge => ({ ...badge, unlocked: false }));
        setBadges(lockedBadges);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };
    fetchBadges();
  }, []);

  // fetch all badges earned by the user and unlock the badges that belong to the user
  useEffect(() => {
    const fetchUserBadges = async() => {
      try {
        const endpoint = config.url;
        const response = await fetch(`${endpoint}/api/users/badges/${user_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const earnedBadges = await response.json();
        const updatedBadges = badges.map(badge => ({
          ...badge,
          unlocked: earnedBadges.some(earnedBadge => earnedBadge.badge_id === badge.badge_id),
        }));
        setBadges(updatedBadges);
      } catch (error) {
        console.error("Error fetching user badges:", error);
      }
    };
    if (badges.length > 0) {
      fetchUserBadges();
    }
  }, [badges.length, user_id]);

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
            {badges.length > 0 && badges
              .reduce((rows, badge, index) => {
                if (index % 2 === 0) {
                  rows.push([]);
                }
                rows[rows.length - 1].push(
                  <Badge
                    key={badge.id}
                    imgSrc={`./img/badges/${badge.name}.svg`}
                    imgAlt={badge.name}
                    title={badge.name}
                    description={badge.description}
                    locked={!badge.unlocked}
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
