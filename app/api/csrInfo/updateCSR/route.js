import { NextResponse } from "next/server";
import dbConnect from "../../../config/db.js";
import CSRform from "../../../model/CSRfom.js";

export async function PATCH(req) {
  await dbConnect();

  const { csrId, role, status } = await req.json();

  if (!csrId || !["sm", "gm", "admin"].includes(role) || !["approved", "rejected", "completed"].includes(status)) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const updateFields = {};

  if (role === "sm") {
    updateFields.smStatus = status;
  } else if (role === "gm") {
    updateFields.gmStatus = status;
  } else if (role === "admin") {
    const csr = await CSRform.findById(csrId);
    if (csr.smStatus !== "approved" || csr.gmStatus !== "approved") {
      return NextResponse.json({ message: "Cannot complete. SM and GM must approve first." }, { status: 400 });
    }
    updateFields.adminStatus = "completed";
  }

  const csr = await CSRform.findByIdAndUpdate(csrId, updateFields, { new: true });

  return NextResponse.json({ message: "Status updated successfully", csr });
}
