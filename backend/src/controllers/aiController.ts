import { Request, Response } from "express";

import { generateSummary } from "../services/aiService";

export const summarizeNotes = async (
  req: Request,
  res: Response
) => {
  try {
    const { notes } = req.body;

    const summary = await generateSummary(notes);

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
};