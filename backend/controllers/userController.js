import User from "../models/user.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "student" }).select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
