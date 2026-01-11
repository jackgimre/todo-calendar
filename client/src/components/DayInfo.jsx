import React, { useEffect, useState } from 'react';
import { returnDate, returnMonthName, returnDOTW } from '../utils/date';
import { toggleTaskCompletion } from '../utils/tasks';

const DayInfo = ({ selectedDate, tasksSchema, progress, setProgress, calendarId }) => {
  const date = returnDate(selectedDate);
  const dayOfWeek = returnDOTW(date.year, date.month, date.day);
  const dateKey = `${date.year}-${date.month + 1}-${date.day}`;

  const [tasksForDay, setTasksForDay] = useState(
    tasksSchema ? tasksSchema[["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dayOfWeek]] : []
  );

  useEffect(() => {
    setTasksForDay(tasksSchema ? tasksSchema[["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dayOfWeek]] : []);
  }, [selectedDate, tasksSchema]);

  const toggleTask = async (index) => {
    const data = await toggleTaskCompletion(calendarId, index, date.day, date.month, date.year);
    setProgress(dateKey, data.completedIndices); // <-- sync shared progress
  };

  const completedIndices = progress?.[dateKey] || [];

  return (
    <div className="w-full h-full mx-auto rounded-2xl shadow-lg p-4 bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {returnMonthName(date.month)} {date.day}, {date.year}
      </h2>

      {tasksForDay?.length > 0 ? (
        <ul className="space-y-2">
          {tasksForDay.map((task, index) => {
            const isCompleted = completedIndices.includes(index);
            return (
              <li
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                onClick={() => toggleTask(index)}
              >
                <div className={`w-5 h-5 flex items-center justify-center rounded border ${isCompleted ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}>
                  {isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`flex-1 select-none ${isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}>
                  {task}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-gray-600">No tasks for this day.</div>
      )}
    </div>
  );
};

export default DayInfo;
