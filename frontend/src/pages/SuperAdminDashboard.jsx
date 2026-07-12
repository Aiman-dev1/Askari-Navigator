import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiAlertTriangle, FiX } from "react-icons/fi";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";

/* ── Delete Confirmation Modal ── */
function DeleteBuildingModal({ isOpen, building, onConfirm, onCancel }) {
  if (!isOpen || !building) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      {/* Card */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-600" />
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
          aria-label="Close"
        >
          <FiX size={15} />
        </button>
        <div className="p-7">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
            <FiAlertTriangle size={26} className="text-red-500" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900 text-center uppercase tracking-wide mb-2">
            Delete Building?
          </h3>
          <p className="text-sm text-gray-500 text-center mb-4 leading-relaxed">
            This will <span className="font-bold text-red-500">permanently</span> delete the building and{" "}
            <span className="font-semibold">all related data</span> — users, offices, FAQs, chat rooms, and messages.
          </p>
          <div className="bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Building</p>
            <p className="text-sm text-slate-700 font-bold">{building.buildingName}</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{building.slug}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-2.5 rounded-lg border border-gray-200 text-slate-700 text-sm font-semibold uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold uppercase tracking-wider transition-all shadow cursor-pointer hover:shadow-md flex items-center justify-center gap-2"
            >
              <FiTrash2 size={13} /> Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  Active: "text-green-600",
  Trial: "text-blue-600",
  Suspended: "text-orange-500",
  Cancelled: "text-red-500",
};

function SuperAdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ buildingName: "", slug: "" });
  const [deleteModal, setDeleteModal] = useState({ open: false, building: null });

  const loadTenants = useCallback(() => {
    api
      .get("/tenants")
      .then((data) => setTenants(data.tenants))
      .catch((err) => toast.error(err.message));
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

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

  // Step 1: open the confirm modal
  const handleDeleteClick = (building) => {
    setDeleteModal({ open: true, building });
  };

  // Step 2: confirmed — cascade delete
  const handleDeleteConfirm = async () => {
    const { building } = deleteModal;
    setDeleteModal({ open: false, building: null });
    try {
      const result = await api.delete(`/tenants/${building._id}`);
      const d = result.deleted;
      toast.success(
        `"${building.buildingName}" deleted — ${d.users} users, ${d.offices} offices, ${d.faqs} FAQs, ${d.chatRooms} chat rooms, ${d.messages} messages removed.`,
        { duration: 6000 }
      );
      loadTenants();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Step 3: cancelled
  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, building: null });
  };

  const activeCount = tenants.filter((t) => t.subscriptionStatus === "Active").length;

  return (
    <MainLayout>
      {/* Deletion confirmation modal */}
      <DeleteBuildingModal
        isOpen={deleteModal.open}
        building={deleteModal.building}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

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
                        onClick={() => handleDeleteClick(t)}
                        className="flex items-center gap-1.5 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <FiTrash2 size={11} /> Delete
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
