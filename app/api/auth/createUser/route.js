import connectDB from "../../../config/db.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../model/user.js";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    const { name, email, password, role, phone, designation, area, group } =
      await req.json();

    // Simple role check without auth (for testing only)
    const allowedRoles = ["dsm", "sm", "gm"];
    if (!allowedRoles.includes(role)) {
      return new NextResponse(JSON.stringify({ error: "Invalid role" }), {
        status: 403,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }
    // Check for duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "Email already exists" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (omit superUserId for now)

    const newUser = await User.create({
      name,
      email,
      designation,
      area,
      group,
      phone,
      password: hashedPassword,
      role: role.toLowerCase(),
    });

    return new NextResponse(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
