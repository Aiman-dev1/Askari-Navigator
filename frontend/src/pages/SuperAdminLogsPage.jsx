import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiActivity,
  FiRefreshCw,
  FiArrowLeft,
  FiFilter,
} from "react-icons/fi";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";
import { getSocket } from "../lib/socket";

/* ── Action metadata ── */
const ACTION_META = {
  FAQ_CREATED: { label: "FAQ Added", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  FAQ_UPDATED: { label: "FAQ Updated", color: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
  FAQ_DELETED: { label: "FAQ Deleted", color: "bg-red-100 text-red-600", dot: "bg-red-400" },
  OFFICE_CREATED: { label: "Office Added", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  OFFICE_UPDATED: { label: "Office Updated", color: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
  OFFICE_DELETED: { label: "Office Deleted", color: "bg-red-100 text-red-600", dot: "bg-red-400" },
  FLOOR_MAP_UPLOADED: { label: "Floor Map Uploaded", color: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
  FLOOR_MAP_DELETED: { label: "Floor Map Deleted", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  BUILDING_CREATED: { label: "Building Onboarded", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  BUILDING_STATUS_CHANGED: { label: "Status Changed", color: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  BUILDING_DELETED: { label: "Building Deleted", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const ALL_ACTIONS = Object.keys(ACTION_META);

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function LogRow({ log, index }) {
  const meta = ACTION_META[log.action] || { label: log.action, color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
  return (
    <div
      className="flex items-start gap-4 px-5 py-4 rounded-xl border border-gray-100 bg-white hover:border-gold-400/30 hover:shadow-sm transition-all duration-200"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div className={`w-2.5 h-2.5 rounded-full ${meta.dot} ring-2 ring-white ring-offset-1`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${meta.color}`}>
            {meta.label}
          </span>
          <span className="text-xs text-gray-400">{timeAgo(log.createdAt)}</span>
        </div>
        <p className="text-sm text-slate-800 leading-snug">{log.detail}</p>
        <p className="text-[11px] text-gray-400 mt-1 font-medium">{log.actorName}</p>
      </div>

      {/* Full timestamp on hover */}
      <span className="hidden md:block text-[10px] text-gray-300 shrink-0 pt-1 whitespace-nowrap">
        {new Date(log.createdAt).toLocaleString("en-US", {
          month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        })}
      </span>
    </div>
  );
}

function SuperAdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/logs?limit=100");
      setLogs(data.logs || []);
    } catch (err) {
      toast.error("Could not load logs: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();

    const socket = getSocket();
    socket.on("new_log", (newLog) => {
      // Check if log is a tenant_admin log (which super admins should see)
      if (newLog.actorRole === "tenant_admin") {
        setLogs((prev) => {
          // Avoid duplicate items if user manually refreshes
          if (prev.some(p => p._id === newLog._id)) return prev;
          return [newLog, ...prev];
        });
      }
    });

    return () => {
      socket.off("new_log");
    };
  }, [loadLogs]);

  const filtered = logs.filter((l) => {
    const matchAction = filter === "ALL" || l.action === filter;
    const matchSearch = !search || l.detail.toLowerCase().includes(search.toLowerCase()) || l.actorName.toLowerCase().includes(search.toLowerCase());
    return matchAction && matchSearch;
  });

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* Header */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <Link
            to="/super-admin"
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-500 transition-colors mb-4"
          >
            <FiArrowLeft /> Back
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
                Admin Activity Log
              </h1>
              <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
                Actions performed by building admins across all properties
              </p>
            </div>
            <button
              onClick={loadLogs}
              disabled={loading}
              className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-gold-600 border border-gold-400/30 hover:border-gold-400 px-4 py-2.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 mt-1"
            >
              <FiRefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400" />
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Actions", value: logs.length },
            { label: "FAQs Changed", value: logs.filter(l => l.action.startsWith("FAQ")).length },
            { label: "Offices Changed", value: logs.filter(l => l.action.startsWith("OFFICE")).length },
            { label: "Buildings", value: logs.filter(l => l.action.startsWith("BUILDING")).length },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-gold-400/20 rounded-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-400/50" />
              <p className="text-2xl font-serif font-bold text-gold-400">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200/60 shadow-sm rounded-xl p-5 mb-6 flex flex-wrap gap-3 items-center">
          <FiFilter size={13} className="text-gray-400 shrink-0" />

          {/* Search */}
          <input
            type="text"
            placeholder="Search actions or actors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 bg-slate-50/50 transition-all"
          />

          {/* Action filter pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter("ALL")}
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all cursor-pointer ${filter === "ALL" ? "bg-slate-900 text-gold-400 border-slate-900" : "border-gray-200 text-gray-500 hover:border-gold-400 hover:text-gold-500"}`}
            >
              All
            </button>
            {ALL_ACTIONS.map((action) => {
              const m = ACTION_META[action];
              return (
                <button
                  key={action}
                  onClick={() => setFilter(filter === action ? "ALL" : action)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all cursor-pointer ${filter === action ? m.color + " border-transparent" : "border-gray-200 text-gray-500 hover:border-gold-400/50"}`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Log feed */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40" />

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FiActivity size={15} className="text-gold-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <FiRefreshCw size={22} className="animate-spin text-gold-400 mr-3" />
              <span className="text-sm text-gray-400">Loading activity...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center">
              <FiActivity size={36} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 text-sm">No matching activity found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((log, i) => (
                <LogRow key={log._id} log={log} index={i} />
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default SuperAdminLogsPage;
