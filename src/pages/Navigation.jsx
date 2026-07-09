import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";

function Navigation() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  // Search the backend directory (debounced)
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setSelected(null);
      return;
    }

    const t = setTimeout(() => {
      api
        .get(`/navigation/search?query=${encodeURIComponent(search)}`)
        .then((data) => {
          setResults(data.results);
          setSelected(data.results[0] || null);
        })
        .catch((err) => toast.error(err.message));
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

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

        {/* Multiple matches → pick one */}
        {results.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {results.map((r) => (
              <button
                key={r._id}
                onClick={() => setSelected(r)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selected?._id === r._id
                    ? "bg-cyan-500 text-white"
                    : "bg-white shadow hover:bg-slate-50"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}

        {selected ? (
          <div className="bg-white shadow-lg rounded-xl p-6">

            <h2 className="text-2xl font-bold text-cyan-600">
              {selected.name}
            </h2>

            <p className="mt-3">
              <strong>Floor:</strong> {selected.floor}
            </p>

            <p>
              <strong>Room:</strong> {selected.room}
            </p>

            {selected.directions?.length > 0 ? (
              <>
                <h3 className="text-xl font-bold mt-6 mb-3">
                  Directions
                </h3>

                <ol className="list-decimal ml-6 space-y-2">
                  {selected.directions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="text-gray-500 mt-6">
                No step-by-step directions available for this location yet.
              </p>
            )}

          </div>
        ) : (
          <p className="text-gray-500">
            {search.trim() ? "No matching offices found." : "Search an office to see directions."}
          </p>
        )}

      </div>
    </MainLayout>
  );
}

export default Navigation;
