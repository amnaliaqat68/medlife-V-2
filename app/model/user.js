import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "superAdmin", "dsm", "sm", "gm"],
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },
    group: {
      type: String,
      required: function () {
        return ["dsm", "sm"].includes(this.role);
      },
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: function () {
        return ["dsm", "sm"].includes(this.role);
      },
    },
    area: {
      type: String,
      required: function () {
        return ["dsm", "sm"].includes(this.role);
      },
    },
    designation: {
      type: String,
      required: function () {
        return ["dsm", "sm"].includes(this.role);
      },
    },
    
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
