// import { NextResponse } from "next/server";
// import connectDB from "../../../config/db";
// import Doctor from "../../../model/addDoctor.js";

// export async function GET() {
//   try {
//     await connectDB();
//     const doctors = await Doctor.find({isDeleted:false});
//     return NextResponse.json(doctors, { status: 200 });
//   } catch (error) {
//     console.error("Doctor Fetch Error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import connectDB from "../../../config/db";
import Doctor from "../../../model/addDoctor.js";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    // ✅ Get token from request headers
    const token = req.cookies?.get("token")?.value 
      || req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    let query = { isDeleted: false };

    // ✅ Restrict DSM/SM by district(s)
   if (["dsm", "sm"].includes(decoded.role)) {
  if (Array.isArray(decoded.district)) {
    query.$or = decoded.district.map(d => ({
      district: { $regex: new RegExp(`^${d}$`, "i") }
    }));
  } else if (decoded.district) {
    query.district = { $regex: new RegExp(`^${decoded.district}$`, "i") };
  }
}

    const doctors = await Doctor.find(query);

    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error("Doctor Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


