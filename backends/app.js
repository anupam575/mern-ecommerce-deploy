import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();

// ✅ Load environment variables
dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
console.log("✅ FRONTEND_URL Loaded:", FRONTEND_URL);

// ✅ CORS configuration (Render + Vercel compatible)
app.use(
  cors({
    origin: [FRONTEND_URL, "https://mern-ecommerce-deploy-6iq35bal8-anupam3.vercel.app"], // ✅ allow both
    credentials: true, // ✅ allow cookies across origins
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes
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

// ✅ Optional sanity check route (to verify deploy CORS)
app.get("/", (req, res) => {
  res.send("✅ Backend running and CORS configured correctly!");
});

export default app;


