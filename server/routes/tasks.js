import express from "express";
import Calendar from "../models/Calendar.js";
import Authenticator from "../controllers/Authenticator.js";

const router = express.Router();

const dateKeyToDOWT = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    // return in form of 0 (Sun) to 6 (Sat)
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
};

const toggleTask = (calendar, dateKey, taskIndex) => {
    const completed = new Set(calendar.progress.get(dateKey) || []);
    if (completed.has(taskIndex)) completed.delete(taskIndex);
    else completed.add(taskIndex);

    calendar.progress.set(dateKey, Array.from(completed));
    return completed.size;
};

router.post("/toggle", Authenticator.authMiddleware, async (req, res) => {
  try {
    const { calendarId, index, dateKey } = req.body;

    if (index === undefined || dateKey === undefined) {
      return res.status(400).json({ error: "Missing index or dateKey" });
    }

    const calendar = await Calendar.findById(calendarId);
    if (!calendar) {
      return res.status(404).json({ error: "Calendar not found" });
    }

    // Validate index
    if (index < 0) {
      return res.status(400).json({ error: "Invalid task index" });
    }

    // Toggle task
    const completedCount = toggleTask(calendar, dateKey, index);

    // Save to DB
    await calendar.save();

    // Compute % progress for the day
    const totalTasks = calendar.tasks[dateKeyToDOWT(dateKey)].length;
    const progressPercent = totalTasks > 0 ? completedCount / totalTasks : 0;

    res.status(200).json({
      message: "Task toggled",
      completedIndices: calendar.progress.get(dateKey),
      progressPercent, // 0 to 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
