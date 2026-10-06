import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, verifyToken } from "@clerk/express";
import aiRoutes from "./routes/aiRoutes";
import { connectDB } from "./config/db";
import goalRoutes from "./routes/goalRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import contractRoutes from "./routes/contractRoutes";
import leaderRoutes from "./routes/leaderRoutes";
import matchRoutes from "./routes/matchRoutes";
import notesRoutes from "./routes/notesRoutes";
import userRoutes from "./routes/userRoutes";
import studyRoomRoutes from "./routes/studyRoomRoutes";
import chatRoutes from "./routes/chatRoutes";
import ChatMessage from "./models/ChatMessage";
import sessionRoutes from "./routes/sessionRoutes";
dotenv.config();
console.log("Gemini key exists:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Clerk auth — verifies the session JWT (Bearer token from the
// frontend) on every request; route guards read getAuth(req).
app.use(clerkMiddleware());

// ⚠️ TEMPORARY DIAGNOSTIC — REMOVE once the 401 investigation is resolved.
// Unprotected by design: must run even when the normal auth flow fails.
app.get("/api/debug/verify-token", async (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  if (!token) {
    return res.json({
      success: false,
      debug: "No token provided. Send header: Authorization: Bearer <token>",
    });
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    return res.json({ success: true, payload });
  } catch (error: any) {
    return res.json({
      success: false,
      errorName: error?.constructor?.name ?? null,
      message: error?.message ?? null,
      reason: error?.reason ?? null,
      longMessage: error?.longMessage ?? null,
      data: error?.data ?? null,
    });
  }
});

app.use("/api/ai", aiRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/leaderboard", leaderRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/notes", notesRoutes);
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
import { getClerkUserProfile } from "./services/clerkProfile";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (typeof token !== "string" || !process.env.CLERK_SECRET_KEY) {
    return next(new Error("Unauthorized"));
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (typeof payload.sub !== "string") {
      return next(new Error("Unauthorized"));
    }

    const profile = await getClerkUserProfile(payload.sub);
    socket.data.clerkUserId = payload.sub;
    socket.data.clerkUserName = profile.name;
    return next();
  } catch {
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  socket.on(
    "join-room",
    (roomId) => {
      if (typeof roomId !== "string") {
        socket.emit("message-error", {
          message: "Invalid room identifier.",
        });
        return;
      }

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

  socket.on("send-message", async (data) => {
    try {
      const { roomId, message } = data;

      if (
        typeof roomId !== "string" ||
        typeof message !== "string" ||
        !message.trim()
      ) {
        socket.emit("message-error", {
          message: "A room and non-empty message are required.",
        });
        return;
      }

      const savedMessage = await ChatMessage.create({
        roomId,
        senderId: socket.data.clerkUserId,
        senderName: socket.data.clerkUserName,
        message: message.trim(),
      });

      io.to(roomId).emit("receive-message", savedMessage);
    } catch (error) {
      console.error("Failed to save room message:", error);
      socket.emit("message-error", {
        message: "Unable to send your message. Please try again.",
      });
    }
  });
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
