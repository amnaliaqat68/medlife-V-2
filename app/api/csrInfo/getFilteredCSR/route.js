import { NextResponse } from "next/server";
import CSRfom from "@/app/model/CSRfom";
import connectDB from "@/app/config/db";
import addDoctor from "@/app/model/addDoctor";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const district = searchParams.get("district");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const name = searchParams.get("name");
  let filter = { adminStatus: "completed" };

  if (startDate && endDate) {
    filter.executeDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  try {
    // First, get all data with populated doctorId
    let data = await CSRfom.find(filter)
      .lean()
      .populate({
        path: "doctorId",
        select:
          "name speciality address brick qualification designation district zone group",
      })
      .populate({
        path: "creatorId",
        select: "name  district ",
      });

    console.log("Total records found:", data.length);
    console.log(
      "Sample doctor districts:",
      data.slice(0, 5).map((d) => d.doctorId?.district)
    );
    if (name) {
  const regex = new RegExp(name.trim(), "i"); // ✅ partial, case-insensitive match
  data = data.filter(
    (item) => item.doctorId && regex.test(item.doctorId.name.trim())
  );
  console.log("After name filter:", data.length, "records");
}

    if (district) {
      data = data.filter(
        (item) =>
          item.doctorId &&
          item.doctorId.district &&
          item.doctorId.district.toLowerCase() === district.toLowerCase()
      );
      console.log("After district filter:", data.length, "records");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error fetching data", { status: 500 });
  }
}
