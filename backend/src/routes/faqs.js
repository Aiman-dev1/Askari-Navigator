import { Router } from "express";
import { listFaqs, createFaq, updateFaq, deleteFaq, ask } from "../controllers/faqController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Public — resolves the building from the JWT or ?tenantSlug=
router.get("/ask", ask);

router.use(requireAuth);
router.get("/", listFaqs);
router.post("/", requireRole("tenant_admin"), createFaq);
router.put("/:id", requireRole("tenant_admin"), updateFaq);
router.delete("/:id", requireRole("tenant_admin"), deleteFaq);

export default router;
