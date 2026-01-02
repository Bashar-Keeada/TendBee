import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]+)/);
        
        if (!sessionIdMatch) {
          console.error('No session_id found in URL');
          navigate('/login');
          return;
        }

        const sessionId = sessionIdMatch[1];

        // Exchange session_id for user data and token
        const response = await fetch(`${API_URL}/api/auth/google/session?session_id=${sessionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Google-inloggning misslyckades');
        }

        // Store user data and token
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        // Navigate to app
        navigate('/app', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { replace: true });
      }
    };

    processAuth();
  }, [location, navigate, API_URL]);

  return (
    <div className="min-h-screen login-page-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-semibold text-white mb-2">Loggar in med Google...</h2>
        <p className="text-white/60">Vänta medan vi verifierar din inloggning</p>
      </div>
    </div>
  );
}
