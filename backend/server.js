require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const walletRoutes = require("./walletRoutes"); // ✅ ONLY DECLARE ONCE

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// AUTH ROUTES (KEEPING YOUR ORIGINAL LOGIC)
// =========================

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    console.log("Signup route hit");
    console.log(req.body);

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: name,
      email,
      password: hashedPassword,
    });

    await user.save();

    console.log("User created:", user._id);

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    console.log("Login route hit");

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

// =========================
// WALLET ROUTES (NEW)
// =========================

app.use("/api/wallet", walletRoutes);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("Roulette Bank API is running...");
});

// =========================
// DATABASE + SERVER START
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(8080, () => {
      console.log("Server running on http://localhost:8080");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });