import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  getLeaderboard,
} from "../controllers/leaderboardController";

const router = express.Router();

router.get(
  "/",
  protect,
  getLeaderboard
);

export default router;