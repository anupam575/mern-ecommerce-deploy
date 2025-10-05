import { generateAccessToken, generateRefreshToken } from "../models/userModel.js";
import { formatUser } from "../utils/formatUser.js";

/**
 * Send JWT tokens to the client in cookies (cross-origin ready for Render + Vercel)
 * @param {Object} user - Mongoose user document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 * @param {string} message - Optional message for frontend toast
 */
const sendToken = (user, statusCode, res, message = "Operation successful") => {
  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Detect environment
  const isProduction = process.env.NODE_ENV === "production";

  // ✅ Access token cookie options (15 mins)
  const accessOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,     // HTTPS required in production
    sameSite: isProduction ? "None" : "Lax", // None for cross-origin
    path: "/",
  };

  // ✅ Refresh token cookie options (7 days)
  const refreshOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  };

  // ✅ Sanitize user data (remove password, etc.)
  const safeUser = formatUser(user);

  // ✅ Set cookies + send JSON
  res
    .status(statusCode)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json({
      success: true,
      message,
      user: safeUser,
    });
};

export default sendToken;


