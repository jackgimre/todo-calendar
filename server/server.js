import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import calendarRoutes from "./routes/calendar.js";
import tasksRoutes from "./routes/tasks.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();

const isProd = process.env.NODE_ENV === "production";
let clientURL = isProd
  ? 'https://todo-calendar-plum-kappa.vercel.app'
  : 'http://localhost:3000';
let serverURL = isProd
  ? 'https://todo-calendar-l2tb.onrender.com'
  : 'http://localhost:4000';

app.use(cors({
  origin: [clientURL, serverURL].map(url => url.replace(/\/$/, "")),
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
} catch (err) {
  console.error("MongoDB connection error:", err);
}

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/tasks", tasksRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "API is working" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
