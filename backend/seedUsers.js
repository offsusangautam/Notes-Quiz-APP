import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const createUsers = async () => {
  try {
    // Remove existing users with same emails to avoid duplicate key errors
    await User.deleteMany({ email: { $in: ["admin@example.com", "user@example.com"] } });

    const admin = new User({
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: "admin123",
      grade: 12,
      stream: "Science",
      role: "admin",
    });

    const user = new User({
      name: "Normal User",
      email: "user@example.com",
      passwordHash: "user123",
      grade: 10,
      stream: "Management",
      role: "student",
    });

    await admin.save();
    await user.save();

    console.log("Users created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB().then(createUsers);
