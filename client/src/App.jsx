import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import Home from './Home';
import Calendar from './Calendar';
import { fetchAllCalendarIds } from './utils/calendar';

const CalendarWrapper = async () => {
  const navigate = useNavigate();
  let { id } = useParams(); // id will be undefined if /calendar
  if (id == undefined) {
    try {
      const ids = await fetchAllCalendarIds();
      if (ids.length !== 0) {
        navigate(`/calendar/${ids[0]}`);
      }
    } catch (err) {
      id = undefined;
    }
  }
  return <Calendar calendarId={id} />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<CalendarWrapper />} />
        <Route path="/calendar/:id" element={<CalendarWrapper />} />
      </Routes>
    </Router>
  )
};

export default App;
