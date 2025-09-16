import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/app/config/db";
import User from "@/app/model/user";

// Simple: store as Base64 string OR just filename (if you’re using cloud storage)
export async function POST(req) {
  await connectDB();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert to Base64 (⚠️ works but not scalable, better: S3 or Cloudinary)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { profileImage: base64Image },
      { new: true }
    ).select("-password");

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
