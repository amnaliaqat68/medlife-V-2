import connectDB from "../../../config/db";
import User from "../../../model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const users = await User.find({ role: { $ne: "superAdmin" } }).select("-password");

  return NextResponse.json({ users });
}