import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

export const getPrimaryModel =
  () => google("gemini-2.5-flash");

export const getFallbackModel =
  () =>
    groq(
      "llama-3.3-70b-versatile"
    );