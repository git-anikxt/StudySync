import express from "express";
import {
  register,
  login,
} from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;