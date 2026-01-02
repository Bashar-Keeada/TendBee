import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TendbeeLanding from './pages/TendbeeLanding';
import LoginPage from './pages/LoginPage';
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

function App() {
  const handleAdminExit = () => {
    logoutAdmin();
    window.location.href = '/';
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page - Tendbee Marketing Site */}
        <Route path="/" element={<TendbeeLanding />} />
        
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
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
    </Router>
  );
}

export default App;
