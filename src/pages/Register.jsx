import MainLayout from "../components/layout/MainLayout";

function Register() {
  return (
    <MainLayout>
      <div className="min-h-screen flex justify-center items-center bg-slate-100">

        <div className="bg-white shadow-lg p-8 rounded-xl w-96">

          <h2 className="text-3xl font-bold text-center mb-6">
            Register
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded mb-4"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded mb-4"
          />

          <button className="w-full bg-cyan-500 text-white p-3 rounded">
            Register
          </button>

        </div>

      </div>
    </MainLayout>
  );
}

export default Register;