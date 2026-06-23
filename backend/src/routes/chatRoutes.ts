import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  getRoomMessages,
} from "../controllers/chatController";

const router = express.Router();

router.get(
  "/:roomId",
  protect,
  getRoomMessages
);

export default router;