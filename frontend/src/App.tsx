import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

// Pages (will be created in Skill 08)
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TripsPage } from '@/pages/TripsPage';
import { TripDetailPage } from '@/pages/TripDetailPage';
import { TripCreatePage } from '@/pages/TripCreatePage';
import { TripEditPage } from '@/pages/TripEditPage';
import { ItineraryPage } from '@/pages/ItineraryPage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { PackingPage } from '@/pages/PackingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';


import { useParams } from 'react-router-dom';
// Wrapper component to pass route params to pages that need them
function ItineraryPageWrapper() {
  const { tripId } = useParams<{ tripId?: string }>();
  return <ItineraryPage tripId={tripId || ''} totalDays={7} />;
}

function ExpensesPageWrapper() {
  const { tripId } = useParams<{ tripId?: string }>();
  return <ExpensesPage tripId={tripId || ''} />;
}

function PackingPageWrapper() {
  const { tripId } = useParams<{ tripId?: string }>();
  return <PackingPage tripId={tripId || ''} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#10B981', secondary: '#F8FAFC' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#F8FAFC' } },
        }} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes - wrapped in Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/new" element={<TripCreatePage />} />
            <Route path="/trips/:tripId" element={<TripDetailPage />} />
            <Route path="/trips/:tripId/edit" element={<TripEditPage />} />
            <Route path="/trips/:tripId/itinerary" element={<ItineraryPageWrapper />} />
            <Route path="/trips/:tripId/expenses" element={<ExpensesPageWrapper />} />
            <Route path="/trips/:tripId/packing" element={<PackingPageWrapper />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
