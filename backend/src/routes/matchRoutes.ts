import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  findMatches,
} from "../controllers/matchController";

const router = express.Router();

router.get(
  "/",
  protect,
  findMatches
);

export default router;