import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  getDashboard,
} from "../controllers/dashboardController";

const router = express.Router();

router.get(
  "/",
  protect,
  getDashboard
);

export default router;