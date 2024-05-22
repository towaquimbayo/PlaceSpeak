import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SideNav";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { config } from "../config";
import { useEffect, useState } from "react";
import { ConfettiModal } from "../components/ConfettiModal";
import Button from "../components/Button";

export default function Verification() {
  const navigate = useNavigate();
  const { isLoggedIn, user_id, firstName, pfp_link } = useSelector((state) => state.user);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState(false);
  const [unlockedBadgeMessage, setUnlockedBadgeMessage] = useState("");

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${config.url}/api/users/${user_id}/update-email-verification/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified_email: true }),
      });

      if (response.ok) {
        setUnlockedBadge(true);
        setUnlockedBadgeMessage("Email verified successfully!");
        setTimeout(() => {
          setUnlockedBadge(false);
          setUnlockedBadgeMessage("");
        }, 3000);

        // Check if badge was unlocked
        verifyBadge();
      } else {
        const data = await response.json();
        console.error("Email verification failed:", data);
      }
    } catch (error) {
      console.error("Error during email verification:", error);
    } finally {
      setLoading(false);
    }
  }

  const verifyPhone = async () => {
    try {
      const response = await fetch(`${config.url}/api/users/${user_id}/update-phone-verification/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified_phone: true }),
      });

      if (response.ok) {
        setUnlockedBadge(true);
        setUnlockedBadgeMessage("Phone verified successfully!");
        setTimeout(() => {
          setUnlockedBadge(false);
          setUnlockedBadgeMessage("");
        }, 3000);

        // Check if badge was unlocked
        verifyBadge();
      } else {
        const data = await response.json();
        console.error("Phone verification failed:", data);
      }
    } catch (error) {
      console.error("Error during phone verification:", error);
    } finally {
      setLoading(false);
    }
  }

  const verifyAddress = async () => {
    try {
      const response = await fetch(`${config.url}/api/users/${user_id}/update-address-verification/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified_address: true }),
      });

      if (response.ok) {
        setUnlockedBadge(true);
        setUnlockedBadgeMessage("Address verified successfully!");
        setTimeout(() => {
          setUnlockedBadge(false);
          setUnlockedBadgeMessage("");
        }, 3000);

        // Check if badge was unlocked
        verifyBadge();
      } else {
        const data = await response.json();
        console.error("Address verification failed:", data);
      }
    } catch (error) {
      console.error("Error during address verification:", error);
    } finally {
      setLoading(false);
    }
  }

  const verifyBadge = async () => {
    try {
      const response = await fetch(`${config.url}/api/${user_id}/verify-trusted-neighbour/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.badge_granted) {
          setUnlockedBadge(false);
          setUnlockedBadge(true);
          setUnlockedBadgeMessage("Badge unlocked successfully!");
          setTimeout(() => {
            setUnlockedBadge(false);
            setUnlockedBadgeMessage("");
          }, 3000);
        }
      } else {
        const data = await response.json();
        console.error("Badge unlock failed:", data);
      }
    } catch (error) {
      console.error("Error during badge unlock:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Verification">
      <DashboardHeader />
      <ConfettiModal isOpen={unlockedBadge} message={unlockedBadgeMessage} />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>Verification</h2>
          <p className="description">
            Click the buttons below to verify your account details.
          </p>
          <Button className="button" onClick={verifyEmail} customStyle={{'marginBottom': '1rem'}}>
            Verify Email
          </Button>
          <Button className="button" onClick={verifyPhone} customStyle={{'marginBottom': '1rem'}}>
            Verify Phone
          </Button>
          <Button className="button" onClick={verifyAddress}>
            Verify Address
          </Button>
        </div>
      </div>
    </Layout>
  );
}
