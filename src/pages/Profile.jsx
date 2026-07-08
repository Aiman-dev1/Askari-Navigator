import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Guest User",
    username: "ShadowWalker42",
    building: "Apex Tower",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-6">
          My Profile
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">

          <div>
            <label className="font-bold">Name</label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          <div>
            <label className="font-bold">Username</label>

            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          <div>
            <label className="font-bold">Building</label>

            <input
              type="text"
              name="building"
              value={profile.building}
              onChange={handleChange}
              className="w-full border p-3 rounded mt-2"
            />
          </div>

          <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg">
            Save Changes
          </button>

        </div>

      </div>
    </MainLayout>
  );
}

export default Profile;