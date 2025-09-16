import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/app/model/user";
import connectDB from "@/app/config/db";

export async function GET() {
  await connectDB();
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

   
    await User.findByIdAndUpdate(decoded.id, { lastActive: new Date() });
    

    return Response.json({ user: decoded });
  } catch (err) {
    console.error("JWT error:", err);
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
