import { Link } from "react-router-dom";
import { useState } from "react";
import useCurrentUser from "./hooks/useCurrentUser";
import CalendarSidebar from "./components/CalendarSidebar";

export default function Navbar({ openModal, calendars, setPromptDeleteStatus, setDeletionId, username }) {
  const { user, loading, error } = useCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <p className="text-gray-500">Loading user...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p className="text-red-500">Not logged in</p>;

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Todo Calendar</Link>
        </div>

        {/* Hamburger button */}
        <button
          className="md:hidden flex flex-col gap-1 p-2 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>

        {/* Desktop menu (hidden on mobile) */}
        <div className="hidden md:flex space-x-4">
          <b>{username}</b>
        </div>
      </nav>

      {/* Mobile sliding sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-500">
          <h2 className="text-lg font-bold">Todo Calendar</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-white text-xl">&times;</button>
        </div>

        <ul className="p-4 space-y-4">
          <li><b>{username}</b></li>
          <li>
            <CalendarSidebar openModal={openModal} calendars={calendars} setPromptDeleteStatus={setPromptDeleteStatus} setDeletionId={setDeletionId}></CalendarSidebar>
          </li>
        </ul>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
