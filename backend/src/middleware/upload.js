import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Floor plans: vector preferred, but raster schematics are common too
const ALLOWED = {
  "image/svg+xml": ".svg",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    // Never trust the client filename — build our own
    const ext = ALLOWED[file.mimetype];
    cb(null, `${req.user.tenantId}-floor${req.params.floorNumber}-${Date.now()}${ext}`);
  },
});

export const uploadFloorPlan = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED[file.mimetype]) {
      const err = new Error("Only SVG, PNG, JPG or WebP images are allowed");
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});
