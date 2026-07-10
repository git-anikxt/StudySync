import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
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

    rewardXp: {
      type: Number,
      default: 100,
    },

    penaltyReputation: {
      type: Number,
      default: 20,
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