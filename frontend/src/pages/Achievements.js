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
  const [achievements, setAchievements] = useState({
    num_achievements: 0,
    num_badges: 0,
    quest_points: 0,
    days_active: 0,
  });
  const [badges, setBadges] = useState([]);
  const totalAchievements = 180;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch achievement stats for the current user
        const endpoint = config.url;
        const achievementsResponse = await fetch(
          `${endpoint}/api/users/achievement`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user_id }),
          }
        );
        if (!achievementsResponse.ok) {
          throw new Error(
            `Error fetching user achievements: ${achievementsResponse.statusText}`
          );
        }

        const achievementsdata = await achievementsResponse.json();
        console.log("Achievements:", achievementsdata);
        setAchievements(achievementsdata);

        // fetch all badges from the database and store in a state list
        const badgesResponse = await fetch(`${endpoint}/api/badges`);
        if (!badgesResponse.ok) {
          throw new Error(
            `Error fetching badges: ${badgesResponse.statusText}`
          );
        }
        const badgesdata = await badgesResponse.json();
        console.log("Badges:", badgesdata);

        // Initialize all badges as locked
        const lockedBadges = badgesdata.map((badge) => ({
          ...badge,
          unlocked: false,
        }));
        setBadges(lockedBadges);

        // Return if the user has not earned any badges
        if (lockedBadges.length === 0) return;

        // fetch all badges earned by the user and unlock the badges that belong to the user
        const userBadgesResponse = await fetch(
          `${endpoint}/api/users/badges/${user_id}`
        );
        if (!userBadgesResponse.ok) {
          throw new Error(
            `Error fetching user badges: ${userBadgesResponse.statusText}`
          );
        }
        const userBadgesData = await userBadgesResponse.json();
        console.log("User Badges:", userBadgesData);

        // Create a set of unlocked badge IDs for quick lookup
        const unlockedBadgeIds = new Set(
          userBadgesData.map((badge) => badge.badge_id)
        );
        const updatedBadges = lockedBadges.map((badge) => ({
          ...badge,
          unlocked: unlockedBadgeIds.has(badge.badge_id),
        }));
        setBadges(updatedBadges);
      } catch (error) {
        console.error("Error:", error);
        setErrorMsg("An unexpected error occurred. Please try again later.");
      }
    };

    fetchData();
  }, [user_id]);

  // Calculate progress percentage
  const calculateProgress = () => {
    return (achievements.num_achievements / totalAchievements) * 100;
  };

  // Display individual badge
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

  // Display badges in rows of two
  function BadgesList() {
    const badgeRows = badges.reduce((rows, badge, index) => {
      if (index % 2 === 0) rows.push([]);
      rows[Math.floor(index / 2)].push(
        <Badge
          key={badge.badge_id}
          imgSrc={`./img/badges/${badge.name}.svg`}
          imgAlt={badge.name}
          title={badge.name}
          description={badge.description}
          locked={!badge.unlocked}
        />
      );
      return rows;
    }, []);

    return (
      <div className="badgesList">
        {badgeRows.map((row, index) => (
          <div key={index} className="badgeRow">
            {row}
          </div>
        ))}
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
              <p className="achievementsCount">
                {achievements.num_achievements}
              </p>
            </div>
            <div className="progressBarContainer">
              <span>
                {achievements.num_achievements}/{totalAchievements}
              </span>
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{
                    width:
                      calculateProgress() > 100
                        ? "100%"
                        : `${calculateProgress()}%`,
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
              <h4 className="achievementNumber">
                {achievements.num_achievements}
              </h4>
              <p>Achievements</p>
            </div>
            <div className="achievement">
              <h4 className="achievementNumber">{achievements.num_badges}</h4>
              <p>Badges</p>
            </div>
            <div className="achievement">
              <h4 className="achievementNumber">{achievements.quest_points}</h4>
              <p>Quest Points</p>
            </div>
            <div className="achievement">
              <h4 className="achievementNumber">{achievements.days_active}</h4>
              <p>Days Active</p>
            </div>
          </div>
          <div className="badgesList">
            <BadgesList />
          </div>
        </div>
      </div>
    </Layout>
  );
}
