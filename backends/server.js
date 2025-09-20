
import app from "./app.js";
import cloudinary from "cloudinary";
import connectDatabase from "./config/database.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

// ✅ Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

const startServer = async () => {
  try {
    // ✅ Connect to MongoDB
    await connectDatabase();
    console.log("✅ Database connected");

    // ✅ Configure Cloudinary
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // ✅ Start server
    const PORT = process.env.PORT || 4000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Primary URL: ${process.env.FRONTEND_URL}`);
    });

    // ✅ Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error(`❌ Startup Error: ${err.message}`);
    process.exit(1);
  }
};

startServer();
