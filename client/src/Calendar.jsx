import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from "./hooks/useCurrentUser";
import Navbar from './Navbar';
import Layout from './Layout';
import MultiStepModal from './MultiStepModal';
import { fetchCalendarData, createCalendar, fetchAllCalendarNames, deleteCalendarById } from './utils/calendar';
import CalendarGrid from './components/CalendarGrid';
import DayInfo from './components/DayInfo';
import CalendarSidebar from './components/CalendarSidebar';
import DeletionPrompt from './components/DeletionPrompt';

const Calendar = ({ calendarId, setCalendarId }) => {
  const navigate = useNavigate();
  const { user, loading, error } = useCurrentUser();
  const [calendar, setCalendar] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [progress, setProgress] = useState({});

  // Modal & calendar creation
  const [isOpen, setIsOpen] = useState(false);
  const [calendarName, setCalendarName] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState({
    Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []
  });

  // Sidebar list of calendars
  const [calendars, setCalendars] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [promptDeleteStatus, setPromptDeleteStatus] = useState(false);
  const [deletionId, setDeletionId] = useState(null);

  // Load calendar & list
  useEffect(() => {
    async function loadCalendar() {
      try {
        const data = await fetchCalendarData(calendarId);
        setCalendar(data);
        setProgress(data.progress || {});
        if (calendarId === undefined) {
          navigate('/calendar/' + data._id);
        }
        document.title = `Todo Calendar - ${data.name}`;
      } catch (err) {
        console.error(err);
      }
    }
    async function loadCalendars() {
      try {
        const data = await fetchAllCalendarNames();
        setCalendars(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadCalendar();
    loadCalendars();
  }, [calendarId]);

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
    const cal = await createCalendar(calendarName, description, tasks);
    setIsOpen(false);
    navigate('/calendar/' + cal._id);
  };

  const deleteCalendar = async () => {
    if (!deletionId) return;
    try {
      await deleteCalendarById(deletionId);

      // Remove from sidebar list immediately
      setCalendars(prev =>
        prev.filter(cal => cal._id !== deletionId)
      );

      // Close prompt + reset state
      setPromptDeleteStatus(false);
      setDeletionId(null);

      // If user deleted the currently open calendar, redirect
      if (calendarId === deletionId) {
        navigate("/");
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
    setProgress(prev => ({
      ...prev,
      [dateKey]: completedIndices
    }));
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
      <Navbar openModal={openModal} calendars={calendars} setPromptDeleteStatus={setPromptDeleteStatus} setDeletionId={setDeletionId} />
      <Layout
        sidebarContent={
          <CalendarSidebar openModal={openModal} calendars={calendars} setPromptDeleteStatus={setPromptDeleteStatus} setDeletionId={setDeletionId}></CalendarSidebar>
        }
        mainContent={
          <div className='flex flex-col justify-start items-center'>
            <div className='mb-2'>
              <h1 className="text-2xl font-bold text-center text-gray-800">
                {calendar ? calendar.name : "You haven't created a calendar yet."}
              </h1>
              {calendar?.description ? <p className='text-center'>{calendar.description}</p> : <></>}
            </div>
            <DeletionPrompt isOpen={promptDeleteStatus} onCancel={() => { setPromptDeleteStatus(false) }} onConfirm={deleteCalendar}></DeletionPrompt>
            {calendar ? (
              <div className="flex flex-col md:flex-row gap-4 w-full h-[80vh]">
                {/* Calendar takes 70% on large screens */}
                <div className="md:flex-[0_0_70%]">
                  <CalendarGrid
                    monthData={calendar.monthData}
                    calendar={calendar}
                    selectedDate={selectedDate}
                    onCellClick={handleCellClick}
                    progress={progress}
                  />
                </div>

                {/* DayInfo takes 30% on large screens */}
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
            ) : "Click \"Create Calendar\" to get started!"}
          </div>
        }
      />
    </div>
  );
};

export default Calendar;
