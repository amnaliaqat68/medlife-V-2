
import { NextResponse } from "next/server";
import connectDB from "@/app/config/db";
import User from "@/app/model/user";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(id, body, {
      new: true, // return updated user
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}
