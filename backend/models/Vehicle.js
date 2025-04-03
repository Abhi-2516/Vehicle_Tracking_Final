const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerContact: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Car", "Bike", "Truck", "Bus", "Other"],
    default: "Other",
  },
  location: {
    latitude: Number,
    longitude: Number,
    manual: Boolean, // true if manually entered
  },
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
