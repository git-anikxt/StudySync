import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    xp: {
      type: Number,
      default: 0,
    },

    streak: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    reputation: {
      type: Number,
      default: 0,
    },

    accountabilityScore: {
      type: Number,
      default: 0,
    },

    studyHours: {
      type: Number,
      default: 0,
    },
    semester: {
  type: String,
  default: "",
},

subjects: {
  type: [String],
  default: [],
},

availability: {
  type: String,
  default: "",
},
bio: {
  type: String,
  default: "",
},

avatar: {
  type: String,
  default: "",
},
lastStudyDate: {
  type: Date,
},
badges: {
  type: [String],
  default: [],
},

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);