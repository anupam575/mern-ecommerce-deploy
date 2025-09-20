import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";

// ✅ Authentication Middleware
export const isAuthenticatedUser = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Bearer token in headers
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2️⃣ Else check accessToken in cookies
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 3️⃣ No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    try {
      // ✅ Verify Access Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      req.user = user;
      return next();
    } catch (err) {
      // 🔄 Access token expired → check refresh token
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again",
        });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedRefresh.id).select("-password");
        if (!user) throw new Error("User not found");

        // 🔄 Generate new tokens and attach user
        sendToken(user, 200, res);
        req.user = user;
        return next();
      } catch (refreshErr) {
        return res.status(403).json({
          success: false,
          message: "Invalid refresh token. Please login again",
        });
      }
    }
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Role Authorization Middleware
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
