import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiPhone,
  FiWifi,
  FiTruck,
  FiShield,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import MainLayout from "../components/layout/MainLayout";

/* ── Section card ── */
function InfoCard({ icon: Icon, title, accent = "gold", children }) {
  const accentBar = accent === "red" ? "bg-red-500/40" : "bg-gold-400/40";
  const iconBg    = accent === "red" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-gold-400/10 border-gold-400/20 text-gold-600";

  return (
    <div className="bg-white border border-gray-200/60 shadow-sm hover:shadow-md rounded-lg p-7 relative overflow-hidden transition-shadow duration-300">
      <div className={`absolute top-0 left-0 w-full h-[3px] ${accentBar}`} />
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={16} />
        </div>
        <h3 className="font-serif font-bold text-slate-900 text-lg uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ── Row item inside a card ── */
function InfoRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold shrink-0 pt-0.5">
        {label}
      </span>
      <span className={`text-sm text-right leading-snug ${highlight ? "font-semibold text-gold-700" : "text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}

/* ── Pill badge ── */
function Pill({ children, color = "green" }) {
  const classes = {
    green:  "bg-green-100 text-green-700 border-green-200",
    blue:   "bg-blue-100 text-blue-700 border-blue-200",
    gold:   "bg-gold-100 text-gold-700 border-gold-200",
    red:    "bg-red-100 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider border px-2.5 py-0.5 rounded-full ${classes[color]}`}>
      {children}
    </span>
  );
}

function InfoSheet() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-12 min-h-[75vh]">

        {/* ── Page Header ── */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <Link
            to="/building-admin"
            className="inline-flex items-center gap-2 text-[14px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-500 transition-colors mb-4"
          >
            Back to Dashboard
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
                Building Info Sheet
              </h1>
              <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
                Key building facts, contacts, and policies for tenants and visitors
              </p>
            </div>
            <Pill color="green">
              <FiCheckCircle size={11} />
              Live &amp; Published
            </Pill>
          </div>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400" />
        </div>

        {/* ── Overview Banner ── */}
        <div className="bg-slate-900 border border-gold-400/20 rounded-lg p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(204,163,83,1) 1px, transparent 1px), linear-gradient(90deg, rgba(204,163,83,1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Building Name", value: "Apex Tower" },
              { label: "Total Floors",  value: "36 Floors" },
              { label: "Location",      value: "Lahore, Pakistan" },
              { label: "Certification", value: "LEED Gold Certified" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">{item.label}</p>
                <p className="text-white font-serif font-bold text-lg">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Hours of Operation */}
          <InfoCard icon={FiClock} title="Hours of Operation">
            <InfoRow label="Main Lobby"          value="Monday – Friday: 7:00 AM – 10:00 PM" />
            <InfoRow label="Weekend Lobby"       value="Saturday: 8:00 AM – 8:00 PM" />
            <InfoRow label="Sunday"              value="Closed to general public" />
            <InfoRow label="24/7 Access"         value="Registered tenants with key cards" highlight />
            <InfoRow label="Reception Desk"      value="24 Hours · 7 Days a Week" highlight />
            <InfoRow label="Parking Gate"        value="Open 6:00 AM – 11:00 PM" />
          </InfoCard>

          {/* Emergency Contacts */}
          <InfoCard icon={FiPhone} title="Emergency Contacts" accent="red">
            <InfoRow label="Security Control Room" value="+92-42-111-275-274" highlight />
            <InfoRow label="Building Management"   value="+92-300-123-4567" />
            <InfoRow label="Fire Emergency"        value="1122" highlight />
            <InfoRow label="Police"                value="15" highlight />
            <InfoRow label="Ambulance / Rescue"    value="1122" />
            <InfoRow label="WAPDA (Power)"         value="118" />
          </InfoCard>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Amenities & Services */}
          <InfoCard icon={FiWifi} title="Amenities &amp; Services">
            <div className="flex flex-wrap gap-2">
              {[
                "High-Speed Fibre Internet",
                "Executive Boardroom",
                "Prayer Hall — Floor 2",
                "Cafeteria — Floor 3",
                "Rooftop Lounge",
                "ATM Machines (Lobby)",
                "Dry Cleaning Service",
                "Mail Room",
                "EV Charging Stations",
                "Business Lounge",
              ].map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1.5 bg-slate-50 border border-gray-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  <FiCheckCircle size={11} className="text-gold-500" />
                  {a}
                </span>
              ))}
            </div>
          </InfoCard>

          {/* Parking & Access */}
          <InfoCard icon={FiTruck} title="Parking &amp; Access">
            <InfoRow label="Basement Levels"    value="B1 – B3 (750 spaces)" />
            <InfoRow label="Tenant Reserved"    value="Floors B1 &amp; B2" highlight />
            <InfoRow label="Visitor Parking"    value="Floor B3 — first 2 hrs free" />
            <InfoRow label="Motorcycle Bays"    value="Ground floor east entrance" />
            <InfoRow label="Delivery Access"    value="Loading Bay — West Wing" />
            <InfoRow label="Key Card Required"  value="Yes — issued by management" highlight />
          </InfoCard>

        </div>

        {/* Building Rules */}
        <InfoCard icon={FiShield} title="Building Rules &amp; Policies">
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-1">
            {[
              "No smoking inside any floor or lobby area",
              "Visitor sign-in required at reception",
              "Pets not allowed inside the building",
              "Professional dress code observed in common areas",
              "No unsupervised contractors after working hours",
              "Noise levels must be kept minimal after 9:00 PM",
              "All deliveries must be cleared through the loading bay",
              "Lost key cards must be reported within 24 hours",
              "Emergency exits must remain clear at all times",
              "Tenants are responsible for their visitors' conduct",
            ].map((rule) => (
              <div key={rule} className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0">
                <FiCheckCircle size={13} className="text-gold-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 leading-snug">{rule}</span>
              </div>
            ))}
          </div>
        </InfoCard>

        {/* Info Notice */}
        <div className="mt-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <FiInfo size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            This info sheet is published for tenants and visitors and is powered by the AI Virtual Concierge. To update any information, please contact the building management team or use the FAQ manager to add specific entries.
          </p>
        </div>

        {/* Alert for Emergency */}
        <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <FiAlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700 leading-relaxed">
            <strong>Emergency Protocol:</strong> In case of fire or evacuation, use the nearest stairwell. Do not use elevators. Assembly point is the East Parking Plaza.
          </p>
        </div>

      </div>
    </MainLayout>
  );
}

export default InfoSheet;
