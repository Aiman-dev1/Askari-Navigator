// Seeds a demo tenant ("Apex Tower") whose directory matches the
// frontend mock data in src/data/offices.js and navigationData.js.
// Run with: npm run seed
import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import Tenant from "./models/Tenant.js";
import User from "./models/User.js";
import Office from "./models/Office.js";
import ChatRoom from "./models/ChatRoom.js";
import Message from "./models/Message.js";
import Faq from "./models/Faq.js";
import { installFloorPlans } from "./utils/floorplans.js";

const OFFICES = [
  {
    name: "HR Department",
    floor: "4th Floor",
    floorNumber: 4,
    room: "402",
    description: "Human Resources Office",
    category: "department",
    directions: [
      "Enter through the main entrance.",
      "Take the elevator to the 4th floor.",
      "Turn left after exiting the elevator.",
      "Office 402 is next to the water cooler.",
    ],
  },
  {
    name: "Finance Department",
    floor: "3rd Floor",
    floorNumber: 3,
    room: "305",
    description: "Accounts & Finance",
    category: "department",
    directions: [
      "Take the elevator to the 3rd floor.",
      "Turn right.",
      "Room 305 is opposite the meeting room.",
    ],
  },
  {
    name: "IT Department",
    floor: "5th Floor",
    floorNumber: 5,
    room: "501",
    description: "Technical Support",
    category: "department",
    directions: ["Go to the 5th floor.", "Walk straight.", "The first office on the left is IT."],
  },
  {
    name: "Marketing",
    floor: "2nd Floor",
    floorNumber: 2,
    room: "204",
    description: "Marketing Team",
    category: "department",
    directions: [],
  },
  {
    name: "Reception",
    floor: "Ground Floor",
    floorNumber: 0,
    room: "G-01",
    description: "Main Reception",
    category: "utility",
    directions: [],
  },
  {
    name: "Conference Room",
    floor: "2nd Floor",
    floorNumber: 2,
    room: "210",
    description: "Meeting Room",
    category: "conference",
    directions: [],
  },
  {
    name: "Cafeteria",
    floor: "1st Floor",
    floorNumber: 1,
    room: "110",
    description: "Food Court",
    category: "utility",
    directions: [],
  },
  {
    name: "Medical Room",
    floor: "Ground Floor",
    floorNumber: 0,
    room: "G-05",
    description: "Emergency Medical Help",
    category: "utility",
    directions: [],
  },
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

  await Promise.all([
    Tenant.deleteMany({}),
    User.deleteMany({}),
    Office.deleteMany({}),
    ChatRoom.deleteMany({}),
    Message.deleteMany({}),
    Faq.deleteMany({}),
  ]);

  // Super admin (platform level, no tenant)
  const superAdmin = new User({
    username: "superadmin",
    email: "super@towernav.com",
    role: "super_admin",
  });
  await superAdmin.setPassword("super123");
  await superAdmin.save();

  // Demo building
  const tenant = await Tenant.create({
    buildingName: "Apex Tower",
    slug: "apex-tower",
    subscriptionStatus: "Active",
    // Ground + Floors 1–13 with real floor plan schematics
    floors: installFloorPlans(),
  });

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

  console.log("Seed complete:");
  console.log("  Super admin:  super@towernav.com / super123");
  console.log("  Tenant admin: admin@apextower.com / admin123 (tenantSlug: apex-tower)");
  console.log(`  Tenant: ${tenant.buildingName} (${tenant.slug})`);
  console.log(`  Offices: ${OFFICES.length}, Chat rooms: 6, FAQs: ${FAQS.length}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
