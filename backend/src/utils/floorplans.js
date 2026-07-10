import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { UPLOADS_DIR } from "../middleware/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, "../../assets/floorplans");

// Copies any bundled floor plan images missing from uploads/. Runs at server
// startup too, so fresh containers (whose uploads dir starts empty) can still
// serve the /uploads/floorplan-N.jpg URLs stored on tenants.
export function ensureFloorPlanFiles() {
  let restored = 0;

  for (let n = 0; n <= 13; n++) {
    const source = path.join(ASSETS_DIR, `floor-${n}.jpg`);
    const target = path.join(UPLOADS_DIR, `floorplan-${n}.jpg`);
    if (fs.existsSync(source) && !fs.existsSync(target)) {
      fs.copyFileSync(source, target);
      restored++;
    }
  }

  if (restored > 0) console.log(`Restored ${restored} bundled floor plan(s) into uploads/`);
}

// Ensures the files exist and returns a floors array (Ground + Floors 1–13,
// from askaricorporatetower.com) ready to store on a Tenant.
export function installFloorPlans() {
  ensureFloorPlanFiles();

  const floors = [];
  for (let n = 0; n <= 13; n++) {
    const hasPlan = fs.existsSync(path.join(ASSETS_DIR, `floor-${n}.jpg`));
    floors.push({
      floorNumber: n,
      name: n === 0 ? "Ground Floor" : `Floor ${n}`,
      mapUrl: hasPlan ? `/uploads/floorplan-${n}.jpg` : "",
    });
  }
  return floors;
}
