import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import { connectDB } from "./config/db";
import goalRoutes from "./routes/goalRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import contractRoutes from "./routes/contractRoutes";
import leaderRoutes from "./routes/leaderRoutes";
import matchRoutes from "./routes/matchRoutes";
import userRoutes from "./routes/userRoutes";
import studyRoomRoutes from "./routes/studyRoomRoutes";
import chatRoutes from "./routes/chatRoutes";
import ChatMessage from "./models/ChatMessage";
import sessionRoutes from "./routes/sessionRoutes";
dotenv.config();
console.log("Gemini key exists:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

// Clerk auth — verifies the session JWT (Bearer token from the
// frontend) on every request; route guards read getAuth(req).
app.use(clerkMiddleware());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/leaderboard", leaderRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/study-rooms", studyRoomRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "StudySync Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  socket.on(
    "join-room",
    (roomId) => {
      socket.join(roomId);

      console.log(
        `${socket.id} joined ${roomId}`
      );
    }
  );

  socket.on(
    "leave-room",
    (roomId) => {
      socket.leave(roomId);
    }
  );

  socket.on(
  "send-message",
  async (data) => {
    try {
      const {
        roomId,
        senderId,
        senderName,
        message,
      } = data;

      const savedMessage =
        await ChatMessage.create({
          roomId,
          senderId,
          senderName,
          message,
        });

      io.to(roomId).emit(
        "receive-message",
        savedMessage
      );
    } catch (error) {
      console.error(error);
    }
  }
);
  socket.on("disconnect", () => {
    console.log(
      "User disconnected"
    );
  });
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
});
