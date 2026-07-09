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

// Mirrors src/data/faqs.js on the frontend
const FAQS = [
  { question: "Where is the HR department?", answer: "HR Department is on 4th Floor, Room 402." },
  { question: "Where is the finance department?", answer: "Finance Department is on 3rd Floor, Room 305." },
  { question: "Where is the IT department?", answer: "IT Department is on 5th Floor, Room 501." },
  { question: "Where is the cafeteria?", answer: "Cafeteria is on 1st Floor, Room 110." },
  { question: "What are the office timings?", answer: "Office timing is Monday to Friday, 9:00 AM to 5:00 PM." },
  { question: "Where is the reception?", answer: "Reception is on the Ground Floor." },
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
    floors: [0, 1, 2, 3, 4, 5].map((n) => ({
      floorNumber: n,
      name: n === 0 ? "Ground Floor" : `Floor ${n}`,
      mapUrl: "",
    })),
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
