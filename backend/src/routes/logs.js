import { Router } from "express";
import { getLogs } from "../controllers/logController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRole("super_admin", "tenant_admin"),
  getLogs
);

export default router;
