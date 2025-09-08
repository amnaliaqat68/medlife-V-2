
import { NextResponse } from "next/server";
import connectDB from "../../../config/db";
import User from "../../../model/user";

export async function GET(req) {
  try {
    await connectDB();
    const users = await User.find({
      role: { $nin: ["admin", "superAdmin"] }
    }).select("-password"); 
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
