// utils/sendToken.js
import { generateAccessToken, generateRefreshToken } from "../models/userModel.js";
import { formatUser } from "../utils/formatUser.js";

/**
 * Send JWT tokens to the client in cookies (cross-origin ready for local + deploy)
 * @param {Object} user - Mongoose user document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 * @param {string} message - Optional message
 */
const sendToken = (user, statusCode, res, message = "Operation successful") => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // ✅ Detect environment
  const isProduction = process.env.NODE_ENV === "production";

  // ✅ Cookie options
  const cookieOptions = (expiresIn) => ({
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,
    secure: isProduction,               // HTTPS only in production
    sameSite: isProduction ? "None" : "Lax", // cross-origin in prod, lax in dev
    path: "/",
  });

  const accessOptions = cookieOptions(15 * 60 * 1000);        // 15 mins
  const refreshOptions = cookieOptions(7 * 24 * 60 * 60 * 1000); // 7 days

  const safeUser = formatUser(user); // sanitize user data

  // ✅ Set cookies and return JSON
  res
    .status(statusCode)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json({ success: true, message, user: safeUser });
};

export default sendToken;


