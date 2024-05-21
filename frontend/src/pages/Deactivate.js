import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SideNav";

export default function Deactivate() {
  return (
    <Layout title="Topics">
      <DashboardHeader />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>Deactivate</h2>
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
