// utils/sendToken.js
import { generateAccessToken, generateRefreshToken } from "../models/userModel.js";
import { formatUser } from "../utils/formatUser.js";

const sendToken = (user, statusCode, res, message = "Operation successful") => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const isProd = process.env.NODE_ENV === "production";

  // Access token cookie (15 mins)
  const accessOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/", // access token हर जगह भेजा जाएगा
  };

  // Refresh token cookie (7 days)
  const refreshOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/api/v1/refresh-token", // ✅ सिर्फ refresh endpoint पर भेजा जाएगा
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
