// middlewares/auth.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Middleware to authenticate user using cookie or Authorization header
 */
export const isAuthenticatedUser = async (req, res, next) => {
  try {
    let token;

    // ✅ Prefer cookie first (HttpOnly cookie)
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } 
    // ✅ Fallback to Authorization header if cookie not found
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Token expired or invalid. Please login again.",
    });
  }
};

/**
 * Middleware to authorize roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role: ${req.user.role} is not allowed to access this resource`,
      });
    }

    next();
  };
};
