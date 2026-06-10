import express from "express";

import {
  createContract,
  getContracts,
} from "../controllers/contractController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  createContract
);

router.get(
  "/",
  protect,
  getContracts
);

export default router;