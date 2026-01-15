import mongoose from "mongoose";

const dailyEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true }, 
  completedTasks: { type: Array, default: [] }, 
  notes: { type: String, default: "" }, 
});

const calendarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  tasks: Object,
  progress: {
    type: Map,
    of: [Number], 
    default: {},
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
  }
});

export default mongoose.model("Calendar", calendarSchema);
