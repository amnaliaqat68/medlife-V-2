import { NextResponse } from "next/server";
import connectDB from "../../../config/db";
import Doctor from "../../../model/addDoctor.js";

export async function GET() {
  try {
    await connectDB();
    const doctors = await Doctor.find({isDeleted:false});
    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error("Doctor Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
