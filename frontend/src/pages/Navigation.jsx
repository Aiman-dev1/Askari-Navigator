import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import MainLayout from "../components/layout/MainLayout";
import { api, API_URL } from "../lib/api";
import { DEFAULT_TENANT_SLUG } from "../context/AuthContext";

function Navigation() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [floors, setFloors] = useState([]);
  const [floorFilter, setFloorFilter] = useState(null); // floorNumber or null = all
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Close the floor dropdown when clicking outside it
  useEffect(() => {
    if (!filterOpen) return;
    const onClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [filterOpen]);

  // Building floors (for SVG floor plans)
  useEffect(() => {
    api
      .get(`/tenants/slug/${DEFAULT_TENANT_SLUG}`)
      .then((data) => setFloors(data.tenant.floors || []))
      .catch(() => {});
  }, []);

  const floorMap =
    selected &&
    floors.find((f) => f.floorNumber === selected.floorNumber && f.mapUrl);

  // Search the backend directory (debounced). A floor filter alone (no text)
  // lists everything on that floor; combined, both narrow the results.
  const runSearch = useCallback((forceLog = false) => {
    if (!search.trim() && floorFilter === null) {
      setResults([]);
      setSelected(null);
      return;
    }

    const params = new URLSearchParams();
    if (search.trim()) params.set("query", search.trim());
    if (floorFilter !== null) params.set("floor", floorFilter);
    if (forceLog) params.set("log", "true");

    api
      .get(`/navigation/search?${params.toString()}`)
      .then((data) => {
        setResults(data.results);
        setSelected(data.results[0] || null);
      })
      .catch((err) => toast.error(err.message));
  }, [search, floorFilter]);

  // Debounced search on typing or changing floor (without logging)
  useEffect(() => {
    const t = setTimeout(() => {
      runSearch(false);
    }, 300);

    return () => clearTimeout(t);
  }, [search, floorFilter, runSearch]);

  const floorLabel = (n) =>
    floors.find((f) => f.floorNumber === n)?.name || `Floor ${n}`;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[75vh]">

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

        <div className="flex flex-col sm:flex-row gap-3 mb-4">

          <input
            type="text"
            placeholder="Enter company or department name... (e.g. Ernst & Young)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                runSearch(true);
              }
            }}
            className="flex-1 border border-gray-200 p-4 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-white shadow-sm"
          />

          {/* Floor filter */}
          <div className="relative" ref={filterRef}>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              aria-label="Filter by floor"
              aria-expanded={filterOpen}
              className={`px-5 py-3 sm:h-full rounded border flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer ${
                floorFilter !== null
                  ? "bg-slate-900 border-gold-400 text-gold-400"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gold-400/50 hover:text-slate-900"
              }`}
            >
              <FiFilter size={15} />
              <span className="hidden sm:inline">
                {floorFilter !== null ? floorLabel(floorFilter) : "Floor"}
              </span>
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 max-h-80 overflow-y-auto bg-white border border-gray-200/80 rounded shadow-2xl z-20">

                <button
                  onClick={() => {
                    setFloorFilter(null);
                    setFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b border-gray-100 ${
                    floorFilter === null
                      ? "bg-slate-900 text-gold-400"
                      : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  All Floors
                </button>

                {floors.map((f) => (
                  <button
                    key={f.floorNumber}
                    onClick={() => {
                      setFloorFilter(f.floorNumber);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      floorFilter === f.floorNumber
                        ? "bg-slate-900 text-gold-400"
                        : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {f.name || `Floor ${f.floorNumber}`}
                  </button>
                ))}

              </div>
            )}

          </div>

        </div>

        {/* Active filter chip */}
        <div className="mb-8">
          {floorFilter !== null && (
            <button
              onClick={() => setFloorFilter(null)}
              className="inline-flex items-center gap-2 bg-slate-900 text-gold-400 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-colors"
            >
              {floorLabel(floorFilter)}
              <FiX size={12} />
            </button>
          )}
        </div>

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
          <div className="bg-white border border-gray-200/60 shadow-md rounded p-5 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>

            <h2 className="text-2xl font-serif font-bold text-gold-600 uppercase tracking-wide mb-6">
              {selected.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-md mb-8">
              <div className="bg-slate-50 p-4 rounded border-l-2 border-gold-400">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-1">Floor Level</span>
                <strong className="text-slate-900 text-sm font-semibold">{selected.floor}</strong>
              </div>

              <div className="bg-slate-50 p-4 rounded border-l-2 border-gold-400">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-1">Room / Suite Code</span>
                <strong className="text-slate-900 text-sm font-semibold">{selected.room}</strong>
              </div>
            </div>

            {floorMap && (
              <div className="border-t border-gray-100 pt-6 mb-8">
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-4 tracking-wide uppercase">
                  Floor Plan
                </h3>

                <img
                  src={`${API_URL}${floorMap.mapUrl}`}
                  alt={`${selected.floor} plan`}
                  className="w-full max-h-96 object-contain bg-slate-50 rounded border border-gray-100"
                />
              </div>
            )}

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
            {search.trim() || floorFilter !== null
              ? floorFilter !== null && !search.trim()
                ? `No offices listed on ${floorLabel(floorFilter)} yet.`
                : "No matching offices found."
              : "Search an office or pick a floor to see directions."}
          </p>
        )}

      </div>
    </MainLayout>
  );
}

export default Navigation;
