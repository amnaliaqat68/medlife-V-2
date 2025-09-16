import { NextResponse } from "next/server";
import connectDB from "@/app/config/db";
import User from "@/app/model/user";

// ✅ DELETE user by ID
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}


   