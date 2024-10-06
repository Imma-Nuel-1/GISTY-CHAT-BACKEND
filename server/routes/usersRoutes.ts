import mongoose from "mongoose";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import jwt
import User from "../models/usermodels";

const router = express.Router();

// Helper function to generate JWT
const generateToken = (userId: mongoose.Types.ObjectId): string => {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET as string, {
    expiresIn: "1h", // Token will expire in 1 hour
  });
};

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, profilePic } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id as mongoose.Types.ObjectId);

    res.status(201).json({
      success: true, // Add success field
      message: "User registered successfully",
      token, // Send token with the response
      user: { ...user.toObject(), password: undefined }, // Omit the password from the response
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ success: false, message: errorMessage });
  }
});

// Login a user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user._id as mongoose.Types.ObjectId);

    // Login successful, omit password from response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Send token with the response
      user: { ...user.toObject(), password: undefined }, // Omit the password from the response
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ success: false, message: errorMessage });
  }
});

// Get user by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: errorMessage });
  }
});

// Update user by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: errorMessage });
  }
});

// Delete user by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: errorMessage });
  }
});

export default router;
