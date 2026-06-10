import express from "express";



import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  completeGoal,
} from "../controllers/goalController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  createGoal
);

router.get(
  "/",
  protect,
  getGoals
);

router.patch(
  "/:id",
  protect,
  updateGoal
);

router.delete(
  "/:id",
  protect,
  deleteGoal
);

router.patch(
  "/:id/complete",
  protect,
  completeGoal
);

export default router;