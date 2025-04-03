// routes/distance.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Vehicle = require('../models/Vehicle');
require('dotenv').config(); // Ensure environment variables are loaded

router.get('/distance/:id1/:id2', async (req, res) => {
  try {
    const { id1, id2 } = req.params;

    // 1. Fetch vehicles from DB
    const vehicle1 = await Vehicle.findById(id1);
    const vehicle2 = await Vehicle.findById(id2);

    if (!vehicle1 || !vehicle2) {
      return res.status(404).json({ message: 'One or both vehicles not found' });
    }

    const origin = `${vehicle1.location.latitude},${vehicle1.location.longitude}`;
    const destination = `${vehicle2.location.latitude},${vehicle2.location.longitude}`;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Google Maps API key is missing' });
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    console.log("🌍 Google Distance Matrix URL:", url); // Debug log

    // 2. Make API call to Google
    const response = await axios.get(url);

    console.log("📦 Google API raw response:", response.data); // Full response for debugging

    if (
      response.data.status !== "OK" ||
      response.data.rows[0].elements[0].status !== "OK"
    ) {
      console.error("❌ Google API error:", response.data);
      return res.status(500).json({
        message: 'Google API returned error',
        details: response.data
      });
    }

    // 3. Extract data
    const distance = response.data.rows[0].elements[0].distance.text;
    const duration = response.data.rows[0].elements[0].duration.text;

    // 4. Send final response
    res.json({
      from: vehicle1.licenseNumber,
      to: vehicle2.licenseNumber,
      distance,
      estimatedTime: duration
    });

  } catch (error) {
    console.error("❗ Distance API error:", error);
    res.status(500).json({
      message: 'Error calculating distance',
      error: error.message
    });
  }
});



module.exports = router;
