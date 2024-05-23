import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SideNav";
import { ConfettiModal } from "../components/ConfettiModal";
import Button from "../components/Button";
import { config } from "../config";

export default function LegacyCitizen() {
  const navigate = useNavigate();
  const user_id = useSelector((state) => state.user.user_id);
  const [loading, setLoading] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState(false);
  const [unlockedBadgeMessage, setUnlockedBadgeMessage] = useState("");

  // Dummy function to add a year to the account age
  const ageAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.url}/api/age-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user_id }),
      });

      if (response.ok) {
        setUnlockedBadge(true);
        setUnlockedBadgeMessage("Successfully increased account age by 1 year!");
        setTimeout(() => {
          setUnlockedBadge(false);
          setUnlockedBadgeMessage("");
        }, 3000);

        // Check if badge was unlocked
        verifyBadge();
      } else {
        const data = await response.json();
        console.error("Aging account failed:", data);
      }
    } catch (error) {
      console.error("Error aging account:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyBadge = async () => {
    try {
      const response = await fetch(
        `${config.url}/api/${user_id}/verify-legacy-citizen/`,
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
            "Congratulations! You just unlocked the Legacy Citizen Badge!"
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
    <Layout title="Legacy Citizen">
      <DashboardHeader />
      <ConfettiModal isOpen={unlockedBadge} message={unlockedBadgeMessage} />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>Legacy Citizen</h2>
          <p className="description">
            Click the button below to age your account by one year. (This will clear one of the requirements for the Legacy Citizen badge.) You must also have at least 10 interactions (posts, comments, polls answered) to unlock the badge. 
          </p>
            <div>
              <Button
                title="Increase Account Age"
                text="Increase Account Age"
                onClick={ageAccount}
                loading={loading}
              />
            </div>
        </div>
      </div>
    </Layout>
  );
}
