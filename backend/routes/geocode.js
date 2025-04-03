// routes/geocode.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/geocode/reverse?lat=...&lon=...
router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        format: 'json',
        lat,
        lon
      },
      headers: {
        'User-Agent': 'YourAppName/1.0 (your@email.com)' // Required by Nominatim's policy
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Nominatim error:", error.message);
    res.status(500).json({ message: "Failed to fetch address", error: error.message });
  }
});

module.exports = router;
