import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in-progress",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Goal",
  goalSchema
);