import { generateAccessToken, generateRefreshToken } from "../models/userModel.js";
import { formatUser } from "../utils/formatUser.js";

/**
 * Send JWT tokens to the client in cookies (cross-origin ready)
 */
const sendToken = (user, statusCode, res, message = "Operation successful") => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // ✅ Always cross-origin ready
  const cookieOptions = (expiresIn) => ({
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,
    secure: true,        // HTTPS required
    sameSite: "None",    // cross-origin
    path: "/",
  });

  const accessOptions = cookieOptions(15 * 60 * 1000); // 15 mins
  const refreshOptions = cookieOptions(7 * 24 * 60 * 60 * 1000); // 7 days

  const safeUser = formatUser(user);

  res
    .status(statusCode)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json({ success: true, message, user: safeUser });
};

export default sendToken;



