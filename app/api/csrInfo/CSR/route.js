import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../../config/db.js";
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
    console.log("Received payload in backend:", body);

    const lastCSR = await CSRform.findOne().sort({ csrNumber: -1 });
    const lastNumber =
      lastCSR && !isNaN(lastCSR.csrNumber) ? Number(lastCSR.csrNumber) : 0;
    const nextCsrNumber = lastNumber + 1;

    const newCSR = new CSRform({
      ...body,
      creatorId,
      filePath: req.body.filePath,
      csrNumber: nextCsrNumber,
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
