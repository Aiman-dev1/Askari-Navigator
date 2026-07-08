import MainLayout from "../components/layout/MainLayout";

function Profile() {
  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-6">
          My Profile
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-6">

          <p><b>Name:</b> Guest User</p>

          <p className="mt-3"><b>Username:</b> ShadowWalker42</p>

          <p className="mt-3"><b>Building:</b> Apex Tower</p>

        </div>

      </div>
    </MainLayout>
  );
}

export default Profile;