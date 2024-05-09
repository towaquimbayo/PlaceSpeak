import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SidenNav";

export default function Dashboard() {
  return (
    <Layout title="Dashboard">
      <DashboardHeader />
      <div className="dashboardContainer">
        <SideNav />
      </div>
    </Layout>
  );
}
