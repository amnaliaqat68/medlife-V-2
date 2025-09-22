// import { NextResponse } from "next/server";
// import dbConnect from "../../../config/db.js";
// import CSRform from "../../../model/CSRfom.js";

// export async function GET() {
//   await dbConnect();
//   try {
//     const csrs = await CSRform.find()
//       .populate("creatorId")
//       .populate("doctorId")
//       .populate("role")
//       .populate("approvedBy.sm", "name")
//       .populate("approvedBy.gm", "name")
//       .sort({ createdAt: -1 });

//     return NextResponse.json(csrs);
//   } catch (error) {
//     console.error("Error fetching CSR data:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch CSR data" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import dbConnect from "../../../config/db.js";
// import CSRform from "../../../model/CSRfom.js";
// import jwt from "jsonwebtoken";

// export async function GET(req) {
//   await dbConnect();

//   try {
//     const token =
//       req.cookies?.get("token")?.value ||
//       req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // ✅ Decode JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     // Example: you should replace with your auth/session logic
//     const user = req.user || { role: "sm", district: "north" };

//     let query = {};

//     // Restrict data for SM and DSM
//      if (["dsm", "sm"].includes(decoded.role)) {
//       if (Array.isArray(decoded.district)) {
//         query.$or = decoded.district.map((d) => ({
//           "creatorId.district": { $regex: new RegExp(d, "i") },
//         }));
//       } else if (decoded.district) {
//         query["creatorId.district"] = {
//           $regex: new RegExp(decoded.district, "i"),
//         };
//       }
//     }
//     // Admin & GM can see all → query remains empty

//     const csrs = await CSRform.find(query)
//       .populate("creatorId" ,"name district")
//       .populate("doctorId")
//       .populate("role")
//       .populate("approvedBy.sm", "name")
//       .populate("approvedBy.gm", "name")
//       .sort({ createdAt: -1 });

//     return NextResponse.json(csrs);
//   } catch (error) {
//     console.error("Error fetching CSR data:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch CSR data" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "../../../config/db.js";
import CSRform from "../../../model/CSRfom.js";
import jwt from "jsonwebtoken";
import addDoctor from "@/app/model/addDoctor.js";
export async function GET(req) {
  await dbConnect();

  try {
    const token =
      req.cookies?.get("token")?.value ||
      req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    let query = {};

    

    const csrs = await CSRform.find(query)
      .populate({
        path: "doctorId",
        match:
         decoded.role === "sm" || decoded.role === "dsm"
      ? {
          $or: (
            Array.isArray(decoded.district)
              ? decoded.district
              : [decoded.district]
          ).map((d) => ({
            district: { $regex: new RegExp(`^${d}$`, "i") },
          })),
        }
      : {},
        select: "name district qualification designation speciality address brick zone group",
      })
      .populate("creatorId", "name district")

      .populate("approvedBy.sm", "name")
      .populate("approvedBy.gm", "name")
      .sort({ createdAt: -1 });
      const filteredCSRs =
  decoded.role === "sm" || decoded.role === "dsm"
    ? csrs.filter(csr => csr.doctorId) 
    : csrs;

    return NextResponse.json(filteredCSRs);
  } catch (error) {
    console.error("Error fetching CSR data:", error);
    return NextResponse.json(
      { message: "Failed to fetch CSR data" },
      { status: 500 }
    );
  }
}
