import { Router } from "express";
import { register, login, guest, me, updateMe } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/guest", guest);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, updateMe);

export default router;
