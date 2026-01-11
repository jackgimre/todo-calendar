import React from "react";
import { useState } from "react";
import WeeklyMenu from "./WeeklyMenu";


export default function MultiStepModal({ isOpen, onClose, onSubmit, calendarName, setCalendarName, description, setDescription, tasks, setTasks, nameError, setNameError }) {
  const [step, setStep] = React.useState(1);    
  if (!isOpen) return null;

  const handleNext = () => {
    if (!calendarName.trim()) {
            setNameError(true);
            return; 
        }
        setNameError(false);
    setStep((prev) => prev + 1);
  }
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => {
            setStep(1); // reset steps when closed
            onClose();
          }}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          {step === 1 ? "Create New Calendar" : "Daily To Do List"}
        </h2>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Calendar Name
              </label>
              {nameError && <p className="text-red-500 mb-1">A name is required</p>}
              <input
                type="text"
                value={calendarName}
                onChange={(e) => setCalendarName(e.target.value)}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                  nameError ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                }`}
              />

              <label className="block text-sm font-semibold mb-1 mt-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              />

            </div>
          )}

          {step === 2 && (
            <div>
              <WeeklyMenu tasks={tasks} setTasks={setTasks}/>
            </div>
          )}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={handleBack}
              >
                Back
              </button>
            )}

            <button
              type="button"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ml-auto"
              onClick={step === 2 ? onSubmit : handleNext} // close modal on last step
            >
              {step === 2 ? "Finish" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
