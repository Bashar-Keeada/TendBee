import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, ArrowRight, Shield, ChevronLeft, User, Eye, EyeOff, AlertCircle
} from 'lucide-react';

// Admin credentials (in production, this should be handled by backend)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'tendbee2025'
};

// TendBee Logo Component
const TendbeeLogo = ({ className = "h-8" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative">
      <svg className="w-10 h-10" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M30 35 Q10 25 18 12 Q24 5 30 15" 
          stroke="#F59E0B" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          fill="none"
        />
        <path 
          d="M30 35 Q50 25 42 12 Q36 5 30 15" 
          stroke="#F59E0B" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          fill="none"
        />
        <path 
          d="M30 35 Q25 45 30 55 Q35 45 30 35" 
          stroke="#F59E0B" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          fill="none"
        />
        <path 
          d="M26 8 L30 14 L34 8" 
          stroke="#F59E0B" 
          strokeWidth="2" 
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
    <span className="font-bold text-2xl tracking-tight text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      Tend<span style={{ color: '#F59E0B' }}>Bee</span>
    </span>
  </div>
);

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Store admin session
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminUser', username);
        navigate('/admin');
      } else {
        setError('Fel användarnamn eller lösenord');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen login-page-bg flex flex-col">
      {/* Floating orbs for visual effect */}
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Tillbaka</span>
          </button>
          <TendbeeLogo />
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="login-card rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Admin Login
              </h1>
              <p className="text-white/60 text-sm">
                Endast för behöriga administratörer
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Användarnamn</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="login-input w-full pl-11"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Lösenord</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="login-input w-full pl-11 pr-11"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="login-submit-btn w-full mt-6 admin-submit"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifierar...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    Logga in som Admin
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/30 text-xs text-center">
                ⚠️ Obehörig åtkomst är förbjuden och övervakas
              </p>
            </div>
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Lock className="w-4 h-4" />
              <span>Säker anslutning</span>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Shield className="w-4 h-4" />
              <span>Skyddad åtkomst</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-white/30 text-sm">
          © 2025 Tendbee AB. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// Helper function to check if admin is authenticated
export const isAdminAuthenticated = () => {
  return sessionStorage.getItem('adminAuthenticated') === 'true';
};

// Helper function to logout admin
export const logoutAdmin = () => {
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('adminUser');
};
