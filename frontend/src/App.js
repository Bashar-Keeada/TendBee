import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TendbeeLanding from './pages/TendbeeLanding';
import AboutPage from './pages/AboutPage';
import PartnersPage from './pages/PartnersPage';
import CareersPage from './pages/CareersPage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import AdminLoginPage, { isAdminAuthenticated, logoutAdmin } from './pages/AdminLoginPage';
import JobMatchingApp from './components/JobMatchingApp';
import { AdminPanel } from './components/AdminPanel';

// Protected Admin Route Component
function ProtectedAdminRoute({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

// App Router with session_id detection
function AppRouter() {
  const location = useLocation();
  
  // Check URL fragment for session_id (Google OAuth callback)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  const handleAdminExit = () => {
    logoutAdmin();
    window.location.href = '/';
  };

  return (
    <Routes>
      {/* Landing Page - Tendbee Marketing Site */}
      <Route path="/" element={<TendbeeLanding />} />
      
      {/* About Us Page */}
      <Route path="/om-oss" element={<AboutPage />} />
      
      {/* Partners & Sustainability Page */}
      <Route path="/partners" element={<PartnersPage />} />
      
      {/* Careers Page */}
      <Route path="/karriar" element={<CareersPage />} />
      
      {/* Login Page */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Auth Callback for Google OAuth */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Admin Login Page */}
      <Route path="/admin-login" element={<AdminLoginPage />} />
      
      {/* Job Matching Application */}
      <Route path="/app/*" element={<JobMatchingApp />} />
      
      {/* Protected Admin Panel */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedAdminRoute>
            <AdminPanel onExit={handleAdminExit} />
          </ProtectedAdminRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
