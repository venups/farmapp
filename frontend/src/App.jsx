import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TripDetail from './pages/TripDetail';
import TripForm from './pages/TripForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trips/new" element={<TripForm />} />
        <Route path="/trips/:id" element={<TripDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
