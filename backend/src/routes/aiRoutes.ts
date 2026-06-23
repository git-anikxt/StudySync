import express from "express";

import {
  summarizeNotes,
  flashcards,
  quiz,
} from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/summary",
  protect,
  summarizeNotes
);

router.post(
  "/flashcards",
  protect,
  flashcards
);

router.post(
  "/quiz",
  protect,
  quiz
);

export default router;