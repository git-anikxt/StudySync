import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  updateProfile,
    getProfile,
    } from "../controllers/userController";

const router = express.Router();

router.patch(
  "/profile",
  protect,
  updateProfile
);
router.get(
  "/profile",
  protect,
  getProfile
);

export default router;