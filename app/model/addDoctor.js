import mongoose from "mongoose";
const addDoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qualification: { type: String, required: true },
    designation: { type: String },
    speciality: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String },
    brick: { type: String, required: true },
    group: { type: String, required: true },
    zone: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    investmentLastYear: {
      type: Number,
    },
    email: { type: String },
    contact: { type: String },
    totalValue: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Doctor ||
  mongoose.model("Doctor", addDoctorSchema);
