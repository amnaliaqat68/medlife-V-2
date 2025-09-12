import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "@/app/config/db";
import User from "@/app/model/user";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "supersecretkey";

export async function POST(req) {
  await connectDB();
  const { token, password } = await req.json();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
