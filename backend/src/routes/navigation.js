import { Router } from "express";
import { search, directions } from "../controllers/navigationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/search", search);
router.get("/directions/:officeId", directions);

export default router;
