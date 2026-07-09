// Attaches the bundled floor plan schematics (Ground + Floors 1–13) to an
// existing tenant WITHOUT wiping any data. Run with: npm run floorplans
// Optionally pass a slug: node src/attach-floorplans.js my-building
import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import Tenant from "./models/Tenant.js";
import { installFloorPlans } from "./utils/floorplans.js";

const slug = process.argv[2] || "apex-tower";

async function run() {
  await connectDB();

  const tenant = await Tenant.findOne({ slug });
  if (!tenant) {
    console.error(`Tenant "${slug}" not found`);
    process.exit(1);
  }

  tenant.floors = installFloorPlans();
  await tenant.save();

  const withMaps = tenant.floors.filter((f) => f.mapUrl).length;
  console.log(
    `Updated ${tenant.buildingName}: ${tenant.floors.length} floors, ${withMaps} with floor plans`
  );

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
