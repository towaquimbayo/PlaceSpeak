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
        console.log("Data:", data);
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
            <div className="badgeRow">
              <Badge
                imgSrc="./img/topic.svg"
                imgAlt="Welcome Badge"
                title="Welcome Badge"
                description="Awarded to those who have recently joined Placespeak."
                locked={false}
              />
              <Badge
                imgSrc="./img/id.svg"
                imgAlt="Verification Badge"
                title="Verification Badge"
                description="This badge signifies that a user's identity and address have been verified, enhancing the trustworthiness and authenticity of their contributions."
                locked={false}
              />
            </div>
            <div className="badgeRow">
              <Badge
                imgSrc="./img/connector.svg"
                imgAlt="Invitation Badge"
                title="Invitation Badge"
                description="Awarded for inviting their first neighbor to PlaceSpeak to participate in a poll or discussion."
                locked={true}
              />
              <Badge
                imgSrc="./img/lock.svg"
                imgAlt="Long-Time User Badge"
                title="Long-Time User Badge"
                description="Long-time users consistently participating over the years. Their stories and contributions become legendary within the community."
                locked={false}
              />
            </div>
            <div className="badgeRow">
              <Badge
                imgSrc="./img/comment.svg"
                imgAlt="Comment Badge"
                title="Comment Badge"
                description="Awarded after their first insightful comment or question. This badge acknowledges the initiation into the realm of discussions."
                locked={true}
              />
              <Badge
                imgSrc="./img/debate.svg"
                imgAlt="Participating Poll Badge"
                title="Participating Poll Badge"
                description="Celebrating your inaugural participation! This badge acknowledges your initial step in voicing your opinion and contributing to the community's collective decision-making."
                locked={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
