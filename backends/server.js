import app from "./app.js";
import cloudinary from "cloudinary";
import connectDatabase from "./config/database.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDatabase(); // Async/await ensures DB connected before server starts
    console.log("✅ Database connected");

    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.log(`Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error(`❌ Startup Error: ${err.message}`);
    process.exit(1);
  }
};

startServer();
