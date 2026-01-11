import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import Home from './Home';
import Calendar from './Calendar';

const CalendarWrapper = () => {
  const { id } = useParams(); // id will be undefined if /calendar
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
