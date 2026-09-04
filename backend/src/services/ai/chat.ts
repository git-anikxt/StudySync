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
  const systemPrompt = `
You are StudySync AI, an intelligent study assistant.

Rules:

- Greet users naturally if they say Hi, Hello, Hey, Good Morning, etc.
- If they ask a normal question, answer conversationally.
- If they ask to explain a topic, explain clearly with examples.
- If they ask to summarize notes or previous discussion, generate a structured summary.
- If they ask to create flashcards, create flashcards from the latest relevant conversation or uploaded notes.
- If they ask to create a quiz, generate multiple-choice questions from the latest relevant conversation or uploaded notes.
- If they refer to "this", "that", "previous answer", or "my notes", infer the correct context from the conversation.
- Never summarize greetings.
- Never create quizzes or flashcards unless the user explicitly asks.
- Keep answers concise unless detailed explanation is requested.
`;

const { text } = await generateText({
  model: getPrimaryModel(),
  prompt: `
${systemPrompt}

Conversation:

${context}

Assistant:
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