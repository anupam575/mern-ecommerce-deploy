// utils/sendToken.js
import { generateAccessToken, generateRefreshToken } from "../models/userModel.js";
import { formatUser } from "../utils/formatUser.js";

/**
 * Send JWT tokens in secure cookies
 */
const sendToken = (user, statusCode, res, message = "Operation successful") => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // ✅ Cross-origin ke liye hamesha secure cookies use kar
  const accessOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    httpOnly: true,
    path: "/",
    secure: true,      // 🔥 Always true (Render is HTTPS)
    sameSite: "None",  // 🔥 Required for Vercel <-> Render cross-domain
  };

  const refreshOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "None",
  };

  const safeUser = formatUser(user);

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

