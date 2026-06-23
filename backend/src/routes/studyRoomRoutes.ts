import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  createRoom,
  getRooms,
  joinRoom,
  leaveRoom,
  getRoomParticipants
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

router.post(
  "/:id/join",
  protect,
  joinRoom
);

router.post(
  "/:id/leave",
  protect,
  leaveRoom
);

router.get(
  "/:id/participants",
  protect,
  getRoomParticipants
);

export default router;