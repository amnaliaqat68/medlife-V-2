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

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return new NextResponse(
        JSON.stringify({ error: "Doctor with this email already exists" }),
        { status: 400 }
      );
    }
    const newDoctor = await Doctor.create({
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
       isDeleted: false,
    });

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
