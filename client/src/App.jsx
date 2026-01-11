import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import Home from './Home';
import Calendar from './Calendar';
import { fetchAllCalendarIds } from './utils/calendar';

const CalendarWrapper = async () => {
  let { id } = useParams(); // id will be undefined if /calendar
  if (id == undefined || id == null) {
    try {
      const ids = await fetchAllCalendarIds();
      if (ids.length == 0) {
        id = null;
      } else {
        id = ids[0];
      }
    } catch (err) {
      id = null;
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
