import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    witnessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "active",
        "completed",
        "missed",
      ],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "AccountabilityContract",
  contractSchema
);