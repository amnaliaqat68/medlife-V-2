import { NextResponse } from "next/server";
import connectDB from "@/app/config/db.js";
import CSRfom from "@/app/model/CSRfom.js";
import addDoctor from "@/app/model/addDoctor";
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
  const exactCost = formData.get("exactCost");
 const fileUrl = formData.get("fileUrl");

  const updatedCSR = await CSRfom.findByIdAndUpdate(
    id,
    {
      executedBy,
      executeDate,
      particulars,
      "Business.0.exactCost": exactCost,
      filePath: fileUrl,
      adminStatus: "completed",
    },
    { new: true }
  );

  if (!updatedCSR) {
    return NextResponse.json({ message: "CSR not found" }, { status: 404 });
  }
  const doctorId = updatedCSR.doctorId;
  if (doctorId) {
    const doctor = await addDoctor.findById(doctorId);
    if (doctor) {
      const prevInvestment = Number(doctor.investmentLastYear) || 0;
      const cost = Number(exactCost) || 0;
      doctor.investmentLastYear = prevInvestment + cost;
      await doctor.save();
    }
  }

  return NextResponse.json(updatedCSR);
}
