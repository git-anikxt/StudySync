import express from "express";
import multer from "multer";

import { protect } from "../middleware/authMiddleware";

import { extractNotes } from "../controllers/notesController";

const router = express.Router();

// memoryStorage keeps the upload in a Buffer — files are never
// written to disk anywhere in this flow.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

router.post(
  "/extract",
  protect,
  upload.single("file"),
  extractNotes
);

export default router;
