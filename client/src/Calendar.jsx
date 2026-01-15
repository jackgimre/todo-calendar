import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "./hooks/useCurrentUser";
import Navbar from "./Navbar";
import Layout from "./Layout";
import MultiStepModal from "./MultiStepModal";
import {
  fetchCalendarData,
  createCalendar,
  fetchAllCalendars,
  deleteCalendarById,
} from "./utils/calendar";
import CalendarGrid from "./components/CalendarGrid";
import DayInfo from "./components/DayInfo";
import CalendarSidebar from "./components/CalendarSidebar";
import DeletionPrompt from "./components/DeletionPrompt";

const Calendar = ({ calendarId: initialCalendarId }) => {
  const navigate = useNavigate();
  const { user, loading, error } = useCurrentUser();

  const [calendarId, setCalendarId] = useState(initialCalendarId || null);
  const [calendar, setCalendar] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [progress, setProgress] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [calendarName, setCalendarName] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState({
    Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [],
  });

  const [nameError, setNameError] = useState(false);
  const [promptDeleteStatus, setPromptDeleteStatus] = useState(false);
  const [deletionId, setDeletionId] = useState(null);

  // Load all calendars for the current user

  const loadCalendars = async () => {
    try {
      const data = await fetchAllCalendars();
      setCalendars(data || []);

      // Only select first calendar if no initial ID was provided
      if (!initialCalendarId && data.length > 0) {
        console.log('Data:', data);
        const firstId = data[0].id;
        setCalendarId(firstId);
        navigate(`/calendar/${firstId}`);
      }
    } catch (err) {
      console.error("Failed to load calendars:", err);
    }
  };

  // Load data for selected calendar
  const loadCalendarData = async (id) => {
    console.log(id);
    try {
      if (id) {
        const data = await fetchCalendarData(id);
        console.log(data);
        setCalendar(data);
        setCalendarId(data._id);
        setProgress(data.progress);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    document.title = "Todo Calendar";
    if (!user) return;
    if (user) loadCalendars();
    if (user && calendarId) {
      loadCalendarData(calendarId);
    }
  }, [user, calendarId]);

  useEffect(() => {
    console.log(calendars);
  }, [calendars]);

  if (loading) return <p className="text-gray-500">Loading user...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p className="text-red-500">Not logged in</p>;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const submitCalendar = async () => {
    if (!calendarName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    try {
      const data = await createCalendar(calendarName, description, tasks);
      console.log('New Calendar:', data);
      const newCal = data.calendar;

      setCalendarId(newCal._id);
      setIsOpen(false);
      loadCalendars();
      setCalendarName(null);
      setDescription(null);
      setTasks({ Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], });
    } catch (err) {
      console.error("Failed to create calendar:", err);
    }
  };

  const deleteCalendar = async () => {
    if (!deletionId) return;
    try {
      await deleteCalendarById(deletionId);

      setCalendars((prev) => prev.filter((c) => c._id !== deletionId));
      setPromptDeleteStatus(false);
      setDeletionId(null);

      await loadCalendars();
      if (calendar[0] == null) {
        navigate('/calendar/');
        window.location.reload();
      } else {
        loadCalendarData(calendars[0].id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete calendar");
    }
  };

  const handleCellClick = ({ day, month, year }) => {
    setSelectedDate(new Date(year, month, day));
  };

  const updateProgress = (dateKey, completedIndices) => {
    setProgress((prev) => ({ ...prev, [dateKey]: completedIndices }));
  };

  return (
    <div>
      <MultiStepModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={submitCalendar}
        calendarName={calendarName}
        setCalendarName={setCalendarName}
        description={description}
        setDescription={setDescription}
        tasks={tasks}
        setTasks={setTasks}
        nameError={nameError}
        setNameError={setNameError}
      />

      <Navbar
        openModal={openModal}
        calendars={calendars}
        setPromptDeleteStatus={setPromptDeleteStatus}
        setDeletionId={setDeletionId}
        username={user.username}
      />

      <Layout
        sidebarContent={
          <CalendarSidebar
            openModal={openModal}
            calendars={calendars}
            setPromptDeleteStatus={setPromptDeleteStatus}
            setDeletionId={setDeletionId}
            setCalendarId={setCalendarId}
          />
        }
        mainContent={
          <div className="flex flex-col justify-start items-center">
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-center text-gray-800">
                {calendar ? calendar.name : "You haven't created a calendar yet."}
              </h1>
              {calendar?.description && <p className="text-center">{calendar.description}</p>}
            </div>

            <DeletionPrompt
              isOpen={promptDeleteStatus}
              onCancel={() => setPromptDeleteStatus(false)}
              onConfirm={deleteCalendar}
            />

            {calendar ? (
              <div className="flex flex-col md:flex-row gap-4 w-full h-[80vh]">
                <div className="md:flex-[0_0_70%]">
                  <CalendarGrid
                    monthData={calendar.monthData}
                    calendar={calendar}
                    selectedDate={selectedDate}
                    onCellClick={handleCellClick}
                    progress={progress}
                  />
                </div>
                <div className="md:flex-[0_0_30%]">
                  <DayInfo
                    selectedDate={selectedDate}
                    tasksSchema={calendar.tasks}
                    progress={progress}
                    setProgress={updateProgress}
                    calendarId={calendarId}
                  />
                </div>
              </div>
            ) : (
              <p>Click "Create Calendar" to get started!</p>
            )}
          </div>
        }
      />
    </div>
  );
};

export default Calendar;
