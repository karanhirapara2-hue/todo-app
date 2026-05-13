import jwt from 'jsonwebtoken';
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import * as userService from "../services/use.service.js";
import logger from "../config/logger.js"
import crypto from "crypto";
import User from "../models/user.model.js";
import {sendMail} from "../utils/mailService.js"
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
  //  console.log(email, password);        
    const user = await userService.findUser(email);
    if (!user) {
      return res.status(400).json(
        new ApiResponse(false, "Invalid credentials")
      );
    }
    const isMatch = await userService.comparePassword(password, user);
    if (!isMatch) {
      return res.status(400).json(
        new ApiResponse(false, "Invalid credentials")
      );
    }

    logger.info("User logged in", {
     type: "login", 
     userId: user._id       // ✅ only id is enough
    });

    // ✅ Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    

    // ✅ Set cookie
    res.cookie('token', token, {
      httpOnly: true, // 🔒 prevents JS access
      secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

   res.status(200).json(
  new ApiResponse(true, 'Login successful', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_banned:user.is_banned,
      access: user.access 
    }
  }));

  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

export const registerUser = async (req, res) => {
  try {
    
    const { name, email, password ,parentUser='69f1c7e7072238bd3255cfb5' ,role } = req.body;
  //  console.log(name, email, password);
    const existingUser = await userService.findUser(email);
  
    if (existingUser) {
      return res.status(400).json(
        new ApiResponse(false, 'User already exists')
      );
    }
  
  
    const user = parentUser
      ? await userService.createuser({ name, email, password, parentUser, role })
      : await userService.createuser({ name, email, password, role });

    logger.info("User registered", {
    type: "register", 
    userId: user.id,
    });

    res.status(201).json(
      new ApiResponse(true, 'User registered successfully', user)
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};
export const logoutUser = (req, res) => {
    // console.log('User logged out, token cookie cleared');
     const { userId } = req.params; 
     logger.info("User logout", {
    type: "activity", 
    userId: userId,
    });
  res.clearCookie('token');
  
  res.json(
    new ApiResponse(true, 'Logged out successfully')
  );
};

export const uploadPhoto = async(req, res) => {
  try {
    const { userId } = req.params;
    const filePath = req.file.path;
    
   
    const user = await userService.uploadPhoto(userId, filePath);

     logger.info("User uploadPhoto", {
    type: "activity", 
    userId: userId,
    });

    res.json(new ApiResponse(true, 'Photo uploaded successfully', user));

  } catch (err) {
    res.status(500).json({apiResponse: new ApiResponse(false, err.message) });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, name } = req.body;

   
    const updatedUser = await userService.updateUserDetails(req.user.id, {
      email,
      name
    });
    
  logger.info("User profile updated", {
  type: "business",       // ✅ correct type
  userId: req.user.id,    // ✅ safe to log
  updatedFields: ["email", "password", "profilePicture"]  // ✅ just field names, not values
  });
    
    res.json(
      new ApiResponse(true, 'User updated successfully', {
    ...updatedUser.toObject(),
    profilePicture: updatedUser.profilePicture.replace(/\\/g, "/")
  })
    );

  } catch (error) {
     console.error('Error updating user:', error.message);

    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // console.log(req.user);

    const user = await userService.getCurrentUserDetails(req.user.id);

    res.json(
      new ApiResponse(true, 'User fetched successfully', {
        ...user.toObject(),
        profilePicture: user.profilePicture
          ? user.profilePicture.replace(/\\/g, "/")
          : null
      })
    );

  } catch (error) {
    console.error('Error fetching user:', error.message);

    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user with that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

  res.status(200).json(new ApiResponse(true, "Reset link sent to your email"));

  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
   
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
const userCheck = await User.findOne({ resetPasswordToken: hashedToken });

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json(new ApiResponse(true, { message: "Password reset successful" }));

  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

export const setUserCredentialAdmin = async (req, res, next) => {
  try {
    const userId  = req.user.id;

    const { credentialMail, credentialPassword } = req.body;

    const user = await userService.setUserCredential(userId, credentialMail, credentialPassword);

    logger.info("User credential set", {
      type: "setCredential",
      userId: user.id,
    });

    res.status(200).json(
      new ApiResponse(true, "User credential set successfully", user)
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};