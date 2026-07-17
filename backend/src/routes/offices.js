import { Router } from "express";
import {
  listOffices,
  createOffice,
  updateOffice,
  deleteOffice,
  bulkDeleteOffices,
} from "../controllers/officeController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listOffices);
router.post("/", requireRole("tenant_admin"), createOffice);
router.post("/bulk-delete", requireRole("tenant_admin", "super_admin"), bulkDeleteOffices);
router.put("/:id", requireRole("tenant_admin"), updateOffice);
router.delete("/:id", requireRole("tenant_admin", "super_admin"), deleteOffice);

export default router;
