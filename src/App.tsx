import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { ProgramsPage } from './pages/public/ProgramsPage';
import { ProgramDetailsPage } from './pages/public/ProgramDetailsPage';
import { RegistrationPage } from './pages/public/RegistrationPage';
import { RegistrationSuccessPage } from './pages/public/RegistrationSuccessPage';
import { TrackingPage } from './pages/public/TrackingPage';
import { ProfilePage } from './pages/public/ProfilePage';
import { LoginPage } from './pages/public/LoginPage';

// Admin / Portal Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ProgramsListPage } from './pages/admin/ProgramsListPage';
import { CreateEditProgramPage } from './pages/admin/CreateEditProgramPage';
import { AdminProgramDetailsPage } from './pages/admin/AdminProgramDetailsPage';
import { ParticipantsPage } from './pages/admin/ParticipantsPage';
import { ParticipantDetailsPage } from './pages/admin/ParticipantDetailsPage';
import { VolunteersPage } from './pages/admin/VolunteersPage';
import { VolunteerDetailsPage } from './pages/admin/VolunteerDetailsPage';
import { RegistrationsPage } from './pages/admin/RegistrationsPage';
import { ParticipationTrackingPage } from './pages/admin/ParticipationTrackingPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { NotificationsPage } from './pages/admin/NotificationsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:id" element={<ProgramDetailsPage />} />
          <Route path="/programs/:id/register" element={<RegistrationPage />} />
          <Route path="/register/success" element={<RegistrationSuccessPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin / Portal Management Routes (Protected) */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/programs" element={<ProtectedRoute><ProgramsListPage /></ProtectedRoute>} />
          <Route path="/admin/programs/new" element={<ProtectedRoute><CreateEditProgramPage /></ProtectedRoute>} />
          <Route path="/admin/programs/:id" element={<ProtectedRoute><AdminProgramDetailsPage /></ProtectedRoute>} />
          <Route path="/admin/programs/:id/edit" element={<ProtectedRoute><CreateEditProgramPage /></ProtectedRoute>} />
          <Route path="/admin/participants" element={<ProtectedRoute><ParticipantsPage /></ProtectedRoute>} />
          <Route path="/admin/participants/:id" element={<ProtectedRoute><ParticipantDetailsPage /></ProtectedRoute>} />
          <Route path="/admin/volunteers" element={<ProtectedRoute><VolunteersPage /></ProtectedRoute>} />
          <Route path="/admin/volunteers/:id" element={<ProtectedRoute><VolunteerDetailsPage /></ProtectedRoute>} />
          <Route path="/admin/registrations" element={<ProtectedRoute><RegistrationsPage /></ProtectedRoute>} />
          <Route path="/admin/participation" element={<ProtectedRoute><ParticipationTrackingPage /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
