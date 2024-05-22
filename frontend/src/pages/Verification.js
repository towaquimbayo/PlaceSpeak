import { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SideNav";
import { ConfettiModal } from "../components/ConfettiModal";
import Button from "../components/Button";
import { config } from "../config";

export default function Verification() {
  const user_id = useSelector((state) => state.user.user_id);
  const [unlockedBadge, setUnlockedBadge] = useState(false);
  const [unlockedBadgeMessage, setUnlockedBadgeMessage] = useState("");

  const verifyEmail = async () => {
    try {
      const response = await fetch(
        `${config.url}/api/users/${user_id}/update-email-verification/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified_email: true }),
        }
      );

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
    }
  };

  const verifyPhone = async () => {
    try {
      const response = await fetch(
        `${config.url}/api/users/${user_id}/update-phone-verification/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified_phone: true }),
        }
      );

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
    }
  };

  const verifyAddress = async () => {
    try {
      const response = await fetch(
        `${config.url}/api/users/${user_id}/update-address-verification/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified_address: true }),
        }
      );

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
    }
  };

  const verifyBadge = async () => {
    try {
      const response = await fetch(
        `${config.url}/api/${user_id}/verify-trusted-neighbour/`,
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
    }
  };

  return (
    <Layout title="Verification">
      <DashboardHeader />
      <ConfettiModal isOpen={unlockedBadge} message={unlockedBadgeMessage} />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>Verification</h2>
          <p className="description">
            Participants are encouraged to further verify their location using
            the verification options provided below. Verification gives further
            assurance to proponents that they are hearing from the right people
            relevant area(s).
          </p>
          <Button
            title="Verify Email"
            text="Verify Email"
            onClick={verifyEmail}
            customStyle={{ marginBottom: "1rem" }}
          />
          <Button
            title="Verify Phone"
            text="Verify Phone"
            onClick={verifyPhone}
            customStyle={{ marginBottom: "1rem" }}
          />
          <Button
            title="Verify Address"
            text="Verify Address"
            onClick={verifyAddress}
          />
        </div>
      </div>
    </Layout>
  );
}
