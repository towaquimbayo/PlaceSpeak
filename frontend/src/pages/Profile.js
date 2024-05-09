import DashboardHeader from "../components/DashboardHeader";
import Layout from "../components/Layout";
import SideNav from "../components/SidenNav";

export default function Profile() {
  return (
    <Layout title="Profile">
      <DashboardHeader />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>My Account</h2>
          <p className="description">
            Please review your profile details to ensure accuracy. Don't forget
            to verify your email, address, and phone number for a verified
            badge!
          </p>
        </div>
      </div>
    </Layout>
  );
}
