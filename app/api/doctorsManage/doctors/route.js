import connectDB from "../../../config/db.js";
import Doctor from "../../../model/addDoctor.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      name,
      speciality,
      qualification,
      designation,
      district,
      brick,
      group,
      zone,
      address,
      status,
      investmentLastYear,
      email,
      contact,
      totalValue,
    } = body;

    let existingDoctor = null;

    if (email) {
      existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return new NextResponse(
          JSON.stringify({ error: "Doctor with this email already exists" }),
          { status: 400 }
        );
      }
    }

    const doctorData = {
      name,
      speciality,
      qualification,
      designation,
      district,
      brick,
      group,
      zone,
      address,
      status,
      investmentLastYear,
      contact,
      totalValue,
      isDeleted: false,
    };

    // ✅ only add email if provided
    if (email) {
      doctorData.email = email;
    }

    const newDoctor = await Doctor.create(doctorData);
    return new NextResponse(JSON.stringify(newDoctor), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating doctor:", error.errors || error);
    return new NextResponse(
      JSON.stringify({ error: error.message, details: error.errors }),
      { status: 500 }
    );
  }
}
