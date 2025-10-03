import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();

// Load environment variables
dotenv.config();
console.log("✅ FRONTEND_URL Loaded:", process.env.FRONTEND_URL);

// Determine if production
const isProduction = process.env.NODE_ENV === "production";

// CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // deployed frontend URL
    credentials: true,               // allow cookies
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
import productRoutes from "./routes/productRoute.js";
import userRoutes from "./routes/userRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", categoryRoutes);

export default app;


