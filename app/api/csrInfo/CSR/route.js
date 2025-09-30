import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../../config/db.js";
import addDoctor from "@/app/model/addDoctor.js";
import CSRform from "../../../model/CSRfom.js";


export async function POST(req) {
  try {
    await connectDB();

  
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const creatorId = decoded.userId;

    const body = await req.json();
    // console.log("Received payload in backend:", body);
    const doctor = await addDoctor.findById(body.doctorId);
    

    const lastCSR = await CSRform.findOne().sort({ csrNumber: -1 });
    const lastNumber =
      lastCSR && !isNaN(lastCSR.csrNumber) ? Number(lastCSR.csrNumber) : 0;
    const nextCsrNumber = lastNumber + 1;
    const lastDoctorCSR = await CSRform.findOne({ doctorId: body.doctorId })
      .sort({ activityNumber: -1 })
      .exec();

    const nextActivityNumber = lastDoctorCSR
      ? lastDoctorCSR.activityNumber + 1
      : 1;

    const newCSR = new CSRform({
      ...body,
      creatorId,
       Business: [
      {
        ...body.Business[0],
        investmentLastYear: doctor ? doctor.investmentLastYear : 0, 
      },
    ],
     filePath: body.filePath || null,
      csrNumber: nextCsrNumber,
      activityNumber: nextActivityNumber,
    });
    const saved = await newCSR.save();

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
