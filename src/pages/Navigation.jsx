import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import navigationData from "../data/navigationData";

function Navigation() {
  const [search, setSearch] = useState("");

  const result = navigationData.find((item) =>
    item.office.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-6">
          Indoor Navigation
        </h1>

        <input
          type="text"
          placeholder="Search office..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-8"
        />

        {result ? (
          <div className="bg-white shadow-lg rounded-xl p-6">

            <h2 className="text-2xl font-bold text-cyan-600">
              {result.office}
            </h2>

            <p className="mt-3">
              <strong>Floor:</strong> {result.floor}
            </p>

            <p>
              <strong>Room:</strong> {result.room}
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">
              Directions
            </h3>

            <ol className="list-decimal ml-6 space-y-2">
              {result.directions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>

          </div>
        ) : (
          <p className="text-gray-500">
            Search an office to see directions.
          </p>
        )}

      </div>
    </MainLayout>
  );
}

export default Navigation;