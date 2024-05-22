import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SideNav";
import { ConfettiModal } from "../components/ConfettiModal";
import Button from "../components/Button";
import { config } from "../config";

export default function Invite() {
  const navigate = useNavigate();
  const user_id = useSelector((state) => state.user.user_id);
  const [loading, setLoading] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState(false);
  const [unlockedBadgeMessage, setUnlockedBadgeMessage] = useState("");

  // Dummy function to simulate inviting a neighbor
  const inviteNeighbor = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.url}/api/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user_id }),
      });

      if (response.ok) {
        setUnlockedBadge(true);
        setUnlockedBadgeMessage("Successfully invited John Doe!");
        setTimeout(() => {
          setUnlockedBadge(false);
          setUnlockedBadgeMessage("");
        }, 3000);

        // Check if badge was unlocked
        verifyBadge();
      } else {
        const data = await response.json();
        console.error("Neighbor invitation failed:", data);
      }
    } catch (error) {
      console.error("Error inviting neighbor:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyBadge = async () => {
    try {
      const response = await fetch(
        `${config.url}/api/${user_id}/verify-welcoming-whisperer/`,
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
            "Congratulations! You just unlocked the Welcoming Whisperer Badge!"
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
    <Layout title="Invite">
      <DashboardHeader />
      <ConfettiModal isOpen={unlockedBadge} message={unlockedBadgeMessage} />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>Invite Neighbour</h2>
          <p className="description">
            Click the button below to invite a neighbour. (This will unlock the Welcoming Whisperer Badge!) 
          </p>
          <Button
            title="Invite Neighbour"
            text="Invite Neighbour"
            onClick={inviteNeighbor}
            loading={loading}
          />
        </div>
      </div>
    </Layout>
  );
}
