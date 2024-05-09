import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SidenNav";

export default function Dashboard() {
  return (
    <Layout title="Dashboard">
      <DashboardHeader />
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
