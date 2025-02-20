import mongoose from "mongoose";
import { MONGO_URI } from "./envs";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
