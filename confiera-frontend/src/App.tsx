import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { LoginPage } from "./pages/public/LoginPage";
import { RegistrationPage } from "./pages/public/RegistrationPage";
import { VerifyEmailPage } from "./pages/public/VerifyEmailPage";
import { ResetPasswordPage } from "./pages/public/ResetPasswordPage";
import { HomePage } from "./pages/public/HomePage";
import { useAuth } from "./auth/AuthContext";
import { AdminDashboard } from "./pages/AdminDashboard";
import { OrganizerDashboard } from "./pages/OrganizerDashboard";
import { ParticipantDashboard } from "./pages/ParticipantDashboard";
import { EvaluatorDashboard } from "./pages/EvaluatorDashboard";
import { ProfilePage } from "./pages/ProfilePage";

// Wrapper to adapt useNavigate to onNavigate prop
const PageWrapper = ({ Component }: { Component: any }) => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    // Map legacy custom strings to routes
    const routes: Record<string, string> = {
      'home': '/',
      'login': '/login',
      'register': '/register',
      'admin-dashboard': '/admin',
      'organizer-dashboard': '/organizer',
      'participant-dashboard': '/dashboard',
      'evaluator-dashboard': '/evaluator',
      'profile': '/profile',
      'report-generation': '/reports',
      'conference-management': '/admin/conferences',
    };
    navigate(routes[page] || '/');
  };
  return <Component onNavigate={handleNavigate} />;
};

// Guard
export const RequireAuth = ({ children, roles }: { children: React.ReactElement, roles?: string[] }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.some(r => user.roles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageWrapper Component={HomePage} />} />
        <Route path="/login" element={<PageWrapper Component={LoginPage} />} />
        <Route path="/register" element={<PageWrapper Component={RegistrationPage} />} />
        <Route path="/verify-email" element={<PageWrapper Component={VerifyEmailPage} />} />
        <Route path="/reset-password" element={<PageWrapper Component={ResetPasswordPage} />} />

        {/* Protected Routes */}
        <Route path="/admin" element={
          <RequireAuth roles={['Admin']}>
            <PageWrapper Component={AdminDashboard} />
          </RequireAuth>
        } />
        <Route path="/organizer" element={
          <RequireAuth roles={['Organizer']}>
            <PageWrapper Component={OrganizerDashboard} />
          </RequireAuth>
        } />
        <Route path="/dashboard" element={
          <RequireAuth roles={['Participant']}>
            <PageWrapper Component={ParticipantDashboard} />
          </RequireAuth>
        } />
        <Route path="/evaluator" element={
          <RequireAuth roles={['PanelEvaluator']}>
            <PageWrapper Component={EvaluatorDashboard} />
          </RequireAuth>
        } />
        <Route path="/profile" element={
          <RequireAuth>
            <PageWrapper Component={ProfilePage} />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}
