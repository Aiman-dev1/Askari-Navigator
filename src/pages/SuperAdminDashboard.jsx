import MainLayout from "../components/layout/MainLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardCard from "../components/dashboard/DashboardCard";

function SuperAdminDashboard() {
  return (
    <MainLayout>
      <div className="p-10">

        <DashboardHeader title="Super Admin Dashboard" />

        <div className="grid md:grid-cols-3 gap-6">

          <DashboardCard
            title="Manage Buildings"
            description="Create and manage building accounts."
          />

          <DashboardCard
            title="Subscriptions"
            description="Manage SaaS subscription plans."
          />

          <DashboardCard
            title="Analytics"
            description="View system usage and reports."
          />

        </div>

      </div>
    </MainLayout>
  );
}

export default SuperAdminDashboard;