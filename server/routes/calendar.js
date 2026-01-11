// routes/user.js
import express from "express";
import Calendar from "../models/Calendar.js";
import Authenticator from "../controllers/Authenticator.js";

const router = express.Router();

router.post("/create", Authenticator.authMiddleware, async (req, res) => {
  try {
    const { name, description, tasks } = req.body;
    console.log(name, description, tasks);
    const calendar = new Calendar({
      name,
      description,
      tasks
    });
    await calendar.save();
    res.status(201).json({ message: "Calendar created", calendar });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/calendar -> return most recent calendar
router.get("/", async (req, res) => {
  try {
    const recentCalendar = await Calendar.findOne().sort({ createdAt: -1 });
    // Return null if no calendar exists
    res.json(recentCalendar || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/calendar/:id -> return calendar by id
router.get("/:id", async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    if (!calendar) return res.status(404).json({ error: "Calendar not found" });
    res.json(calendar);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/calendars -> return all calendar names
router.get("/all/names", async (req, res) => {
  try {
    const calendars = await Calendar.find({}, { name: 1 }); // only return name
    res.json(calendars);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// routes/calendar.js
router.delete("/:id", Authenticator.authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const calendar = await Calendar.findById(id);
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
