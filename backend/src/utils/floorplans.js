import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { UPLOADS_DIR } from "../middleware/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, "../../assets/floorplans");

// Copies the bundled floor plan images (Ground + Floors 1–13, from
// askaricorporatetower.com) into the uploads dir and returns a floors
// array ready to store on a Tenant.
export function installFloorPlans() {
  const floors = [];

  for (let n = 0; n <= 13; n++) {
    const source = path.join(ASSETS_DIR, `floor-${n}.jpg`);
    const floor = {
      floorNumber: n,
      name: n === 0 ? "Ground Floor" : `Floor ${n}`,
      mapUrl: "",
    };

    if (fs.existsSync(source)) {
      const filename = `floorplan-${n}.jpg`;
      fs.copyFileSync(source, path.join(UPLOADS_DIR, filename));
      floor.mapUrl = `/uploads/${filename}`;
    }

    floors.push(floor);
  }

  return floors;
}
