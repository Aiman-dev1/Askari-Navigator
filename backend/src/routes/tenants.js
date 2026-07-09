import { Router } from "express";
import {
  listTenants,
  createTenant,
  updateTenant,
  getTenantBySlug,
  getMyTenant,
  updateMyFloors,
  uploadFloorMap,
} from "../controllers/tenantController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { uploadFloorPlan } from "../middleware/upload.js";

const router = Router();

// Public — used by the guest onboarding screen
router.get("/slug/:slug", getTenantBySlug);

// Tenant admin — manage own building
router.get("/mine", requireAuth, requireRole("tenant_admin"), getMyTenant);
router.put("/mine/floors", requireAuth, requireRole("tenant_admin"), updateMyFloors);
router.post(
  "/mine/floors/:floorNumber/map",
  requireAuth,
  requireRole("tenant_admin"),
  uploadFloorPlan.single("map"),
  uploadFloorMap
);

// Super admin — manage all buildings/subscriptions
router.get("/", requireAuth, requireRole("super_admin"), listTenants);
router.post("/", requireAuth, requireRole("super_admin"), createTenant);
router.patch("/:id", requireAuth, requireRole("super_admin"), updateTenant);

export default router;
