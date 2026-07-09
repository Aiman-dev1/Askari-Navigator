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
      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Super Admin Dashboard
        </h1>

        {/* Cards */}

        <div className="grid md:grid-cols-3 gap-5 mb-10">

          <div className="bg-blue-600 text-white p-6 rounded-xl">
            <h2 className="text-3xl font-bold">{tenants.length}</h2>
            <p>Total Buildings</p>
          </div>

          <div className="bg-purple-600 text-white p-6 rounded-xl">
            <h2 className="text-3xl font-bold">{activeCount}</h2>
            <p>Active Subscriptions</p>
          </div>

          <div className="bg-orange-500 text-white p-6 rounded-xl">
            <h2 className="text-3xl font-bold">
              {tenants.filter((t) => t.subscriptionStatus === "Trial").length}
            </h2>
            <p>Trials</p>
          </div>

        </div>

        {/* Onboard building */}

        <div className="bg-white shadow rounded-xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-5">
            Onboard New Building
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Building Name (e.g. Sky Tower)"
              value={form.buildingName}
              onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
              className="border p-3 rounded-lg"
            />

            <input
              placeholder="Slug (e.g. sky-tower)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="border p-3 rounded-lg"
            />

          </div>

          <button
            onClick={addTenant}
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Onboard Building
          </button>

        </div>

        {/* Buildings */}

        <div className="bg-white shadow rounded-xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-5">
            Buildings
          </h2>

          <table className="w-full">

            <thead className="bg-gray-200">

              <tr>

                <th className="p-3">Building</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {tenants.map((t) => (

                <tr key={t._id} className="text-center border-b">

                  <td className="p-3">{t.buildingName}</td>

                  <td>{t.slug}</td>

                  <td className={`font-bold ${STATUS_STYLES[t.subscriptionStatus] || ""}`}>
                    {t.subscriptionStatus}
                  </td>

                  <td>
                    <select
                      value={t.subscriptionStatus}
                      onChange={(e) => setStatus(t._id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option>Trial</option>
                      <option>Active</option>
                      <option>Suspended</option>
                      <option>Cancelled</option>
                    </select>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Subscription */}

        <div className="bg-white shadow rounded-xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-4">
            Subscription Plans
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <div className="border rounded-lg p-5">
              <h3 className="text-xl font-bold">Basic</h3>
              <p className="mt-2">$29 / month</p>
            </div>

            <div className="border rounded-lg p-5">
              <h3 className="text-xl font-bold">Professional</h3>
              <p className="mt-2">$79 / month</p>
            </div>

            <div className="border rounded-lg p-5">
              <h3 className="text-xl font-bold">Enterprise</h3>
              <p className="mt-2">$199 / month</p>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default SuperAdminDashboard;
