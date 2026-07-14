import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TripDetail from './pages/TripDetail';
import TripForm from './pages/TripForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trips/new" element={<TripForm />} />
        <Route path="/trips/:id" element={<TripDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
