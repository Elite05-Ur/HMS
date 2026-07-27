const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }, // Auth account
    name: { type: String, required: true },
    specialty: { type: String, required: true }, // e.g. Cardiology
    roomNo: { type: String, required: true }, // e.g. OPD Room 102
    fee: { type: Number, required: true }, // Consultation Fee
    timing: { type: String, default: "09:00 AM - 02:00 PM" },
    status: {
      type: String,
      enum: ["Available", "In OPD", "On Leave"],
      default: "Available",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Doctor", doctorSchema);
