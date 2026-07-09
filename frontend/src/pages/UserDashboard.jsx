import MainLayout from "../components/layout/MainLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardCard from "../components/dashboard/DashboardCard";
import { useAuth } from "../context/AuthContext";

function UserDashboard() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-[75vh]">

        <DashboardHeader title="Member Dashboard" />

        <div className="grid md:grid-cols-3 gap-8">

          <DashboardCard
            title="Indoor Navigation"
            description="Access interactive directions, floor information, and room routes."
            to="/navigation"
          />

          {!user?.isGuest && (
            <DashboardCard
              title="Tenant Chat Space"
              description="Communicate in real-time with other businesses and administration."
              to="/chat"
            />
          )}

          <DashboardCard
            title="AI Virtual Concierge"
            description="Inquire FAQs, building amenities details, and guidelines instantly."
            onClick={() => window.dispatchEvent(new CustomEvent("open-ai-concierge"))}
          />

        </div>

      </div>
    </MainLayout>
  );
}

export default UserDashboard;