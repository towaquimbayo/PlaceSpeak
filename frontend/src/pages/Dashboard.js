import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SidenNav";
import { config } from "../config";

export default function Dashboard() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user_id = useSelector((state) => state.user.user_id);

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    city: "",
    province: "",
  })

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const endpoint = config.url;
        // const hardcoded_email = "colleen@gmail.com";
        const response = await fetch(`${endpoint}/api/users/primaryAddress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: `${user_id}` }),
        });
        if (!response.ok) {
          throw new Error(
            `Error fetching user details: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Data:", data);
        setUserInfo(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <Layout title="Dashboard">
      <DashboardHeader name={`${userInfo.firstName} ${userInfo.lastName}`} city={`${userInfo.city}`} province={`${userInfo.province}`}/>
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>My Dashboard</h2>
          <p className="description">
            Engage in lively community dialogues, share your insights, and forge
            connections with your neighbors as you delve into enriching
            conversations!
          </p>
        </div>
      </div>
    </Layout>
  );
}
