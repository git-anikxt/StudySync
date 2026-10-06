import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

export const getPrimaryModel =
  () => groq("openai/gpt-oss-120b");

export const getFallbackModel =
  () => google("gemini-3.8-flash");