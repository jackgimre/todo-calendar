// routes/user.js
import express from "express";
import User from "../models/User.js";
import Authenticator from "../controllers/Authenticator.js";

const router = express.Router();

router.get("/me", Authenticator.authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash"); 
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
