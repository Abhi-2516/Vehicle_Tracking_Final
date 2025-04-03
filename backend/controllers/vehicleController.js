const Vehicle = require("../models/Vehicle");

// Register Vehicle
exports.registerVehicle = async (req, res) => {
    try {
      console.log("Incoming vehicle registration request");
      console.log("User ID from token:", req.userId);
      console.log("Vehicle data:", req.body);
  
      const { licenseNumber, ownerName, ownerContact, type, location } = req.body;
  
      const vehicle = new Vehicle({
        user: req.userId,
        licenseNumber,
        ownerName,
        ownerContact,
        type,
        location
      });
  
      await vehicle.save();
      res.status(201).json({ success: true, vehicle });
    } catch (err) {
      console.error("Vehicle registration error:", err.message);
      res.status(500).json({ success: false, msg: "Vehicle registration failed", error: err.message });
    }
  };
  

// Get all vehicles for user
exports.getVehicles = async (req, res) => {
    try {
      const vehicles = await Vehicle.find({ user: req.userId });
      console.log("Fetched vehicles:", vehicles); // Add this line
      res.json(vehicles);
    } catch (err) {
      console.error("Fetch vehicles error:", err.message);
      res.status(500).json({ msg: "Failed to fetch vehicles" });
    }
  };
  

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ success: false, msg: "Vehicle not found" });
    res.json({ success: true, vehicle });
  } catch (err) {
    console.error("Update vehicle error:", err.message);
    res.status(500).json({ success: false, msg: "Update failed" });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!vehicle) return res.status(404).json({ success: false, msg: "Vehicle not found" });
    res.json({ success: true, msg: "Vehicle deleted" });
  } catch (err) {
    console.error("Delete vehicle error:", err.message);
    res.status(500).json({ success: false, msg: "Delete failed" });
  }
};

