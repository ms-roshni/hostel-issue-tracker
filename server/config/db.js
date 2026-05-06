const mongoose = require("mongoose");

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    console.log("Using cached MongoDB connection");
    return cachedDb;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedDb = conn;
    console.log("MongoDB connected ✅");
    return conn;
  } catch (error) {
    console.error("DB connection error:", error);
    // In serverless, don't exit the process as it kills the Lambda container
    // Let it throw so the request fails cleanly
    throw error;
  }
};

module.exports = connectDB;