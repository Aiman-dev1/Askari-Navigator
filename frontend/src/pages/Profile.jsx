import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiHome, FiShield, FiCalendar, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { updateUsername, DEFAULT_TENANT_SLUG } from "../store/slices/authSlice";

const ROLE_LABELS = {
  super_admin: "Super Admin",
  tenant_admin: "Building Admin",
  user: "Member",
};

function DetailTile({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 p-5 rounded border-l-2 border-gold-400 flex items-start gap-4">
      <div className="w-9 h-9 rounded-full bg-slate-900 text-gold-400 flex items-center justify-center shrink-0">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
          {label}
        </span>
        <strong className="text-slate-900 text-sm font-semibold break-words">{value}</strong>
      </div>
    </div>
  );
}

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [building, setBuilding] = useState("");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setName(user?.username || "");
    setEditing(true);
  };

  const saveName = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === user?.username) return setEditing(false);
    setSaving(true);
    try {
      await dispatch(updateUsername(trimmed)).unwrap();
      toast.success("Name updated");
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    api
      .get(`/tenants/slug/${DEFAULT_TENANT_SLUG}`)
      .then((data) => setBuilding(data.tenant.buildingName))
      .catch(() => setBuilding(""));
  }, []);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* Page Header */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            My Profile
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Your verified identity within Askari Corporate Tower
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400"></div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-md rounded overflow-hidden">

          {/* Identity banner */}
          <div className="bg-slate-900 px-8 py-10 relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>

            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">

              {/* Monogram avatar */}
              <div className="w-24 h-24 rounded-full bg-gold-400 text-slate-950 flex items-center justify-center text-4xl font-serif font-bold shadow-xl border-4 border-slate-800 uppercase">
                {user?.username?.charAt(0) || "?"}
              </div>

              <div className="text-center sm:text-left flex-1">
                {editing ? (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveName();
                        if (e.key === "Escape") setEditing(false);
                      }}
                      autoFocus
                      maxLength={30}
                      className="bg-slate-800 border border-gold-400/40 rounded px-3 py-2 text-xl font-serif font-bold text-white focus:outline-none focus:border-gold-400 w-56"
                    />
                    <button
                      onClick={saveName}
                      disabled={saving}
                      aria-label="Save name"
                      className="w-9 h-9 rounded-full bg-gold-400 text-slate-950 flex items-center justify-center hover:bg-gold-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <FiCheck size={16} />
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      aria-label="Cancel"
                      className="w-9 h-9 rounded-full border border-gray-500 text-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                      {user?.username}
                    </h2>
                    <button
                      onClick={startEditing}
                      aria-label="Edit name"
                      className="w-8 h-8 rounded-full border border-gold-400/30 text-gold-400/70 flex items-center justify-center hover:text-gold-400 hover:border-gold-400 transition-colors cursor-pointer"
                    >
                      <FiEdit2 size={13} />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <span className="bg-gold-400 text-slate-950 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    {ROLE_LABELS[user?.role] || "Member"}
                  </span>

                  {user?.isGuest && (
                    <span className="border border-gold-400/40 text-gold-400 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                      Temporary Visitor
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Tenant ID
                <span className="block text-gold-400/80 font-mono normal-case tracking-normal mt-1">
                  {user?.id?.slice(-8).toUpperCase() || "—"}
                </span>
              </p>

            </div>
          </div>

          {/* Details */}
          <div className="p-8 grid sm:grid-cols-2 gap-5">

            <DetailTile
              icon={FiMail}
              label="Email Address"
              value={user?.email || "Guest account — no verified email"}
            />

            <DetailTile
              icon={FiHome}
              label="Assigned Property"
              value={building || "Askari Corporate Tower"}
            />

            <DetailTile
              icon={FiShield}
              label="Account Class"
              value={ROLE_LABELS[user?.role] || "Member"}
            />

            <DetailTile icon={FiCalendar} label="Member Since" value={memberSince} />

          </div>

          {user?.isGuest && (
            <div className="mx-8 mb-8 bg-slate-50 border border-gray-100 rounded p-4 text-xs text-gray-500 font-light">
              <span className="text-gold-600 font-bold uppercase tracking-wider text-[10px]">
                Guest access
              </span>{" "}
              — your username is temporary. Create an account from the register page to keep
              your identity across visits.
            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}

export default Profile;
