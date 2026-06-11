import express from "express";

import {
  createContract,
  getContracts,
  completeContract,
  missContract,
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

router.patch(
  "/:id/complete",
  protect,
  completeContract
);

router.patch(
  "/:id/miss",
  protect,
  missContract
);

export default router;