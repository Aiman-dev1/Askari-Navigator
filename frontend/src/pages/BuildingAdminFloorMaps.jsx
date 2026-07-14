import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiLayers,
  FiMap,
  FiTrash2,
  FiRefreshCw,
  FiAlertTriangle,
  FiX
} from "react-icons/fi";
import MainLayout from "../components/layout/MainLayout";
import { api, API_URL } from "../lib/api";

/* ── Custom Delete Confirmation Modal ── */
function DeleteConfirmModal({ isOpen, onConfirm, onCancel, title, message, previewText }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-600" />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
          aria-label="Close"
        >
          <FiX size={15} />
        </button>

        <div className="p-7">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
            <FiAlertTriangle size={26} className="text-red-500" />
          </div>

          {/* Heading */}
          <h3 className="text-xl font-serif font-bold text-slate-900 text-center uppercase tracking-wide mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 text-center mb-4 leading-relaxed">
            {message}
          </p>

          {/* Optional detail block */}
          {previewText && (
            <div className="bg-slate-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Target</p>
              <p className="text-sm text-slate-700 font-semibold leading-snug">
                {previewText}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-2.5 rounded-lg border border-gray-200 text-slate-700 text-sm font-semibold uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold uppercase tracking-wider transition-all shadow cursor-pointer hover:shadow-md"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuildingAdminFloorMaps() {
  const [tenant, setTenant] = useState(null);
  const [mapFloor, setMapFloor] = useState("");
  const [mapFile, setMapFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Custom Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // "SINGLE" or "ALL"
    floorNumber: null,
    title: "",
    message: "",
    previewText: "",
  });

  useEffect(() => {
    api
      .get("/tenants/mine")
      .then((data) => setTenant(data.tenant))
      .catch((err) => toast.error(err.message));
  }, []);

  const uploadMap = async () => {
    if (mapFloor === "" || !mapFile) return toast.error("Pick a floor and a plan image");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("map", mapFile);
      const data = await api.upload(`/tenants/mine/floors/${mapFloor}/map`, formData);
      setTenant(data.tenant);
      setMapFile(null);
      setMapFloor("");
      toast.success(`Floor ${mapFloor} map uploaded`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceMap = async (floorNumber, file) => {
    if (!window.confirm(`Are you sure you want to replace the floor plan for Floor ${floorNumber}?`)) {
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("map", file);
      const data = await api.upload(`/tenants/mine/floors/${floorNumber}/map`, formData);
      setTenant(data.tenant);
      toast.success(`Floor ${floorNumber} map replaced`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ── Custom Modal Triggers ── */
  const triggerDeleteMap = (floorNumber, floorName) => {
    setConfirmModal({
      isOpen: true,
      type: "SINGLE",
      floorNumber,
      title: "Delete Floor Plan?",
      message: "Are you sure you want to delete this floor plan? This action cannot be undone.",
      previewText: floorName || `Floor ${floorNumber}`,
    });
  };

  const triggerDeleteAllMaps = () => {
    setConfirmModal({
      isOpen: true,
      type: "ALL",
      floorNumber: null,
      title: "Delete All Maps?",
      message: "Are you sure you want to delete ALL uploaded floor maps? This action cannot be undone.",
      previewText: "All Configured Floor Schematics",
    });
  };

  /* ── Modal Callback Handler ── */
  const handleDeleteConfirm = async () => {
    const { type, floorNumber } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, isOpen: false })); // Close modal immediately

    try {
      if (type === "SINGLE") {
        const data = await api.delete(`/tenants/mine/floors/${floorNumber}/map`);
        setTenant(data.tenant);
        toast.success(`Floor ${floorNumber} map deleted`);
      } else if (type === "ALL") {
        const data = await api.delete("/tenants/mine/floors/maps/all");
        setTenant(data.tenant);
        toast.success("All floor maps have been deleted successfully.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const floors = tenant?.floors || [];
  const uploaded = floors.filter((f) => f.mapUrl);

  return (
    <MainLayout>
      {/* Styled Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        previewText={confirmModal.previewText}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <div className="max-w-6xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* ── Page Header ── */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <Link
            to="/building-admin"
            className="inline-flex items-center gap-2 text-[14px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-500 transition-colors mb-4"
          >
            <FiArrowLeft /> Back
          </Link>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Floor Map Schematics
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Upload per-floor plans — shown to tenants on the Indoor Navigation page
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400" />
        </div>

        {/* ── Upload ── */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded-lg p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-600 shrink-0">
              <FiUploadCloud size={16} />
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide uppercase">
              Upload Schematic
            </h2>
          </div>

          {floors.length === 0 ? (
            <div className="p-8 bg-slate-50 rounded-lg border border-dashed border-gray-200 text-center">
              <FiLayers size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No floors configured for this building yet.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                    Floor Level
                  </label>
                  <select
                    value={mapFloor}
                    onChange={(e) => setMapFloor(e.target.value)}
                    className="border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
                  >
                    <option value="">Select floor...</option>
                    {floors.map((f) => (
                      <option key={f.floorNumber} value={f.floorNumber}>
                        {f.name || `Floor ${f.floorNumber}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                    Schematic File
                    <span className="ml-2 text-gray-400 normal-case tracking-normal font-normal">
                      (SVG, PNG, JPG, WebP)
                    </span>
                  </label>
                  <div className="border border-dashed border-gray-300 hover:border-gold-400 rounded-lg p-4 bg-slate-50/50 transition-colors">
                    <input
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
                      onChange={(e) => setMapFile(e.target.files[0] || null)}
                      className="file:border-0 file:bg-slate-900 file:text-gold-400 file:px-4 file:py-2 file:rounded-lg file:text-xs file:uppercase file:tracking-wider file:font-semibold file:cursor-pointer hover:file:bg-slate-800 file:mr-4 text-sm text-gray-600 w-full"
                    />
                    {mapFile && (
                      <p className="text-xs text-gold-600 mt-2 font-medium">
                        ✓ {mapFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={uploadMap}
                disabled={uploading}
                className="mt-6 bg-gold-400 hover:bg-gold-500 text-slate-950 px-7 py-3 rounded-lg font-bold uppercase tracking-wider text-xs transition-all shadow cursor-pointer hover:shadow-md disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Schematic"}
              </button>
            </>
          )}
        </div>

        {/* ── Uploaded plans ── */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded-lg p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-600 shrink-0">
                <FiMap size={16} />
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-900 tracking-wide uppercase">
                Uploaded Floor Plans
              </h2>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                {uploaded.length} of {floors.length} floors
              </span>

              {/* Delete All Button triggers the custom Modal */}
              {uploaded.length > 0 && (
                <button
                  onClick={triggerDeleteAllMaps}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-full border border-red-200 transition-all cursor-pointer animate-fade-in"
                >
                  <FiTrash2 size={12} />
                  Delete All
                </button>
              )}
            </div>
          </div>

          {uploaded.length === 0 ? (
            <div className="p-10 bg-slate-50 rounded-lg border border-dashed border-gray-200 text-center">
              <FiMap size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No floor plans uploaded yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {uploaded.map((f) => (
                <div
                  key={f.floorNumber}
                  className="border border-gray-200 rounded-lg p-4 bg-slate-50/50 hover:border-gold-400/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                        {f.name || `Floor ${f.floorNumber}`}
                      </p>
                      <div className="flex items-center gap-2">
                        {/* Hidden input for replacing */}
                        <input
                          type="file"
                          accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
                          style={{ display: "none" }}
                          id={`replace-input-${f.floorNumber}`}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleReplaceMap(f.floorNumber, file);
                            }
                          }}
                        />
                        <button
                          onClick={() => document.getElementById(`replace-input-${f.floorNumber}`).click()}
                          title="Replace map"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gold-600 hover:bg-gold-50/50 transition-all cursor-pointer"
                        >
                          <FiRefreshCw size={14} />
                        </button>
                        <button
                          onClick={() => triggerDeleteMap(f.floorNumber, f.name)}
                          title="Delete map"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-all cursor-pointer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <img
                      src={`${API_URL}${f.mapUrl}`}
                      alt={`Floor ${f.floorNumber} map`}
                      className="w-full h-40 object-contain bg-white rounded border border-gray-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default BuildingAdminFloorMaps;