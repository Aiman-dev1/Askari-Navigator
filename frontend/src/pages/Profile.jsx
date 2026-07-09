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
      <div className="max-w-xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* Page Header */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            My Profile
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Manage your verified portal settings and identity credentials
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400"></div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <div>
            <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold block mb-1">Username / Name</label>
            <input
              type="text"
              value={user?.username || ""}
              disabled
              className="w-full border border-gray-200 p-3.5 rounded text-sm bg-slate-50 text-gray-500 font-light"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold block mb-1">Email Address</label>
            <input
              type="text"
              value={user?.email || (user?.isGuest ? "Guest Account — No Verified Email" : "")}
              disabled
              className="w-full border border-gray-200 p-3.5 rounded text-sm bg-slate-50 text-gray-500 font-light"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold block mb-1">Assigned Property</label>
            <input
              type="text"
              value={building || "Askari Corporate Tower"}
              disabled
              className="w-full border border-gray-200 p-3.5 rounded text-sm bg-slate-50 text-gray-500 font-light"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold block mb-1">Account Credentials Class</label>
            <input
              type="text"
              value={`${ROLE_LABELS[user?.role] || "Member"}${user?.isGuest ? " (Temporary Visitor)" : ""}`}
              disabled
              className="w-full border border-gray-200 p-3.5 rounded text-sm bg-slate-50 text-gray-500 font-light"
            />
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Profile;
