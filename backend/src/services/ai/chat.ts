import { generateSummary } from "./summary";
import { generateFlashcards } from "./flashcards";
import { generateQuiz } from "./quiz";
import { generateText } from "ai";
import {
  getPrimaryModel,
  getFallbackModel,
} from "./provider";
type Message = {
  role: "user" | "assistant";
  content: string;
};

export const chatWithAI = async (
  messages: Message[]
) => {
  const lastMessage =
    messages[messages.length - 1].content.toLowerCase();

  const context = messages
    .map(
      (m) => `${m.role}: ${m.content}`
    )
    .join("\n\n");

  if (lastMessage.includes("quiz")) {
    return {
      type: "quiz",
      data: JSON.parse(
        await generateQuiz(context)
      ),
    };
  }

  if (
    lastMessage.includes("flashcard")
  ) {
    return {
      type: "flashcards",
      data: JSON.parse(
        await generateFlashcards(context)
      ),
    };
  }

  if (
    lastMessage.includes("summary") ||
    lastMessage.includes("summarize")
  ) {
    return {
      type: "summary",
      data: JSON.parse(
        await generateSummary(context)
      ),
    };
  }

 let reply: string;

try {
  const { text } = await generateText({
    model: getPrimaryModel(),
    prompt: `
You are StudySync AI.

Conversation:

${context}

Reply naturally.
`,
  });

  reply = text;
} catch (error) {
  console.error("Gemini Error:", error);

  const { text } = await generateText({
    model: getFallbackModel(),
    prompt: `
You are StudySync AI.

Conversation:

${context}

Reply naturally.
`,
  });

  reply = text;
}

  return {
    type: "chat",
    data: reply,
  };
};