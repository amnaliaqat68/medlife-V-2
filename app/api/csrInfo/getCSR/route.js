import { NextResponse } from "next/server";
import dbConnect from "../../../config/db.js";
import CSRform from "../../../model/CSRfom.js";

export async function GET() {
  await dbConnect();
  try {
    const csrs = await CSRform.find()
      .populate("creatorId")
      .populate("doctorId")
      .populate("approvedBy.sm", "name")
      .populate("approvedBy.gm", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(csrs);
  } catch (error) {
    console.error("Error fetching CSR data:", error);
    return NextResponse.json(
      { message: "Failed to fetch CSR data" },
      { status: 500 }
    );
  }
}
