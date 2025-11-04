import jwt from "jsonwebtoken"; // ✅ Make sure this is imported
import User from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js"; // अगर sendEmail function u


export const refreshToken = async (req, res) => {
  try {
    console.log("♻️ Refresh Token route hit"); // <--- ADD THIS

    const refreshToken = req.cookies?.refreshToken;
    console.log("🍪 Incoming refresh token:", refreshToken ? "Present ✅" : "Missing ❌");

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      console.log("🔐 Refresh token decoded:", decoded);
    } catch (err) {
      console.log("❌ Invalid or expired refresh token");
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("⚠️ User not found in DB");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("✅ Generating new tokens for:", user.email);
    sendToken(user, 200, res);
  } catch (err) {
    console.error("💥 Refresh token error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Generate Cloudinary signature
export const getUploadSignature = (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp, folder: "avatars" },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: "avatars",
    });
  } catch (err) {
    console.error("❌ Signature Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Backend Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password, // hashed automatically via User model pre-save hook
      avatar: avatar
        ? { url: avatar.url, public_id: avatar.public_id }
        : {
            url: "https://via.placeholder.com/150?text=No+Avatar",
            public_id: null,
          },
    });

    // Send JWT token with custom message
    sendToken(user, 201, res, "Registration successful");
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, avatar } = req.body;

//     // 🧩 1️⃣ Basic Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // 🧩 2️⃣ Check Existing User
//     const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     // 🧩 3️⃣ Create New User Instance (Not saved yet)
//     const user = new User({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       password, // Pre-save hook will hash this
//       avatar: {
//         url: "https://via.placeholder.com/150?text=No+Avatar",
//         public_id: null,
//       },
//     });

//     // 🧩 4️⃣ Avatar Upload (Optional)
//     if (avatar && avatar.url) {
//       try {
//         const uploadResult = await cloudinary.v2.uploader.upload(avatar.url, {
//           folder: "avatars",
//           width: 150,
//           crop: "scale",
//         });

//         user.avatar = {
//           url: uploadResult.secure_url,
//           public_id: uploadResult.public_id,
//         };
//       } catch (uploadErr) {
//         console.error("⚠️ Cloudinary Upload Failed:", uploadErr.message);
//       }
//     }

//     // 🧩 5️⃣ Extra Features (for production-level logic)
//     user.name = user.name.replace(/\s+/g, " "); // Remove double spaces
//     user.createdAt = new Date();
//     user.isVerified = false; // Default: user not verified
//     user.role = "user"; // Default role

//     // 🧩 6️⃣ Save User to Database
//     await user.save();

//     // 🧩 7️⃣ Send Token (JWT + Cookie)
//     sendToken(user, 201, res, "Registration successful");

//   } catch (err) {
//     console.error("❌ Register Error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error, please try again later",
//     });
//   }
// };

// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, avatar } = req.body;

//     // Backend Validation
//     if (!name || !email || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields required" });
//     }

//     // ✅ New Method: Declare once, assign conditionally
//     let user = await User.findOne({ email: email.toLowerCase().trim() });

//     if (!user) {
//       user = await User.create({
//         name,
//         email: email.toLowerCase().trim(),
//         password, // hashed automatically via User model pre-save hook
//         avatar: avatar
//           ? { url: avatar.url, public_id: avatar.public_id }
//           : { url: "https://via.placeholder.com/150?text=No+Avatar", public_id: null },
//       });
//     } else {
//       // ❌ Old Method (commented)
//       /*
//       const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
//       if (existingUser) {
//         return res
//           .status(400)
//           .json({ success: false, message: "User already exists" });
//       }
//       */
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }

//     // Send JWT token with custom message
//     sendToken(user, 201, res, "Registration successful");
//   } catch (err) {
//     console.error("❌ Register Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter Email & Password" });
    }

    // Find user with password
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Send JWT token with custom message
    sendToken(user, 200, res, "Login successful");
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// controllers/authController.js
export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    // ✅ Access token clear
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/", // ensure cookie is removed from all routes
    });

    // ✅ Refresh token clear
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
    });

    // (Optional) अगर refresh token DB में store करते हो तो यहाँ remove कर सकते हो
    // await Token.deleteOne({ userId: req.user._id });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("❌ Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Logout failed. Please try again.",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
      res
        .status(200)
        .json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
          resetToken,
        });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Reset Password Token is invalid or has expired",
        });
    }

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide both passwords" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User Details
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role createdAt avatar"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    sendToken(user, 200, res);
  } catch (err) {
    console.error("❌ Get User Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body; // avatar = { url, public_id }

    // ✅ Auth middleware से req.user.id आना चाहिए
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ✅ Email update check (case insensitive)
    if (email && email.toLowerCase().trim() !== user.email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase().trim(),
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
      user.email = email.toLowerCase().trim();
    }

    // ✅ Name update
    if (name) user.name = name.trim();

    // ✅ Avatar update
    if (avatar && avatar.url && avatar.public_id) {
      // पुराना avatar delete करो अगर है तो
      if (user.avatar?.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        } catch (err) {
          console.warn("⚠️ Failed to delete old avatar:", err.message);
        }
      }
      user.avatar = { url: avatar.url, public_id: avatar.public_id };
    }

    await user.save();

    // ✅ Success response (अगर JWT payload में info है तो नया token भेजो)
    sendToken(user, 200, res, "Profile updated successfully");
  } catch (err) {
    console.error("❌ UpdateProfile Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

// Get Single User
export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: `User does not exist with Id: ${req.params.id}`,
        });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update
// Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Users
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete User --Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User does not exist with Id: ${req.params.id}`,
      });
    }

    const imageId = user.avatar?.public_id;

    // Cloudinary image delete (अगर avatar है तभी)
    if (imageId) {
      await cloudinary.v2.uploader.destroy(imageId);
    }

    // ✅ MongoDB user delete
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
