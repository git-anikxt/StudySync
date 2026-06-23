import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  startSession,
  endSession,
} from "../controllers/sessionController";

const router = express.Router();

router.post(
  "/start",
  protect,
  startSession
);

router.patch(
  "/:id/end",
  protect,
  endSession
);

export default router;