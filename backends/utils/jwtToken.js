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

  // ✅ Cookie options (deploy safe)
  const cookieOptions = (expiresIn) => ({
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,   // JS cannot access
    secure: true,     // ✅ must be true for HTTPS deploy
    sameSite: "None", // ✅ cross-origin cookie allowed
    path: "/",        // cookie available to all routes
  });

  const accessOptions = cookieOptions(15 * 60 * 1000);        // 15 minutes
  const refreshOptions = cookieOptions(7 * 24 * 60 * 60 * 1000); // 7 days

  const safeUser = formatUser(user); // remove sensitive fields

  // ✅ Send tokens as cookies + JSON response
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





