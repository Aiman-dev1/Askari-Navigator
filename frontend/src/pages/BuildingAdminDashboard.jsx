import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiGrid,
  FiAlertTriangle,
  FiCreditCard,
} from "react-icons/fi";

import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";
import BillingFormModal from "../components/common/BillingFormModal";

/* ── Reusable section card wrapper ── */
function SectionCard({ accent = "gold", children, className = "" }) {
  const accentColor =
    accent === "red" ? "bg-red-500/40" : "bg-gold-400/40";
  return (
    <div
      className={`bg-white border border-gray-200/60 shadow-md rounded-lg p-8 mb-8 relative overflow-hidden ${className}`}
    >
      <div className={`absolute top-0 left-0 w-full h-[3px] ${accentColor}`} />
      {children}
    </div>
  );
}

/* ── Section heading ── */
function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {Icon && (
        <div className="w-9 h-9 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-600 shrink-0">
          <Icon size={16} />
        </div>
      )}
      <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide uppercase">
        {children}
      </h2>
    </div>
  );
}

function BuildingAdminDashboard() {
  const [offices, setOffices] = useState([]);
  const [reported, setReported] = useState([]);
  const [tenant, setTenant] = useState(null);

  const [office, setOffice] = useState({ name: "", floor: "", room: "" });

  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);

  const [billingModal, setBillingModal] = useState({ isOpen: false, planId: null, plan: null });

  useEffect(() => {
    api
      .get("/offices")
      .then((data) => setOffices(data.offices))
      .catch((err) => toast.error(err.message));

    api
      .get("/chat/reported")
      .then((data) => setReported(data.messages))
      .catch((err) => toast.error(err.message));

    api
      .get("/tenants/mine")
      .then((data) => setTenant(data.tenant))
      .catch(() => {});

    api
      .get("/billing/subscription")
      .then(setSubscription)
      .catch(() => {});

    api
      .get("/billing/plans")
      .then((data) => setPlans(data.plans))
      .catch(() => {});

    const billing = new URLSearchParams(window.location.search).get("billing");
    if (billing === "success") toast.success("Subscription activated — thank you!");
    if (billing === "cancelled") toast("Checkout cancelled", { icon: "ℹ️" });
  }, []);

  const subscribe = (planId) => {
    const selectedPlan = plans.find((p) => p.id === planId);
    setBillingModal({
      isOpen: true,
      planId,
      plan: selectedPlan,
    });
  };

  const handleBillingSubmit = async (billingData) => {
    try {
      const data = await api.post("/billing/checkout", { 
        planId: billingModal.planId,
        billingData 
      });
      
      // After successful checkout, refresh subscription status
      const subscription = await api.get("/billing/subscription");
      setSubscription(subscription);
      
      toast.success("🎉 Subscription activated successfully!");
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const openPortal = async () => {
    try {
      const data = await api.post("/billing/portal");
      window.open(data.url, "_blank");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) => {
    setOffice({ ...office, [e.target.name]: e.target.value });
  };

  const addOffice = async () => {
    if (!office.name || !office.floor || !office.room) return;
    try {
      const data = await api.post("/offices", office);
      setOffices([...offices, data.office]);
      setOffice({ name: "", floor: "", room: "" });
      toast.success("Office added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteOffice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this office?")) return;
    try {
      await api.delete(`/offices/${id}`);
      setOffices(offices.filter((item) => item._id !== id));
      toast.success("Office deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await api.delete(`/chat/messages/${id}`);
      setReported(reported.filter((m) => m._id !== id));
      toast.success("Message removed");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">

        {/* ── Page Header ── */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Building Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Manage offices, directory listings, floor maps, and moderation settings
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400" />
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Offices", value: offices.length, color: "text-gold-400", bar: "bg-gold-400" },
            { label: "Floors", value: tenant?.floors?.length || 0, color: "text-gold-400", bar: "bg-gold-400" },
            { label: "Subscription", value: subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : "—", color: "text-gold-400", bar: "bg-gold-400", small: true },
            { label: "Chat Reports", value: reported.length, color: "text-red-400", bar: "bg-red-500/70" },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-slate-900 border border-gold-400/20 text-white rounded-lg p-6 shadow-md relative overflow-hidden group hover:border-gold-400/40 transition-colors duration-300"
            >
              <div className={`absolute top-0 left-0 w-full h-[3px] ${card.bar}`} />
              <h2 className={`font-serif font-bold ${card.small ? "text-2xl mt-1" : "text-4xl"} ${card.color}`}>
                {card.value}
              </h2>
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Add Office Suite ── */}
        <SectionCard>
          <SectionTitle icon={FiGrid}>Add New Office Suite</SectionTitle>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "name", label: "Office Name", placeholder: "e.g. Ernst & Young Office" },
              { name: "floor", label: "Floor Level", placeholder: "e.g. 8th Floor" },
              { name: "room", label: "Room / Suite Code", placeholder: "e.g. Suite 803" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  placeholder={field.placeholder}
                  value={office[field.name]}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
                />
              </div>
            ))}
          </div>
          <button
            onClick={addOffice}
            className="mt-6 bg-gold-400 hover:bg-gold-500 text-slate-950 px-7 py-3 rounded-lg font-bold uppercase tracking-wider text-xs transition-all shadow cursor-pointer hover:shadow-md"
          >
            Add Office Listing
          </button>
        </SectionCard>

        {/* ── Office Directory Table ── */}
        <SectionCard>
          <SectionTitle icon={FiGrid}>Office Directory Management</SectionTitle>
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-gold-400 text-xs uppercase tracking-widest font-serif border-b border-gold-400/20">
                  <th className="p-4">Office Name</th>
                  <th className="p-4">Floor</th>
                  <th className="p-4">Suite / Room</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {offices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400 text-sm">
                      No office listings yet. Add one above.
                    </td>
                  </tr>
                ) : (
                  offices.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-semibold text-slate-900">{item.name}</td>
                      <td className="p-4 text-sm text-gray-600">{item.floor}</td>
                      <td className="p-4 text-sm text-gray-600">{item.room}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteOffice(item._id)}
                          className="border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ── Subscription & Billing ── */}
        <SectionCard>
          <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-600 shrink-0">
                <FiCreditCard size={16} />
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide uppercase">
                Subscription &amp; Billing
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-lg px-4 py-2">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Plan:</span>
              <span className="text-xs font-bold text-gold-600 capitalize">
                {subscription?.plan || "No plan"}
              </span>
              <span className="text-gray-300 mx-1">·</span>
              <span className={`text-xs font-bold capitalize ${
                subscription?.subscriptionStatus === "Active" ? "text-green-600" :
                subscription?.subscriptionStatus === "Trial" ? "text-blue-600" :
                "text-orange-500"
              }`}>
                {subscription?.subscriptionStatus || "..."}
              </span>
            </div>
          </div>

          {/* Warning removed */}

          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-6 flex flex-col relative overflow-hidden transition-all duration-300 ${
                  subscription?.plan === plan.id
                    ? "border-gold-400 bg-gold-400/5 shadow-md"
                    : "border-gray-200 hover:border-gold-400/40 hover:shadow-sm"
                }`}
              >
                {subscription?.plan === plan.id && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400" />
                )}
                <h3 className="text-lg font-serif font-bold text-slate-900 uppercase tracking-wide">
                  {plan.name}
                </h3>
                <p className="mt-2 text-3xl font-serif font-bold text-gold-600">
                  <span className="text-base align-top">{plan.currency || "PKR"}</span>{" "}
                  {plan.price.toLocaleString()}
                  <span className="text-xs font-sans font-normal text-gray-400"> / month</span>
                </p>
                <ul className="mt-4 text-xs text-gray-600 space-y-2 flex-1 font-light">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <span className="text-gold-500 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => subscribe(plan.id)}
                  disabled={subscription?.plan === plan.id}
                  className={`mt-6 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    subscription?.plan === plan.id
                      ? "bg-slate-900 text-gold-400 cursor-default"
                      : "bg-gold-400 hover:bg-gold-500 text-slate-950 shadow hover:shadow-md"
                  }`}
                >
                  {subscription?.plan === plan.id ? "Current Plan" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>

          {subscription?.plan && (
            <button
              onClick={openPortal}
              className="mt-6 text-xs uppercase tracking-wider text-gold-600 hover:text-gold-500 underline cursor-pointer transition-colors"
            >
              Manage billing / cancel subscription
            </button>
          )}
        </SectionCard>

        {/* ── Chat Moderation ── */}
        <SectionCard accent="red">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <FiAlertTriangle size={16} />
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide uppercase">
              Chat Moderation Queue
            </h2>
            {reported.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {reported.length}
              </span>
            )}
          </div>

          {reported.length === 0 ? (
            <div className="p-8 bg-slate-50 rounded-lg border border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                🎉 No flagged or reported tenant messages in queue.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-gold-400 text-xs uppercase tracking-widest font-serif border-b border-gold-400/20">
                    <th className="p-4">Sender</th>
                    <th className="p-4 w-1/2">Flagged Message</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reported.map((msg) => (
                    <tr key={msg._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-semibold text-slate-900">{msg.senderName}</td>
                      <td className="p-4 text-sm text-gray-600 italic">"{msg.message}"</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteMessage(msg._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:bg-red-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>



        {/* Billing Form Modal */}
        <BillingFormModal
          plan={billingModal.plan}
          isOpen={billingModal.isOpen}
          onClose={() => setBillingModal({ isOpen: false, planId: null, plan: null })}
          onSubmit={handleBillingSubmit}
        />

      </div>
    </MainLayout>
  );
}

export default BuildingAdminDashboard;
