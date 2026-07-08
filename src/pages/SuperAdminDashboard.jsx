import MainLayout from "../components/layout/MainLayout";

function SuperAdminDashboard() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Super Admin Dashboard
        </h1>

        {/* Cards */}

        <div className="grid md:grid-cols-4 gap-5 mb-10">

          <div className="bg-blue-600 text-white p-6 rounded-xl">
            <h2 className="text-3xl font-bold">12</h2>
            <p>Total Buildings</p>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-xl">
            <h2 className="text-3xl font-bold">1,240</h2>
            <p>Total Users</p>
          </div>

          <div className="bg-orange-500 text-white p-6 rounded-xl">
            <h2 className="text-3xl font-bold">$980</h2>
            <p>Monthly Revenue</p>
          </div>

          <div className="bg-purple-600 text-white p-6 rounded-xl">
            <h2 className="text-3xl font-bold">9</h2>
            <p>Active Subscriptions</p>
          </div>

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
                <th>City</th>
                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              <tr className="text-center border-b">

                <td className="p-3">Apex Tower</td>
                <td>Lahore</td>
                <td className="text-green-600 font-bold">Active</td>

              </tr>

              <tr className="text-center border-b">

                <td className="p-3">Sky Tower</td>
                <td>Islamabad</td>
                <td className="text-green-600 font-bold">Active</td>

              </tr>

              <tr className="text-center">

                <td className="p-3">Business Hub</td>
                <td>Karachi</td>
                <td className="text-red-500 font-bold">Expired</td>

              </tr>

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