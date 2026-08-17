import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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

          {/* Admin / Portal Management Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/programs" element={<ProgramsListPage />} />
          <Route path="/admin/programs/new" element={<CreateEditProgramPage />} />
          <Route path="/admin/programs/:id" element={<AdminProgramDetailsPage />} />
          <Route path="/admin/programs/:id/edit" element={<CreateEditProgramPage />} />
          <Route path="/admin/participants" element={<ParticipantsPage />} />
          <Route path="/admin/participants/:id" element={<ParticipantDetailsPage />} />
          <Route path="/admin/volunteers" element={<VolunteersPage />} />
          <Route path="/admin/volunteers/:id" element={<VolunteerDetailsPage />} />
          <Route path="/admin/registrations" element={<RegistrationsPage />} />
          <Route path="/admin/participation" element={<ParticipationTrackingPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
