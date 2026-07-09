import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";
import { useAuth, DEFAULT_TENANT_SLUG } from "../context/AuthContext";

const ROLE_LABELS = {
  super_admin: "Super Admin",
  tenant_admin: "Building Admin",
  user: "Member",
};

function Profile() {
  const { user } = useAuth();
  const [building, setBuilding] = useState("");

  useEffect(() => {
    api
      .get(`/tenants/slug/${DEFAULT_TENANT_SLUG}`)
      .then((data) => setBuilding(data.tenant.buildingName))
      .catch(() => setBuilding(""));
  }, []);

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-6">
          My Profile
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">

          <div>
            <label className="font-bold">Username</label>

            <input
              type="text"
              value={user?.username || ""}
              disabled
              className="w-full border p-3 rounded mt-2 bg-slate-50"
            />
          </div>

          <div>
            <label className="font-bold">Email</label>

            <input
              type="text"
              value={user?.email || (user?.isGuest ? "Guest account — no email" : "")}
              disabled
              className="w-full border p-3 rounded mt-2 bg-slate-50"
            />
          </div>

          <div>
            <label className="font-bold">Building</label>

            <input
              type="text"
              value={building}
              disabled
              className="w-full border p-3 rounded mt-2 bg-slate-50"
            />
          </div>

          <div>
            <label className="font-bold">Account Type</label>

            <input
              type="text"
              value={`${ROLE_LABELS[user?.role] || "Member"}${user?.isGuest ? " (Guest)" : ""}`}
              disabled
              className="w-full border p-3 rounded mt-2 bg-slate-50"
            />
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Profile;
