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
      <div className="max-w-5xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* Page Header */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Indoor Navigation
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Locate offices and get step-by-step guidance inside Askari Corporate Tower
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400"></div>
        </div>

        <input
          type="text"
          placeholder="Enter company or department name... (e.g. Ernst & Young)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 p-4 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-white shadow-sm mb-8"
        />

        {/* Multiple matches → pick one */}
        {results.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-8">
            {results.map((r) => (
              <button
                key={r._id}
                onClick={() => setSelected(r)}
                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer ${
                  selected?._id === r._id
                    ? "bg-gold-400 text-slate-950"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-gold-400/50"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}

        {selected ? (
          <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>

            <h2 className="text-2xl font-serif font-bold text-gold-600 uppercase tracking-wide mb-6">
              {selected.name}
            </h2>

            <div className="grid grid-cols-2 gap-6 max-w-md mb-8">
              <div className="bg-slate-50 p-4 rounded border-l-2 border-gold-400">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-1">Floor Level</span>
                <strong className="text-slate-900 text-sm font-semibold">{selected.floor}</strong>
              </div>

              <div className="bg-slate-50 p-4 rounded border-l-2 border-gold-400">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-1">Room / Suite Code</span>
                <strong className="text-slate-900 text-sm font-semibold">{selected.room}</strong>
              </div>
            </div>

            {selected.directions?.length > 0 ? (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-4 tracking-wide uppercase">
                  Step-by-Step Directions
                </h3>

                <ol className="list-decimal pl-6 space-y-3">
                  {selected.directions.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600 font-light leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-gray-400 text-xs mt-6 uppercase tracking-wider font-semibold bg-slate-50 p-4 rounded border border-gray-100">
                No step-by-step directions available for this location yet.
              </p>
            )}

          </div>
        ) : (
          <p className="text-gray-500 text-sm font-light text-center py-12 bg-white border border-dashed border-gray-200 rounded">
            {search.trim() ? "No matching offices found." : "Search an office to see directions."}
          </p>
        )}

      </div>
    </MainLayout>
  );
}

export default Navigation;
