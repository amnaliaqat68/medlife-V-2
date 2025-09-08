import { NextResponse } from "next/server";
import connectDB from "../../../config/db.js";
import User from "../../../model/user.js";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { name, email, password, role } = body;

  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
  }

  // Optional: Prevent multiple superAdmins
  if (role === "superAdmin") {
    const exists = await User.findOne({ role: "superAdmin" });
    if (exists) {
      return NextResponse.json({ error: "SuperAdmin already exists" }, { status: 403 });
    }
  }

  // Hash the password before saving
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create the user with hashed password
  const user = await User.create({ 
    name, 
    email, 
    password: hashedPassword, 
    role 
  });

  // Return success without logging in
  return NextResponse.json({ 
    message: "User created successfully",
    user: { 
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role 
    }
  });
}
