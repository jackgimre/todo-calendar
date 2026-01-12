import { useState } from "react";
import { shortToLongDOTW } from './utils/date';

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyMenu({ tasks, setTasks }) {
  const [activeDay, setActiveDay] = useState("Sun");
  const [taskName, setTaskName] = useState("");
  const todayTasks = tasks[activeDay];

  const addTaskToDay = (tasks, day, task) => {
    tasks[day] = [...tasks[day], task];
    setTasks({ ...tasks });
  };

  const removeTask = (indexToRemove) => {
    setTasks((prev) => ({
      ...prev,
      [activeDay]: prev[activeDay].filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const fillWeekWithTodayTasks = () => {
    const updatedTasks = {};
    DAYS.forEach((day) => {
      updatedTasks[day] = [...todayTasks];
    });
    setTasks(updatedTasks);
  };

  // Example content for each day
  const menuContent =
    <div className="flex flex-col h-[24em]">
      <b className="justify-center flex flex-col items-center cursor-default">{shortToLongDOTW(activeDay)}</b>
      <div className="flex-1 overflow-y-auto y-full">
        {todayTasks.length === 0 ? (
          <p className="cursor-default text-gray-500">No tasks yet...</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todayTasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50"
              >
                <span>{task}</span>
                <button
                  className="text-red-500 font-bold hover:text-red-700"
                  onClick={() => removeTask(index)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>
      <button
        className="px-4 mb-2 text-blue-500 underline w-[60%] mx-auto hover:no-underline"
        title="Apply today's tasks to each day in the week"
        onClick={fillWeekWithTodayTasks}
      >
        Apply to All
      </button>
      <hr className="border-t border-gray-300 mb-4" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap cursor-default">Task name:</p>
          <input
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Ex: Read 10 pages"
            className="border-2 rounded-md px-2 py-1 w-full"
          />
        </div>
      </div>
      <hr className="border-t border-gray-300 my-4" />
      <div className="flex justify-evenly">
        <button onClick={() => {
          addTaskToDay(tasks, activeDay, taskName);
          setTaskName(""); // clear input
        }}
          className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600 w-[40%]"
          title="Add a new task to the daily to-do list"
        >
          Add Task
        </button>
      </div>
    </div>;

  return (
    <div className="max-w-lg mx-auto mt-4">
      {/* Day Tabs */}
      <div className="flex justify-between mb-4">
        {DAYS.map((day) => (
          <button
            key={day}
            className={`px-3 py-1 rounded-full font-semibold transition ${activeDay === day
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Content Panel */}
      <div className="bg-white rounded-lg shadow p-4 min-h-[120px]">
        <p>{menuContent}</p>
      </div>
    </div>
  );
}
