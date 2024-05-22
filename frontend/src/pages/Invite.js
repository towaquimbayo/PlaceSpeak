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

  const neighborNames = ["John Doe", "Alice Smith", "Bob Johnson"]

  // Dummy function to simulate inviting a neighbor
  const inviteNeighbor = async (name) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.url}/api/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user_id }),
      });

      if (response.ok) {
        setUnlockedBadge(true);
        setUnlockedBadgeMessage("Successfully invited " + name + "!");
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
            Click any button below to invite a neighbour. (This will unlock the Welcoming Whisperer Badge!) 
          </p>
          {neighborNames.map((name, index) => (
            <div style={{marginBottom: '1rem', border: '1px lightgray solid', borderRadius: '8px', padding: '16px'}}>
              <h3 style={{marginBottom: '1rem'}}>Invite {name}</h3>
              <p>{name} is a new neighbour in your community. Invite them to join your neighbourhood!</p>
              <Button
                title="Invite Neighbour"
                text="Invite Neighbour"
                onClick={() => inviteNeighbor(name)}
                loading={loading}
                customStyle={{ marginTop: "1rem" }}
              />
            </div>  
          ))}
                  
        </div>
      </div>
    </Layout>
  );
}
