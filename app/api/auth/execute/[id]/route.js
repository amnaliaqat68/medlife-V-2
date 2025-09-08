import { NextResponse } from "next/server";
import connectDB from "@/app/config/db.js";
import CSRfom from "@/app/model/CSRfom.js";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  await connectDB();
  const { id } = params;
   if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid CSR ID" }, { status: 400 });
  }
  const formData = await req.formData();

const executedBy = formData.get("executedBy");
const executeDate = formData.get("executeDate");
const particulars = formData.get("particulars");
const fileUrl = formData.get("fileUrl");


  const updatedCSR = await CSRfom.findByIdAndUpdate(
    id,
    {
      executedBy,
      executeDate,
      particulars,
      filePath: fileUrl,
      adminStatus: "completed",
    },
    { new: true }
  );

  if (!updatedCSR) {
    return NextResponse.json({ message: "CSR not found" }, { status: 404 });
  }

  return NextResponse.json(updatedCSR);
}
