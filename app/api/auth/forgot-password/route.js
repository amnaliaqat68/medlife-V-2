import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import jwt from "jsonwebtoken";
import connectDB from "@/app/config/db";
import User from "@/app/model/user";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "supersecretkey";

export async function POST(req) {
  await connectDB();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await sendMail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
  });

  return NextResponse.json({ message: "Reset email sent" });
}
