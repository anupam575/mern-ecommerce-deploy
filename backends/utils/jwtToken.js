// utils/sendToken.js
import { generateAccessToken, generateRefreshToken } from "../models/userModel.js";
import { formatUser } from "../utils/formatUser.js";

/**
 * Send JWT tokens to the client in secure cookies.
 * @param {Object} user - Mongoose user document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 * @param {string} message - Optional message for frontend toast
 */
const sendToken = (user, statusCode, res, message = "Operation successful") => {
  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const isProd = process.env.NODE_ENV === "production";

  // Access token cookie options (15 mins)
  const accessOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true, // JS cannot access cookie
    secure: isProd, // only HTTPS in production
    sameSite: isProd ? "None" : "Lax",
    path: "/",
  };

  // Refresh token cookie options (7 days)
  const refreshOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/",
  };

  // Remove sensitive fields from user
  const safeUser = formatUser(user);

  // Send response with cookies and message
  res
    .status(statusCode)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json({
      success: true,
      message, // Dynamic message
      user: safeUser,
    });
};

export default sendToken;
