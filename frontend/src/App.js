import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TendbeeLanding from './pages/TendbeeLanding';
import LoginPage from './pages/LoginPage';
import JobMatchingApp from './components/JobMatchingApp';
import { AdminPanel } from './components/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page - Tendbee Marketing Site */}
        <Route path="/" element={<TendbeeLanding />} />
        
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Job Matching Application */}
        <Route path="/app/*" element={<JobMatchingApp />} />
        
        {/* Admin Panel */}
        <Route 
          path="/admin/*" 
          element={
            <AdminPanel 
              onExit={() => window.location.href = '/'} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
