// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";

// ✅ dirname setup (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== Deploy fix: trust proxy =====
app.set("trust proxy", 1); // Needed for Render/Vercel secure cookies

// ✅ Load environment variables
dotenv.config({ path: path.join(__dirname, "config/config.env") });
console.log("🔍 DEBUG: Loaded ENV");
console.log("  NODE_ENV:", process.env.NODE_ENV);
console.log("  FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("  PORT:", process.env.PORT);
console.log("  DB_URI (masked):", process.env.DB_URI ? "✅ Loaded" : "❌ Missing");
console.log("  JWT_SECRET (masked):", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("  REFRESH_TOKEN_SECRET (masked):", process.env.REFRESH_TOKEN_SECRET ? "✅ Loaded" : "❌ Missing");

// ===== Security Middlewares =====
app.use(helmet());

// ===== Rate limiting =====
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// ===== CORS =====
console.log("🔍 DEBUG: Applying CORS with origin:", process.env.FRONTEND_URL);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // allow cookies
  })
);

// ===== Debug middleware for cookies & headers =====
app.use((req, res, next) => {
  console.log("🔍 DEBUG: Incoming Request");
  console.log("  URL:", req.originalUrl);
  console.log("  Method:", req.method);
  console.log("  Origin Header:", req.headers.origin);
  console.log("  Cookies:", req.cookies);
  console.log("  Authorization:", req.headers.authorization || "❌ No Auth Header");
  next();
});

// ===== Body parsers =====
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== Routes =====
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

// ===== Serve frontend in production =====
if (process.env.NODE_ENV === "production") {
  console.log("🔍 DEBUG: Serving frontend build");
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    console.log("🔍 DEBUG: Serving index.html for route:", req.originalUrl);
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// ===== Global error handler (optional) =====
app.use((err, req, res, next) => {
  console.error("❌ Global Error Handler:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;

