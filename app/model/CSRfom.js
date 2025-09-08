import mongoose from "mongoose";
import User from "./user";
import addDoctor from "./addDoctor";
const productSchema = new mongoose.Schema({
  product: { type: String, required: true },
  strength: { type: String, required: true },
  presentUnits: { type: Number, required: true },
  expectedUnits: { type: Number, required: true },
  additionUnits: { type: Number, required: true },
});
const chemistSchema = new mongoose.Schema({
  chemistName: { type: String, required: true },
  businessShare: { type: Number, required: true },
  otherDoctors: { type: String },
});
const ledgerSchema = new mongoose.Schema({
  month: { type: String, required: true },
  sale: { type: Number, required: true },
});
const BusinessValueSchema = new mongoose.Schema({
  byHo: { type: String },
  businessPeriod: { type: Number },
  expectedTotalBusiness: { type: Number },
  businessValuePresent: { type: Number },
  businessValueExpected: { type: Number },
  businessValueAddition: { type: Number },
  roi: { type: Number },
  exactCost: { type: Number },
  requiredDate: { type: Date },
  investmentLastYear: { type: Number },
  itemRequested: { type: String },
});
const CSRformschema = new mongoose.Schema(
  {
    filledBy: { type: String, required: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    csrNumber: { type: Number },
    executedBy: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
    },

    role: { type: String, enum: ["admin", "user", "dsm", "gm"] },

    executeDate: {
      type: Date,
      required: function () {
        return this.role === "admin";
      },
    },
    particulars: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
    },

    smStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    gmStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminStatus: {
      type: String,

      enum: ["completed", "pending", "rejected"],
      default: "pending",
    },
    approvedBy: {
      sm: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      gm: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },

    groupOfFE: { type: String },
    patientsMorning: { type: Number },
    patientsEvening: { type: Number },
    customerType: { type: String, enum: ["Existing", "New"], default: "New" },
    products: [productSchema],
    chemists: [chemistSchema],
    Business: [BusinessValueSchema],
    ledgerSummary: [ledgerSchema],
    investmentInstructions: { type: String },
    comments: { type: String },
    filePath: { type: String },
  },
  { timestamps: true }
);
export default mongoose.models.CSRform ||
  mongoose.model("CSRform", CSRformschema);
