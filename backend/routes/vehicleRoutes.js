const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Vehicle = require("../models/Vehicle");
const {
  registerVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

// ✅ Register a vehicle
router.post("/", auth, registerVehicle);

// ✅ Get all vehicles with pagination
router.get("/", auth, async (req, res) => {
  try {
    let { limit, cursor } = req.query;
    limit = parseInt(limit) || 10;

    const query = cursor ? { _id: { $gt: cursor } } : {};

    const vehicles = await Vehicle.find(query).sort({ _id: 1 }).limit(limit).exec();

    const nextCursor = vehicles.length > 0 ? vehicles[vehicles.length - 1]._id : null;

    res.json({
      vehicles,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update vehicle details
router.put("/:id", auth, updateVehicle);

// ✅ Delete a vehicle
router.delete("/:id", auth, deleteVehicle);

// ✅ Update vehicle location
router.put("/:id/location", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { location: { latitude, longitude } },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Location updated successfully", vehicle });
  } catch (error) {
    console.error("Error updating location:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get total distance traveled per vehicle
router.get("/distance", auth, async (req, res) => {
  try {
    const distanceData = await Vehicle.aggregate([
      {
        $group: {
          _id: "$_id",
          totalDistance: { $sum: "$distance" }, // Ensure 'distance' field exists in DB
        },
      },
      { $sort: { totalDistance: -1 } },
    ]);

    res.json(distanceData);
  } catch (error) {
    console.error("Error fetching distance data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get top 10 vehicles by distance traveled
router.get("/top", auth, async (req, res) => {
  try {
    const topVehicles = await Vehicle.aggregate([
      {
        $group: {
          _id: "$_id",
          totalDistance: { $sum: "$distance" },
        },
      },
      { $sort: { totalDistance: -1 } },
      { $limit: 10 },
    ]);

    res.json(topVehicles);
  } catch (error) {
    console.error("Error fetching top vehicles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
