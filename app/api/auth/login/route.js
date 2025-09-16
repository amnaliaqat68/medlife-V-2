import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB  from "../../../config/db.js";
import User from "../../../model/user.js";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  
  if (!user){
     console.log("❌ User not found");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign(
    { userId: user._id, role: user.role, name: user.name, email: user.email, phone: user.phone, district: user.district,},
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  const res = NextResponse.json({ message: "Login successful",  user: {
    userId: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
    phone:user.phone,
    district:user.district,
  }, });
  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res;
}
