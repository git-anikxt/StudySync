import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Mongo URL exists:", !!process.env.MONGODB_URL);

    await mongoose.connect(process.env.MONGODB_URL as string);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};