import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";

const STATUS_STYLES = {
  Active: "text-green-600",
  Trial: "text-blue-600",
  Suspended: "text-orange-500",
  Cancelled: "text-red-500",
};

function SuperAdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ buildingName: "", slug: "" });

  const loadTenants = () => {
    api
      .get("/tenants")
      .then((data) => setTenants(data.tenants))
      .catch((err) => toast.error(err.message));
  };

  useEffect(loadTenants, []);

  const addTenant = async () => {
    if (!form.buildingName || !form.slug) return toast.error("Fill in name and slug");
    try {
      await api.post("/tenants", form);
      setForm({ buildingName: "", slug: "" });
      toast.success("Building onboarded");
      loadTenants();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const setStatus = async (id, subscriptionStatus) => {
    try {
      await api.patch(`/tenants/${id}`, { subscriptionStatus });
      loadTenants();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const activeCount = tenants.filter((t) => t.subscriptionStatus === "Active").length;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">

        {/* Dashboard Header */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Onboard new properties, manage subscriptions, and oversee global tenants
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400"></div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-slate-900 border border-gold-400/20 text-white rounded p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>
            <h2 className="text-4xl font-serif font-bold text-gold-400">{tenants.length}</h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">Total Buildings</p>
          </div>

          <div className="bg-slate-900 border border-gold-400/20 text-white rounded p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>
            <h2 className="text-4xl font-serif font-bold text-gold-400">{activeCount}</h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">Active Subscriptions</p>
          </div>

          <div className="bg-slate-900 border border-gold-400/20 text-white rounded p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>
            <h2 className="text-4xl font-serif font-bold text-gold-400">
              {tenants.filter((t) => t.subscriptionStatus === "Trial").length}
            </h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">Trials</p>
          </div>

        </div>

        {/* Onboard building */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 tracking-wide uppercase">
            Onboard New Building Property
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1">Building Name</label>
              <input
                placeholder="e.g. Askari Corporate Tower"
                value={form.buildingName}
                onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
                className="border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1">System URL Slug</label>
              <input
                placeholder="e.g. askari-tower"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>

          </div>

          <button
            onClick={addTenant}
            className="mt-6 bg-gold-400 hover:bg-gold-500 text-slate-950 px-6 py-3 rounded font-bold uppercase tracking-wider text-xs transition-all shadow cursor-pointer"
          >
            Onboard Building
          </button>

        </div>

        {/* Buildings */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 tracking-wide uppercase">
            Registered Building Properties
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-gold-400 text-xs uppercase tracking-widest font-serif border-b border-gold-400/20">
                  <th className="p-4">Building Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Subscription Status</th>
                  <th className="p-4 text-center">Action / Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tenants.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{t.buildingName}</td>
                    <td className="p-4 text-sm text-gray-600 font-mono">{t.slug}</td>
                    <td className="p-4 text-sm text-gray-600 capitalize">{t.plan || "—"}</td>
                    <td className="p-4 text-sm font-medium">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        t.subscriptionStatus === "Active" ? "bg-green-100 text-green-700" :
                        t.subscriptionStatus === "Trial" ? "bg-blue-100 text-blue-700" :
                        t.subscriptionStatus === "Suspended" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {t.subscriptionStatus}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2 justify-center items-center">
                      <select
                        value={t.subscriptionStatus}
                        onChange={(e) => setStatus(t._id, e.target.value)}
                        className="border border-gray-200 rounded p-2 text-xs focus:outline-none focus:border-gold-400 bg-slate-50"
                      >
                        <option value="Trial">Trial</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={async () => {
                          if (!window.confirm(`Are you sure you want to permanently delete building "${t.buildingName}"?`)) return;
                          try {
                            await api.delete(`/tenants/${t._id}`);
                            toast.success("Building deleted permanently");
                            loadTenants();
                          } catch (err) {
                            toast.error(err.message);
                          }
                        }}
                        className="border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 tracking-wide uppercase">
            Global Subscription Plans
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="border border-gray-200 hover:border-gold-400 rounded p-6 hover:shadow-lg transition-all duration-300 relative group">
              <h3 className="text-lg font-serif font-bold text-slate-950 group-hover:text-gold-600 transition-colors">Basic</h3>
              <p className="mt-2 text-2xl font-bold font-serif text-gold-500">PKR 500 <span className="text-xs font-sans text-gray-500 font-light">/ month</span></p>
              <div className="mt-4 text-xs text-gray-500 space-y-1 font-light">
                <p>• Up to 20 office listings</p>
                <p>• Basic indoor navigation paths</p>
                <p>• Standard community chat lobby</p>
              </div>
            </div>

            <div className="border border-gold-400/50 bg-gold-50/10 rounded p-6 shadow-md relative group">
              <div className="absolute top-0 right-4 bg-gold-400 text-slate-950 text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-b">Popular</div>
              <h3 className="text-lg font-serif font-bold text-slate-950">Professional</h3>
              <p className="mt-2 text-2xl font-bold font-serif text-gold-500">PKR 1,779 <span className="text-xs font-sans text-gray-500 font-light">/ month</span></p>
              <div className="mt-4 text-xs text-gray-500 space-y-1 font-light">
                <p>• Unlimited office directories</p>
                <p>• Advanced step schematic paths</p>
                <p>• Multi-room tenant messaging chat</p>
                <p>• Automated virtual bot replies</p>
              </div>
            </div>

            <div className="border border-gray-200 hover:border-gold-400 rounded p-6 hover:shadow-lg transition-all duration-300 relative group">
              <h3 className="text-lg font-serif font-bold text-slate-950 group-hover:text-gold-600 transition-colors">Enterprise</h3>
              <p className="mt-2 text-2xl font-bold font-serif text-gold-500">PKR 2,990 <span className="text-xs font-sans text-gray-500 font-light">/ month</span></p>
              <div className="mt-4 text-xs text-gray-500 space-y-1 font-light">
                <p>• Dedicated custom domain mappings</p>
                <p>• Priority 24/7 technical assistance</p>
                <p>• Custom AI knowledgebase integrations</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default SuperAdminDashboard;
