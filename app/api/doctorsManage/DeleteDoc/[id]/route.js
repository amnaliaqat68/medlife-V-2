import connectDB from "@/app/config/db";
import Doctor from "@/app/model/addDoctor";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const { id } = params;

    const updatedDoc = await Doctor.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedDoc) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Doctor soft-deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error("Soft delete error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
