import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import Tenant from "./models/Tenant.js";
import User from "./models/User.js";
import Office from "./models/Office.js";
import ChatRoom from "./models/ChatRoom.js";
import Message from "./models/Message.js";
import Faq from "./models/Faq.js";
import ActivityLog from "./models/ActivityLog.js";
import { installFloorPlans } from "./utils/floorplans.js";

const OFFICES = [
  // Ground Floor
  // Ground Floor
  { name: "Gymnasium", floor: "Ground Floor", floorNumber: 0, room: "G-02", description: "Fitness Center for Tenants & Staff", category: "utility", directions: ["Enter through the main entrance.", "Turn right past the reception desk.", "The gymnasium is at the end of the corridor, Room G-02."] },
  { name: "Main Reception", floor: "Ground Floor", floorNumber: 0, room: "G-01", description: "Visitor Registration & Help Desk", category: "utility", directions: ["Enter through the main entrance.", "The reception desk is directly ahead."] },
  { name: "Prayer Area", floor: "Ground Floor", floorNumber: 0, room: "G-03", description: "Dedicated Prayer Room for all tenants", category: "utility", directions: ["Enter through the main entrance.", "Turn left past the reception.", "The prayer area is at the end of the hall."] },

  // 1st Floor — all 4 rented
  { name: "Engro Corporation", floor: "1st Floor", floorNumber: 1, room: "101", description: "Fertilizers & Energy — 9,330 Sft", category: "office", directions: ["Enter the building and take the elevator to Floor 1.", "Exit and turn right.", "Engro Corporation is in Suite 101."] },
  { name: "Habib Bank Limited (HBL)", floor: "1st Floor", floorNumber: 1, room: "102", description: "Banking & Financial Services — 5,214 Sft", category: "office", directions: ["Take the elevator to Floor 1.", "Turn left from the elevator lobby.", "HBL is in Suite 102."] },
  { name: "Mobilink / Jazz Corporate", floor: "1st Floor", floorNumber: 1, room: "103", description: "Telecom Regional Office — 5,199 Sft", category: "office", directions: ["Take the elevator to Floor 1.", "Proceed straight from the elevator lobby.", "Jazz Corporate is in Suite 103."] },
  { name: "Netsol Technologies", floor: "1st Floor", floorNumber: 1, room: "104", description: "IT & Software Solutions — 8,917 Sft", category: "office", directions: ["Take the elevator to Floor 1.", "Turn right and walk to the far end of the corridor.", "Netsol Technologies is in Suite 104."] },

  // 2nd Floor — both available
  { name: "Suite 201 (Available)", floor: "2nd Floor", floorNumber: 2, room: "201", description: "Open-plan executive office — 11,239 Sft. Contact reception to arrange a viewing.", category: "office", directions: ["Take the elevator to Floor 2.", "Turn left — Suite 201 is directly in front."] },
  { name: "Suite 202 (Available)", floor: "2nd Floor", floorNumber: 2, room: "202", description: "Premium corner office with terrace — 12,011 Sft. Contact reception to arrange a viewing.", category: "office", directions: ["Take the elevator to Floor 2.", "Turn right from the elevator lobby — Suite 202 is at the end."] },

  // 3rd Floor — both rented
  { name: "KPMG Pakistan", floor: "3rd Floor", floorNumber: 3, room: "301", description: "Audit & Advisory Services — 11,242 Sft", category: "office", directions: ["Take the elevator to Floor 3.", "Turn left from the elevator lobby.", "KPMG Pakistan is in Suite 301."] },
  { name: "Telenor Pakistan", floor: "3rd Floor", floorNumber: 3, room: "302", description: "Telecom Corporate Office — 12,006 Sft", category: "office", directions: ["Take the elevator to Floor 3.", "Turn right from the elevator lobby.", "Telenor Pakistan is in Suite 302."] },

  // 4th Floor — all 4 rented
  { name: "MCB Bank Ltd", floor: "4th Floor", floorNumber: 4, room: "401", description: "Commercial Banking — 7,340 Sft", category: "office", directions: ["Take the elevator to Floor 4.", "Turn left from the elevator lobby.", "MCB Bank is in Suite 401."] },
  { name: "PricewaterhouseCoopers (PwC)", floor: "4th Floor", floorNumber: 4, room: "402", description: "Consulting & Assurance — 5,237 Sft", category: "office", directions: ["Take the elevator to Floor 4.", "Proceed straight from the elevator.", "PwC is in Suite 402."] },
  { name: "Sapphire Textile Mills", floor: "4th Floor", floorNumber: 4, room: "403", description: "Corporate Headquarters — 5,230 Sft", category: "office", directions: ["Take the elevator to Floor 4.", "Turn right past the lobby.", "Sapphire is in Suite 403."] },
  { name: "Pakistan Petroleum Limited (PPL)", floor: "4th Floor", floorNumber: 4, room: "404", description: "Oil & Gas Corporate Office — 8,541 Sft", category: "office", directions: ["Take the elevator to Floor 4.", "Walk to the far right end of the floor.", "PPL is in Suite 404."] },

  // 5th Floor
  { name: "Ernst & Young (EY)", floor: "5th Floor", floorNumber: 5, room: "501", description: "Audit, Tax & Consulting — 8,730 Sft", category: "office", directions: ["Take the elevator to Floor 5.", "Turn right from the elevator.", "EY is in Suite 501."] },
  { name: "Marketing Suite (Available)", floor: "5th Floor", floorNumber: 5, room: "502", description: "Renovated marketing office — 8,662 Sft. Available for rent.", category: "department", directions: ["Take the elevator to Floor 5.", "Turn left from the elevator.", "The marketing suite is in Room 502."] },
  { name: "Cafeteria", floor: "5th Floor", floorNumber: 5, room: "503", description: "Building Food Court — open 8 AM to 9 PM", category: "utility", directions: ["Take the elevator to Floor 5.", "The cafeteria is straight ahead as you exit the elevator."] },

  // 6th Floor — offices 1,3,4,5 rented; 2,6 available
  { name: "Systems Limited", floor: "6th Floor", floorNumber: 6, room: "601", description: "IT Services & BPO — 5,631 Sft", category: "office", directions: ["Take the elevator to Floor 6.", "Turn right — Suite 601 is the first door."] },
  { name: "Suite 602 (Available)", floor: "6th Floor", floorNumber: 6, room: "602", description: "Mid-size office space — 4,490 Sft. Contact reception.", category: "office", directions: ["Take the elevator to Floor 6.", "Turn right, Suite 602 is the second door."] },
  { name: "Nishat Group", floor: "6th Floor", floorNumber: 6, room: "603", description: "Textile & Banking — 4,477 Sft", category: "office", directions: ["Take the elevator to Floor 6.", "Proceed left from the elevator lobby.", "Nishat Group is in Suite 603."] },
  { name: "Interloop Limited", floor: "6th Floor", floorNumber: 6, room: "604", description: "Hosiery & Textile Corporate — 3,995 Sft", category: "office", directions: ["Take the elevator to Floor 6.", "Turn left and walk past Suite 603.", "Interloop is in Suite 604."] },
  { name: "Fauji Fertilizer Company", floor: "6th Floor", floorNumber: 6, room: "605", description: "Agricultural Products — 3,128 Sft", category: "office", directions: ["Take the elevator to Floor 6.", "Turn left and proceed to the end of the corridor.", "FFC is in Suite 605."] },
  { name: "Suite 606 (Available)", floor: "6th Floor", floorNumber: 6, room: "606", description: "Corner office — 3,268 Sft. Contact reception.", category: "office", directions: ["Take the elevator to Floor 6.", "Turn right and go to the far end.", "Suite 606 is the last door."] },

  // 7th Floor — offices 1,2,4,5,6 rented; 3 available
  { name: "Deloitte Pakistan", floor: "7th Floor", floorNumber: 7, room: "701", description: "Audit & Consulting — 5,631 Sft", category: "office", directions: ["Take the elevator to Floor 7.", "Turn right — Suite 701 is first on the right."] },
  { name: "United Bank Limited (UBL)", floor: "7th Floor", floorNumber: 7, room: "702", description: "Corporate Banking — 4,362 Sft", category: "office", directions: ["Take the elevator to Floor 7.", "Turn right, Suite 702 is the second door."] },
  { name: "Suite 703 (Available)", floor: "7th Floor", floorNumber: 7, room: "703", description: "Office space — 4,477 Sft. Contact reception.", category: "office", directions: ["Take the elevator to Floor 7.", "Turn left — Suite 703 is directly ahead."] },
  { name: "Lucky Cement", floor: "7th Floor", floorNumber: 7, room: "704", description: "Construction Materials Corporate — 3,995 Sft", category: "office", directions: ["Take the elevator to Floor 7.", "Turn left and proceed past Suite 703.", "Lucky Cement is in Suite 704."] },
  { name: "TRG Pakistan", floor: "7th Floor", floorNumber: 7, room: "705", description: "BPO & Technology — 3,128 Sft", category: "office", directions: ["Take the elevator to Floor 7.", "Walk to the end of the left corridor.", "TRG is in Suite 705."] },
  { name: "Atlas Honda", floor: "7th Floor", floorNumber: 7, room: "706", description: "Automobile Corporate Office — 3,268 Sft", category: "office", directions: ["Take the elevator to Floor 7.", "Turn right and go to the far end.", "Atlas Honda is in Suite 706."] },

  // 8th Floor — all 6 rented
  { name: "Packages Limited", floor: "8th Floor", floorNumber: 8, room: "801", description: "Packaging & Consumer Products — 5,460 Sft", category: "office", directions: ["Take the elevator to Floor 8.", "Turn right — Suite 801 is the first suite."] },
  { name: "Meezan Bank", floor: "8th Floor", floorNumber: 8, room: "802", description: "Islamic Banking — 4,490 Sft", category: "office", directions: ["Take the elevator to Floor 8.", "Turn right, Suite 802 is the second door."] },
  { name: "Unilever Pakistan", floor: "8th Floor", floorNumber: 8, room: "803", description: "FMCG Regional Office — 4,477 Sft", category: "office", directions: ["Take the elevator to Floor 8.", "Turn left from the lobby.", "Unilever is in Suite 803."] },
  { name: "Nestlé Pakistan", floor: "8th Floor", floorNumber: 8, room: "804", description: "Food & Beverages Corporate — 3,941 Sft", category: "office", directions: ["Take the elevator to Floor 8.", "Turn left past Suite 803.", "Nestlé is in Suite 804."] },
  { name: "Siemens Pakistan", floor: "8th Floor", floorNumber: 8, room: "805", description: "Engineering & Technology — 3,128 Sft", category: "office", directions: ["Take the elevator to Floor 8.", "Walk to the far left end.", "Siemens is in Suite 805."] },
  { name: "Procter & Gamble (P&G)", floor: "8th Floor", floorNumber: 8, room: "806", description: "Consumer Goods Corporate — 3,254 Sft", category: "office", directions: ["Take the elevator to Floor 8.", "Turn right and walk to the far end.", "P&G is in Suite 806."] },

  // 9th Floor — all 4 rented
  { name: "Bank Alfalah", floor: "9th Floor", floorNumber: 9, room: "901", description: "Commercial Banking — 7,341 Sft", category: "office", directions: ["Take the elevator to Floor 9.", "Turn right — Bank Alfalah is in Suite 901."] },
  { name: "Ferozsons Laboratories", floor: "9th Floor", floorNumber: 9, room: "902", description: "Pharmaceutical Corporate — 5,232 Sft", category: "office", directions: ["Take the elevator to Floor 9.", "Turn right, Suite 902 is the second door."] },
  { name: "IGI Group", floor: "9th Floor", floorNumber: 9, room: "903", description: "Insurance & Investment — 5,231 Sft", category: "office", directions: ["Take the elevator to Floor 9.", "Turn left from the lobby.", "IGI Group is in Suite 903."] },
  { name: "Dawood Hercules Corporation", floor: "9th Floor", floorNumber: 9, room: "904", description: "Petrochemicals & Fertilizers — 8,540 Sft", category: "office", directions: ["Take the elevator to Floor 9.", "Turn left and walk to the far end.", "Dawood Hercules is in Suite 904."] },

  // 10th Floor — all 4 rented
  { name: "ABL Asset Management", floor: "10th Floor", floorNumber: 10, room: "1001", description: "Asset & Fund Management — 7,341 Sft", category: "office", directions: ["Take the elevator to Floor 10.", "Turn right — ABL Asset Management is in Suite 1001."] },
  { name: "PharmEvo Pvt Ltd", floor: "10th Floor", floorNumber: 10, room: "1002", description: "Pharmaceuticals — 5,232 Sft", category: "office", directions: ["Take the elevator to Floor 10.", "Turn right, Suite 1002 is second on the right."] },
  { name: "National Foods Limited", floor: "10th Floor", floorNumber: 10, room: "1003", description: "Food & Spices Corporate — 5,231 Sft", category: "office", directions: ["Take the elevator to Floor 10.", "Turn left from the lobby.", "National Foods is in Suite 1003."] },
  { name: "Indus Motor Company", floor: "10th Floor", floorNumber: 10, room: "1004", description: "Toyota Distributor Corporate — 8,562 Sft", category: "office", directions: ["Take the elevator to Floor 10.", "Turn left and walk to the end.", "Indus Motor is in Suite 1004."] },

  // 11th Floor — all 4 rented
  { name: "K-Electric", floor: "11th Floor", floorNumber: 11, room: "1101", description: "Power Utility Corporate — 7,341 Sft", category: "office", directions: ["Take the elevator to Floor 11.", "Turn right — K-Electric is in Suite 1101."] },
  { name: "Pakistan State Oil (PSO)", floor: "11th Floor", floorNumber: 11, room: "1102", description: "Petroleum Distribution — 5,039 Sft", category: "office", directions: ["Take the elevator to Floor 11.", "Turn right, Suite 1102 is second on the right."] },
  { name: "Gul Ahmed Textile", floor: "11th Floor", floorNumber: 11, room: "1103", description: "Textile Manufacturing Corporate — 5,039 Sft", category: "office", directions: ["Take the elevator to Floor 11.", "Turn left from the lobby.", "Gul Ahmed is in Suite 1103."] },
  { name: "Shell Pakistan", floor: "11th Floor", floorNumber: 11, room: "1104", description: "Energy & Lubricants — 8,563 Sft", category: "office", directions: ["Take the elevator to Floor 11.", "Turn left and walk to the far end.", "Shell Pakistan is in Suite 1104."] },

  // 12th Floor — entire floor is one tenant
  { name: "PTCL Group", floor: "12th Floor", floorNumber: 12, room: "1201", description: "Pakistan Telecom Authority — Full floor, 22,252 Sft", category: "office", directions: ["Take the elevator to Floor 12.", "The entire floor is PTCL Group's headquarters."] },

  // 13th Floor — 2 offices rented
  { name: "Arif Habib Corporation", floor: "13th Floor", floorNumber: 13, room: "1301", description: "Financial Services & Brokerage — 6,666 Sft", category: "office", directions: ["Take the elevator to Floor 13.", "Turn right — Arif Habib is in Suite 1301."] },
  { name: "Hub Power Company (HUBCO)", floor: "13th Floor", floorNumber: 13, room: "1302", description: "Power Generation Corporate — 8,129 Sft", category: "office", directions: ["Take the elevator to Floor 13.", "Turn left — HUBCO is in Suite 1302."] },
];

// Building FAQs based on Askari Corporate Tower (askaricorporatetower.com).
// "Where is <office>?" questions don't need FAQs — the assistant falls back
// to the office directory for those.
const FAQS = [
  {
    question: "Where is the tower located?",
    answer:
      "Askari Corporate Tower is at Liberty Roundabout, Main Boulevard, Gulberg III, Lahore.",
  },
  {
    question: "Is car parking available?",
    answer:
      "Yes — the tower has 4 dedicated basement levels of reserved car parking. Your access card shows your assigned level.",
  },
  {
    question: "How many floors does the building have?",
    answer:
      "14 floors in total (Ground plus 13 upper floors), with 4 basement parking levels below.",
  },
  {
    question: "What are the building timings?",
    answer:
      "The tower is open Monday to Saturday, 8:00 AM to 10:00 PM. Reception and security are staffed 24/7.",
  },
  {
    question: "Is there a prayer area in the building?",
    answer: "Yes, a dedicated prayer area is available on the premises.",
  },
  {
    question: "Is there a gym in the tower?",
    answer: "Yes — the tower has a gymnasium available for tenants and their staff.",
  },
  {
    question: "How many elevators are there?",
    answer:
      "There are 6 AI-based elevators in the central core. Tap your access card and select your floor.",
  },
  {
    question: "What happens during a power outage?",
    answer:
      "Nothing — the tower runs on 5.1 MW backup generators plus a solar energy system, so offices stay powered at all times.",
  },
  {
    question: "Is there internet connectivity in the building?",
    answer:
      "Yes, all offices connect through the tower's FTTO fiber-optic broadband network.",
  },
  {
    question: "How does building security work?",
    answer:
      "The tower uses a smart multi-tier security system with access-controlled speed gates at the entrance. Visitors must register at the Ground Floor reception to receive a pass.",
  },
  {
    question: "How can I rent or buy an office in the tower?",
    answer:
      "Contact the marketing office at (+92) 333 5374535 or visit the Ground Floor reception — executive and furnished offices are available on several floors.",
  },
  {
    question: "Is the building environmentally friendly?",
    answer:
      "Yes — Askari Corporate Tower is LEED Gold certified by the US Green Building Council, with solar power and energy-efficient systems.",
  },
];

async function seed() {
  await connectDB();

  // Preserve the tenant ObjectId so existing registered users keep their tenantId valid
  let tenant = await Tenant.findOne({ slug: "apex-tower" });
  const tenantId = tenant ? tenant._id : new mongoose.Types.ObjectId();

  // Wipe everything EXCEPT real user accounts (non-seed users)
  const knownSeedEmails = ["super@towernav.com", "admin@apextower.com", "ali@apex.com", "sara@apex.com"];
  const knownSeedUsernames = ["superadmin", "apex-admin", "Ali", "Sara"];
  await Promise.all([
    Office.deleteMany({ tenantId }),
    ChatRoom.deleteMany({ tenantId }),
    Message.deleteMany({ tenantId }),
    Faq.deleteMany({ tenantId }),
    ActivityLog.deleteMany({ tenantId }),
    // Remove only known seed accounts; preserve real registered users
    User.deleteMany({
      $or: [
        { email: { $in: knownSeedEmails } },
        { tenantId, username: { $in: knownSeedUsernames } },
      ],
    }),
  ]);

  // Super admin (platform level, no tenant)
  const superAdmin = new User({
    username: "superadmin",
    email: "super@towernav.com",
    role: "super_admin",
  });
  await superAdmin.setPassword("super123");
  await superAdmin.save();

  // Upsert the demo building — preserves its _id so existing users stay linked
  tenant = await Tenant.findOneAndUpdate(
    { slug: "apex-tower" },
    {
      $set: {
        buildingName: "Apex Tower",
        subscriptionStatus: "Active",
        floors: installFloorPlans(),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const tenantAdmin = new User({
    tenantId: tenant._id,
    username: "apex-admin",
    email: "admin@apextower.com",
    role: "tenant_admin",
  });
  await tenantAdmin.setPassword("admin123");
  await tenantAdmin.save();

  await Office.insertMany(OFFICES.map((o) => ({ ...o, tenantId: tenant._id })));
  await Faq.insertMany(FAQS.map((f) => ({ ...f, tenantId: tenant._id })));

  // Ensure any existing real registered users are linked to this tenant
  await User.updateMany(
    { tenantId: { $ne: null }, role: "user" },
    { $set: { tenantId: tenant._id } }
  );

  const globalRoom = await ChatRoom.create({
    tenantId: tenant._id,
    name: "Apex Tower Lobby",
    type: "global",
  });
  await ChatRoom.insertMany(
    [1, 2, 3, 4, 5].map((n) => ({
      tenantId: tenant._id,
      name: `Floor ${n} Lounge`,
      type: "floor",
      floorNumber: n,
    }))
  );

  // A couple of welcome messages (mirrors src/data/chatData.js)
  const ali = await User.create({
    tenantId: tenant._id,
    username: "Ali",
    isGuest: true,
  });
  const sara = await User.create({
    tenantId: tenant._id,
    username: "Sara",
    isGuest: true,
  });
  await Message.create([
    {
      tenantId: tenant._id,
      roomId: globalRoom._id,
      senderId: ali._id,
      senderName: "Ali",
      message: "Welcome to Apex Tower!",
    },
    {
      tenantId: tenant._id,
      roomId: globalRoom._id,
      senderId: sara._id,
      senderName: "Sara",
      message: "Meeting starts at 3 PM.",
    },
  ]);

  // ── Seed realistic activity logs ──────────────────────────────────────────
  // Helper: create a Date that is `minutesAgo` minutes in the past
  const ago = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

  // Regular user actors for user-side logs
  const userActors = [
    { id: ali._id, name: "Ali", role: "user" },
    { id: sara._id, name: "Sara", role: "user" },
  ];

  // tenant_admin logs (visible to super admin)
  const adminLogs = [
    { action: "FAQ_CREATED", detail: 'Added FAQ: "What are the building timings?"', minutesAgo: 3 },
    { action: "OFFICE_CREATED", detail: 'Added office: "Ernst & Young" (8th Floor, Room 801)', minutesAgo: 12 },
    { action: "FAQ_UPDATED", detail: 'Updated FAQ: "Is there a gym in the tower?"', minutesAgo: 28 },
    { action: "FLOOR_MAP_UPLOADED", detail: "Uploaded floor map for Floor 4", minutesAgo: 45 },
    { action: "OFFICE_DELETED", detail: 'Deleted office: "Old Storage Room" (Ground Floor)', minutesAgo: 90 },
    { action: "FAQ_DELETED", detail: 'Deleted FAQ: "Is the cafeteria open on weekends?"', minutesAgo: 130 },
    { action: "OFFICE_CREATED", detail: 'Added office: "KPMG Advisory" (11th Floor, Room 1105)', minutesAgo: 200 },
    { action: "FLOOR_MAP_UPLOADED", detail: "Uploaded floor map for Floor 7", minutesAgo: 290 },
    { action: "FAQ_CREATED", detail: 'Added FAQ: "How does building security work?"', minutesAgo: 400 },
    { action: "OFFICE_UPDATED", detail: 'Updated office: "HR Department"', minutesAgo: 600 },
    { action: "BUILDING_STATUS_CHANGED", detail: 'Changed "Apex Tower" status to Active', minutesAgo: 800 },
  ];

  await ActivityLog.insertMany(
    adminLogs.map((l) => ({
      tenantId: tenant._id,
      actorId: tenantAdmin._id,
      actorName: tenantAdmin.username,
      actorRole: "tenant_admin",
      action: l.action,
      detail: l.detail,
      createdAt: ago(l.minutesAgo),
      updatedAt: ago(l.minutesAgo),
    }))
  );

  // user logs (visible to tenant admin)
  const userLogs = [
    { actor: userActors[0], action: "NAVIGATION_SEARCH", detail: 'Searched for: "HR Department" (1 result)', minutesAgo: 5 },
    { actor: userActors[1], action: "DIRECTIONS_VIEWED", detail: 'Got directions to: "Finance Department" (3rd Floor, Room 305)', minutesAgo: 8 },
    { actor: userActors[0], action: "NAVIGATION_SEARCH", detail: 'Searched for: "cafeteria" (1 result)', minutesAgo: 22 },
    { actor: userActors[1], action: "NAVIGATION_SEARCH", detail: 'Searched for: "IT support" (1 result)', minutesAgo: 35 },
    { actor: userActors[0], action: "DIRECTIONS_VIEWED", detail: 'Got directions to: "Conference Room" (2nd Floor, Room 210)', minutesAgo: 50 },
    { actor: userActors[1], action: "NAVIGATION_SEARCH", detail: 'Searched for: "gym" (0 results)', minutesAgo: 75 },
    { actor: userActors[0], action: "DIRECTIONS_VIEWED", detail: 'Got directions to: "Reception" (Ground Floor, Room G-01)', minutesAgo: 110 },
    { actor: userActors[1], action: "NAVIGATION_SEARCH", detail: 'Searched for: "medical" (1 result)', minutesAgo: 160 },
    { actor: userActors[0], action: "NAVIGATION_SEARCH", detail: 'Searched for: "marketing" (1 result)', minutesAgo: 240 },
  ];

  await ActivityLog.insertMany(
    userLogs.map((l) => ({
      tenantId: tenant._id,
      actorId: l.actor.id,
      actorName: l.actor.name,
      actorRole: l.actor.role,
      action: l.action,
      detail: l.detail,
      createdAt: ago(l.minutesAgo),
      updatedAt: ago(l.minutesAgo),
    }))
  );

  console.log("Seed complete:");
  console.log("  Super admin:  super@towernav.com / super123");
  console.log("  Tenant admin: admin@apextower.com / admin123 (tenantSlug: apex-tower)");
  console.log(`  Tenant: ${tenant.buildingName} (${tenant.slug})`);
  console.log(`  Offices: ${OFFICES.length}, Chat rooms: 6, FAQs: ${FAQS.length}`);
  console.log(`  Activity logs: ${adminLogs.length} admin + ${userLogs.length} user = ${adminLogs.length + userLogs.length} total`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
