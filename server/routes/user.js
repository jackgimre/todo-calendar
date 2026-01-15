// routes/user.js
import express from "express";
import User from "../models/User.js";
import Calendar from "../models/Calendar.js";
import Authenticator from "../controllers/Authenticator.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/me", Authenticator.authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash"); 
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me/calendars", Authenticator.authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "User not found" });

    // req.user.calendars is an array of ObjectIds
    // Fetch full calendar documents
    const calendars = await Calendar.find({
      _id: { $in: req.user.calendars.filter(id => mongoose.Types.ObjectId.isValid(id)) }
    });
    // Optional: only send certain fields
    const sanitized = calendars.map(c => ({
      id: c._id.toString(),
      name: c.name,
      description: c.description,
      tasks: c.tasks,
    }));

    res.json(sanitized);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
