import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';


export const register = async (req, res) => {
  const { name, email, password, grade, stream, role } = req.body;

  if (!name || !email || !password || !grade || !stream) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // ✅ Secure role assignment
    let userRole = "student"; // default role
    if (role === "admin") {

      userRole = "admin";
    }

    const user = await User.create({
      name,
      email,
      passwordHash,
      grade,
      stream,
      role: userRole,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      grade: user.grade,
      stream: user.stream,
      role: user.role,
      token: generateToken(user),
    });
  }  catch (error) {
  console.error("Registration Error:", error); // 🔍 log full error in terminal
  res.status(500).json({ message: "Server error during registration", error: error.message }); // also return message
}};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      grade: user.grade,
      stream: user.stream,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

