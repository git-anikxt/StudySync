import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  createRoom,
  getRooms,
} from "../controllers/studyRoomController";

const router = express.Router();

router.post(
  "/",
  protect,
  createRoom
);

router.get(
  "/",
  protect,
  getRooms
);

export default router;