import DashboardHeader from "../components/DashboardHeader";
import Layout from "../components/Layout";
import SideNav from "../components/SidenNav";

export default function Places() {
  return (
    <Layout title="Places">
      <DashboardHeader />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>My Places</h2>
          <p className="description">
            Where you live determines which consultations you are eligible to
            participate in. If you live in one place but work in another, or if
            you have homes in more than one location, you can add extra places
            to participate in consultations in those areas as well.
          </p>
        </div>
      </div>
    </Layout>
  );
}
