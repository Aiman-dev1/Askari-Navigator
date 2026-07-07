import MainLayout from "../components/layout/MainLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardCard from "../components/dashboard/DashboardCard";

function UserDashboard() {
  return (
    <MainLayout>
      <div className="p-10">

        <DashboardHeader title="User Dashboard" />

        <div className="grid md:grid-cols-3 gap-6">

          <DashboardCard
            title="Navigation"
            description="Search offices and find directions."
          />

          <DashboardCard
            title="Live Chat"
            description="Chat with employees and visitors."
          />

          <DashboardCard
            title="AI Assistant"
            description="Ask FAQs about the building."
          />

        </div>

      </div>
    </MainLayout>
  );
}

export default UserDashboard;