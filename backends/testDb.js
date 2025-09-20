import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

const dbUrl = process.env.DB_URI;

async function testConnection() {
  try {
    // Options hata diye
    await mongoose.connect(dbUrl);
    console.log("✅ MongoDB connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

testConnection();
