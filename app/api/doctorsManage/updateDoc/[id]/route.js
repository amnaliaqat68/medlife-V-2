import { NextResponse } from "next/server";
import connectDB from "@/app/config/db.js";
import Doctor from "@/app/model/addDoctor";
export async function PATCH(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const body = await req.json();

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updatedDoctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(updatedDoctor, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
