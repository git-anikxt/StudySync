import mongoose from "mongoose";

const studyRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    createdBy: {
      type: String,
      required: true,
    },

    participants: [{ type: String }],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "StudyRoom",
  studyRoomSchema
);