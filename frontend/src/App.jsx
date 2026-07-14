import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Trips from './pages/Trips'
import TripDetail from './pages/TripDetail'
import CreateTrip from './pages/CreateTrip'
import EditTrip from './pages/EditTrip'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/trips" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="trips" element={<Trips />} />
        <Route path="trips/create" element={<CreateTrip />} />
        <Route path="trips/:id" element={<TripDetail />} />
        <Route path="trips/:id/edit" element={<EditTrip />} />
        <Route path="*" element={<Navigate to="/trips" replace />} />
      </Route>
    </Routes>
  )
}

export default App
