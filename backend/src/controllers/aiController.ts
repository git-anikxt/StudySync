import { Request, Response } from "express";

import {
  generateSummary,
  generateFlashcards,
  generateQuiz,
} from "../services/ai";

import { chatWithAI } from "../services/ai/chat";

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

export const flashcards = async (
  req: Request,
  res: Response
) => {
  try {
    const { notes } = req.body;

    const result = await generateFlashcards(notes);

    console.log("Flashcards Generated:", result);

    res.json({
      success: true,
      flashcards: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Flashcard generation failed",
    });
  }
};

export const quiz = async (
  req: any,
  res: any
) => {
  try {
    const { notes } = req.body;

    const result =
      await generateQuiz(notes);

    res.json({
      success: true,
      quiz: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Quiz generation failed",
    });
  }
};

export const chat = async (
  req: Request,
  res: Response
) => {
  try {
    const { messages } = req.body;

    const result =
      await chatWithAI(messages);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Chat failed",
    });
  }
};