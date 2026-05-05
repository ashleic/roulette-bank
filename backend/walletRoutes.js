const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const router = express.Router();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("Invalid token:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

router.put("/connect-wallet", authMiddleware, async (req, res) => {
  try {
    console.log("HIT CONNECT WALLET ROUTE");
    console.log("User ID:", req.userId);
    console.log("Wallet received:", req.body.walletAddress);

    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { walletAddress },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("UPDATED USER:", updatedUser);

    res.json({
      message: "Wallet saved successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Wallet save error:", error);
    res.status(500).json({ message: "Server error saving wallet" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log("HIT GET WALLET USER ROUTE");
    console.log("User ID:", req.userId);

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Load user error:", error);
    res.status(500).json({ message: "Server error loading user" });
  }
});

module.exports = router;