const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const faker = require("@faker-js/faker").faker; // Ensure correct faker import
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI 

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

async function generateVehicles(count = 10) {
  return Array.from({ length: count }).map(() => ({
    licenseNumber: faker.string.alphanumeric(10).toUpperCase(),
    ownerName: faker.person.fullName(),
    ownerContact: faker.phone.number(),
    vehicleType: faker.vehicle.type(),
    model: faker.vehicle.model(),
    color: faker.color.human(),
    registrationDate: faker.date.past(),
    gpsLocation: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
    user: new mongoose.Types.ObjectId(), // Placeholder user ID
  }));
}

async function seedDatabase() {
  try {
    console.log("🚀 Seeding started...");

    // Ensure connection is complete before proceeding
    await connectDB();

    console.log("🗑️ Deleting old vehicle data...");
    await Vehicle.deleteMany({}); // Fix timeout issue by ensuring connection first

    const vehicles = await generateVehicles(50); // Generate 50 fake vehicle records
    await Vehicle.insertMany(vehicles);
    
    console.log("✅ Seeding successful!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    mongoose.connection.close();
  }
}

// Run the seeding function
seedDatabase();
