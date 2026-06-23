import mongoose from "mongoose";

const chatMessageSchema =
  new mongoose.Schema(
    {
      roomId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "StudyRoom",
        required: true,
      },

      senderId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      senderName: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "ChatMessage",
  chatMessageSchema
);