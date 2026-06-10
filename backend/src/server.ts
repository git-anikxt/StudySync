import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import { connectDB } from "./config/db";
import goalRoutes from "./routes/goalRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import contractRoutes from "./routes/contractRoutes";

dotenv.config();
console.log("Gemini key exists:", !!process.env.GEMINI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contracts", contractRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "StudySync Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
