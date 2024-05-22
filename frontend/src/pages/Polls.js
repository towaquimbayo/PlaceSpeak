import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SideNav";
import { ConfettiModal } from "../components/ConfettiModal";
import Button from "../components/Button";
import { config } from "../config";

export default function Polls() {
  const navigate = useNavigate();
  const user_id = useSelector((state) => state.user.user_id);
  const [loading, setLoading] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState(false);
  const [unlockedBadgeMessage, setUnlockedBadgeMessage] = useState("");

  const voteInPoll = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.url}/api/poll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user_id }),
      });

      if (response.ok) {
        setUnlockedBadge(true);
        setUnlockedBadgeMessage("Voted in poll successfully!");
        setTimeout(() => {
          setUnlockedBadge(false);
          setUnlockedBadgeMessage("");
        }, 3000);

        // Check if badge was unlocked
        verifyBadge();
      } else {
        const data = await response.json();
        console.error("Poll participation failed:", data);
      }
    } catch (error) {
      console.error("Error during poll participation:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyBadge = async () => {
    try {
      const response = await fetch(
        `${config.url}/api/${user_id}/verify-new-voice/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.badge_granted) {
          setUnlockedBadge(false);
          setUnlockedBadge(true);
          setUnlockedBadgeMessage(
            "Congratulations! You just unlocked the New Voice Badge!"
          );
          setTimeout(() => {
            setUnlockedBadge(false);
            setUnlockedBadgeMessage("");
            navigate("/achievements");
          }, 3000);
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        const data = await response.json();
        console.error("Badge unlock failed:", data);
      }
    } catch (error) {
      console.error("Error during badge unlock:", error);
    }
  };

  return (
    <Layout title="Polls">
      <DashboardHeader />
      <ConfettiModal isOpen={unlockedBadge} message={unlockedBadgeMessage} />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>Polls</h2>
          <p className="description">
            Click the button below to participate in a poll. (This will unlock
            the New Voice Badge if you haven't already!)
          </p>
          <Button
            title="Vote in Poll"
            text="Vote in Poll"
            onClick={voteInPoll}
            loading={loading}
          />
        </div>
      </div>
    </Layout>
  );
}
