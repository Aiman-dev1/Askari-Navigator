import MainLayout from "../components/layout/MainLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardCard from "../components/dashboard/DashboardCard";

function BuildingAdminDashboard() {
  return (
    <MainLayout>
      <div className="p-10">

        <DashboardHeader title="Building Admin Dashboard" />

        <div className="grid md:grid-cols-3 gap-6">

          <DashboardCard
            title="Manage Offices"
            description="Add, edit and delete office locations."
          />

          <DashboardCard
            title="Manage Floor Maps"
            description="Upload and update building maps."
          />

          <DashboardCard
            title="Manage FAQs"
            description="Add FAQs for the AI Assistant."
          />

        </div>

      </div>
    </MainLayout>
  );
}

export default BuildingAdminDashboard;