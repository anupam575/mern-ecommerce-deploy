import { generateAccessToken, generateRefreshToken } from "../models/userModel.js";
import { formatUser } from "../utils/formatUser.js";

const sendToken = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = (expiresIn) => ({
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });

  const accessOptions = cookieOptions( 15 * 60 * 1000); // 15 mins
  const refreshOptions = cookieOptions(7 * 24 * 60 * 60 * 1000); // 7 days

  const safeuser = formatUser(user);

  res
    .status(statusCode)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json({
      success: true,
      user: safeuser,
    });
};

export default sendToken; // ✅ यह लाइन जरूरी है
