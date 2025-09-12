import connectDB from "@/app/config/db";
import User from "@/app/model/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
  await connectDB();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { name, email, password } = await req.json();

    const updatedData = { name, email };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      updatedData,
      { new: true }
    );

    const newToken = jwt.sign(
      {
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const res = NextResponse.json({
      message: "Profile updated successfully",
      user: {
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });

    res.cookies.set("token", newToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res;
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { error: "Invalid token or update failed" },
      { status: 400 }
    );
  }
}
