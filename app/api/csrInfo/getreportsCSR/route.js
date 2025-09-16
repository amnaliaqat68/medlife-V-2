import { NextResponse } from "next/server";

import CSRfom from "@/app/model/CSRfom";

import connectDB from "@/app/config/db";

export async function GET() {
  await connectDB();

  try {
    const data = await CSRfom.find({ adminStatus: "completed" })
     
      .populate("creatorId", "name district")
      .populate(
        "doctorId",
        "name speciality address brick district zone group designation qualification"
      )
       .lean()
    return Response.json(data);
  } catch (error) {
    return new Response("Error fetching data", { status: 500 });
  }
}
