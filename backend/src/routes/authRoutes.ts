import express from "express";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", protect, (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;