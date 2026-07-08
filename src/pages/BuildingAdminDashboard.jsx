import MainLayout from "../components/layout/MainLayout";
import { Link } from "react-router-dom";

function BuildingAdminDashboard() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-8">
          Building Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <Link
            to="/manage-offices"
            className="bg-white shadow-lg rounded-xl p-6 hover:bg-cyan-50"
          >
            <h2 className="text-2xl font-bold">Manage Offices</h2>
            <p>Add, Edit and Delete Offices</p>
          </Link>

          <Link
            to="/manage-faqs"
            className="bg-white shadow-lg rounded-xl p-6 hover:bg-cyan-50"
          >
            <h2 className="text-2xl font-bold">Manage FAQs</h2>
            <p>Update AI Questions</p>
          </Link>

          <Link
            to="/floor-maps"
            className="bg-white shadow-lg rounded-xl p-6 hover:bg-cyan-50"
          >
            <h2 className="text-2xl font-bold">Floor Maps</h2>
            <p>Upload Building Maps</p>
          </Link>

          <Link
            to="/chat-moderation"
            className="bg-white shadow-lg rounded-xl p-6 hover:bg-cyan-50"
          >
            <h2 className="text-2xl font-bold">Chat Moderation</h2>
            <p>Manage Chat Messages</p>
          </Link>

        </div>

      </div>
    </MainLayout>
  );
}

export default BuildingAdminDashboard;