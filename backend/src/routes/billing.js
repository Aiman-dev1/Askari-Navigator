import { Router } from "express";
import {
  listPlans,
  getSubscription,
  createCheckout,
  createPortal,
} from "../controllers/billingController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/plans", listPlans);
router.get("/subscription", requireAuth, requireRole("tenant_admin"), getSubscription);
router.post("/checkout", requireAuth, requireRole("tenant_admin"), createCheckout);
router.post("/portal", requireAuth, requireRole("tenant_admin"), createPortal);

// Note: the Stripe webhook is mounted directly in app.js (it needs the raw body)

export default router;
