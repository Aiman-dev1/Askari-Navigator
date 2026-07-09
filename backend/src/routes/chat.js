import { Router } from "express";
import {
  listRooms,
  listMessages,
  reportMessage,
  listReported,
  deleteMessage,
} from "../controllers/chatController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/rooms", listRooms);
router.get("/rooms/:roomId/messages", listMessages);
router.post("/messages/:id/report", reportMessage);

// Moderation (tenant admin)
router.get("/reported", requireRole("tenant_admin"), listReported);
router.delete("/messages/:id", requireRole("tenant_admin"), deleteMessage);

export default router;
