import mongoose from "mongoose";
import User from "../model/user.js";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1); 
  }
};

export default connectDB;