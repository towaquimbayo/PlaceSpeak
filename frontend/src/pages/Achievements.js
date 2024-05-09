import DashboardHeader from "../components/DashboardHeader";
import Layout from "../components/Layout";
import SideNav from "../components/SidenNav";

export default function Achievements() {
  return (
    <Layout title="Achievements">
      <DashboardHeader />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>My Achievements</h2>
          <p className="description">
            Unlock achievements and badges by actively engaging in neighborhood
            discussions, creating polls, and verifying your identity
            information.
          </p>
        </div>
      </div>
    </Layout>
  );
}
