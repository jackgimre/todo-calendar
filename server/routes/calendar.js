// routes/user.js
import express from "express";
import Calendar from "../models/Calendar.js";
import User from "../models/User.js";
import Authenticator from "../controllers/Authenticator.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/create", Authenticator.authMiddleware, async (req, res) => {
  console.log('hi');
  try {
    const { name, description, tasks } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Calendar name is required" });
    }

    // Create calendar
    const calendar = new Calendar({
      name,
      description: description || "",
      tasks: tasks
    });

    await calendar.save();

    // Link calendar to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { calendars: calendar._id }
    });

    // Return full calendar object
    res.status(201).json({
      message: "Calendar created",
      calendar
    });
  } catch (err) {
    console.error("Error creating calendar:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/calendar -> return most recent calendar
router.get("/", Authenticator.authMiddleware, async (req, res) => {
  try {
    const recentCalendar = req.user.calendars.sort({ createdAt: -1 });
    // Return null if no calendar exists
    res.json(recentCalendar || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/calendar/:id -> return calendar by id
router.get("/id/:id", Authenticator.authMiddleware, async (req, res) => {
  const { id } = req.params;
  console.log('Id:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid calendar ID" });
  }

  try {
    const user = await req.user.populate("calendars");
    const calendar = user.calendars.find(c => c._id.toString() === id);

    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found" });
    }

    res.status(200).json(calendar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// GET /api/calendars -> return all calendar names

router.get("/calendars", Authenticator.authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "User not found" });

    // req.user.calendars is an array of ObjectIds
    // Fetch full calendar documents
    const calendars = await Calendar.find({
      _id: { $in: req.user.calendars.filter(id => mongoose.Types.ObjectId.isValid(id)) }
    });
    console.log(calendars);
    // Optional: only send certain fields
    const sanitized = calendars.map(c => ({
      id: c._id.toString(),
      name: c.name,
      description: c.description,
      tasks: c.tasks,
    }));
    console.log(sanitized);
    res.json(sanitized);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all/ids", Authenticator.authMiddleware, async (req, res) => {
    try {
      const ids = req.user.calendars.map(c => c._id);
      res.json(ids);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    }
});

// routes/calendar.js
router.delete("/id/:id", Authenticator.authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const calendar = req.user.calendars.find(c => c._id.toString() === id);
    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found" });
    }

    await Calendar.findByIdAndDelete(id);

    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
