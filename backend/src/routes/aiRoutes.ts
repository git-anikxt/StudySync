import express from "express";

import { summarizeNotes } from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/summary",
  protect,
  summarizeNotes
);

export default router;