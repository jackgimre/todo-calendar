import React, { useState, useEffect } from "react";
import { returnMonthName, returnShortMonthName, return42Days, returnPrevMonth, returnNextMonth, isToday, isSelected } from "../utils/date";

const CalendarGrid = ({ monthData, calendar, selectedDate, onCellClick, progress }) => {
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [gridData, setGridData] = useState([]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    setGridData(return42Days(month, year));
  }, [month, year]);

  const returnNumberOfTotalTasks = (day, month, year) => {
    if (!calendar || !calendar.tasks) return 0;
    const dayKey = daysOfWeek[new Date(year, month, day).getDay()];
    return calendar.tasks[dayKey]?.length || 0;
  };

  const handlePrevMonth = () => {
    const { month: prevMonth, year: prevYear } = returnPrevMonth(month, year);
    setMonth(prevMonth);
    setYear(prevYear);
  };

  const handleNextMonth = () => {
    const { month: nextMonth, year: nextYear } = returnNextMonth(month, year);
    setMonth(nextMonth);
    setYear(nextYear);
  };

  return (
    <div className="w-full h-full mx-auto rounded-2xl shadow-lg p-4 bg-white">
      <div className="flex items-center justify-center gap-6 mb-4">
        <button className="p-2 rounded hover:bg-gray-200 transition" onClick={handlePrevMonth}>&lt;</button>
        <h2 className="text-xl font-semibold text-gray-800">{calendar ? `${returnMonthName(month)}, ${year}` : "Loading..."}</h2>
        <button className="p-2 rounded hover:bg-gray-200 transition" onClick={handleNextMonth}>&gt;</button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold border-b">
        {daysOfWeek.map(day => <div key={day} className="p-2">{day}</div>)}
      </div>

      <div className="grid grid-cols-7 border-t w-full rounded-b-lg overflow-hidden select-none">
        {gridData.map((cell, index) => {
          const dateKey = `${cell.year}-${cell.month + 1}-${cell.day}`;
          const progressForCell = progress?.[dateKey] || [];
          const totalTasks = returnNumberOfTotalTasks(cell.day, cell.month, cell.year);
          const percent = totalTasks > 0 ? (progressForCell.length / totalTasks) * 100 : 0;

          return (
            <div
              key={cell.key || index}
              className={`group border p-2 h-20 flex flex-col justify-center items-center hover:bg-gray-200 rounded-sm cursor-pointer hover:scale-110 transition duration-100
                ${cell.month !== month ? "bg-gray-100" : "bg-white"}
                ${isToday(new Date(), cell.day, cell.month, cell.year) ? "border-blue-500 border-2" : ""}
                ${isSelected(selectedDate, cell.day, cell.month, cell.year) ? "!bg-gray-800 text-white border-2" : ""}`}
              onClick={() => onCellClick?.({ day: cell.day, month: cell.month, year: cell.year })}
            >
              <div className="flex flex-row gap-1 group-hover:font-bold transition-all">
                {cell.month != null && (
                <span className="hidden sm:inline">{returnShortMonthName(cell.month)} </span>
                )}
                {cell.day && <span>{cell.day}</span>}
              </div>

              {cell.content && (
                <div className="text-xs text-gray-600 mt-1 text-center">{cell.content}</div>
              )}

              {/* Progress bar */}
                <div className="w-full h-1 bg-gray-200 mt-2 rounded group-hover:bg-gray-100">
                  <div
                      className={`h-1 rounded transition-all ${
                      percent === 100 ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${percent}%` }}
                  />
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
