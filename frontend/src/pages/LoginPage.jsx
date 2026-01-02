import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, ArrowRight, Chrome, Shield, ChevronLeft,
  Smartphone, User, Eye, EyeOff, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState(null); // 'email', 'google', 'bankid', 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const handleBack = () => {
    setError('');
    setSuccess('');
    if (loginMethod) {
      setLoginMethod(null);
    } else {
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google OAuth redirect
    setTimeout(() => {
      // In production, redirect to Google OAuth
      alert('Google OAuth kommer att implementeras med din Google Client ID');
      setIsLoading(false);
    }, 1000);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Inloggning misslyckades');
      }
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // Navigate to app
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          first_name: firstName,
          last_name: lastName,
          user_type: 'jobseeker'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registrering misslyckades');
      }
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setSuccess('Konto skapat! Du loggas in...');
      
      // Navigate to app after short delay
      setTimeout(() => {
        navigate('/app');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankIDLogin = () => {
    setIsLoading(true);
    // Simulate BankID
    setTimeout(() => {
      alert('BankID-integration kommer att implementeras');
      setIsLoading(false);
    }, 1000);
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
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="login-card rounded-2xl p-8">
            {!loginMethod ? (
              // Login Method Selection
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Välkommen tillbaka
                  </h1>
                  <p className="text-white/60">
                    Logga in för att fortsätta till din dashboard
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Google Login */}
                  <button
                    onClick={() => setLoginMethod('google')}
                    className="login-method-btn w-full"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-medium text-white">Fortsätt med Google</span>
                    </div>
                  </button>

                  {/* Email Login */}
                  <button
                    onClick={() => setLoginMethod('email')}
                    className="login-method-btn w-full"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Mail className="w-5 h-5 text-secondary" />
                      <span className="font-medium text-white">Fortsätt med Email</span>
                    </div>
                  </button>

                  {/* BankID Login */}
                  <button
                    onClick={() => setLoginMethod('bankid')}
                    className="login-method-btn w-full bankid-btn"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Shield className="w-5 h-5 text-[#235971]" />
                      <span className="font-medium text-white">Logga in med BankID</span>
                    </div>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <p className="text-white/50 text-sm">
                    Har du inget konto?{' '}
                    <button className="text-secondary hover:text-secondary/80 font-medium">
                      Skapa konto
                    </button>
                  </p>
                </div>
              </>
            ) : loginMethod === 'email' ? (
              // Email Login Form
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-secondary" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Logga in med Email
                  </h1>
                  <p className="text-white/60 text-sm">
                    Ange dina inloggningsuppgifter
                  </p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="din@email.se"
                        className="login-input w-full pl-11"
                        required
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

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-white/60">
                      <input type="checkbox" className="rounded border-white/20 bg-white/10" />
                      Kom ihåg mig
                    </label>
                    <button type="button" className="text-secondary hover:text-secondary/80">
                      Glömt lösenord?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="login-submit-btn w-full mt-6"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Loggar in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Logga in
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </form>
              </>
            ) : loginMethod === 'google' ? (
              // Google Login
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Google Login
                  </h1>
                  <p className="text-white/60 text-sm">
                    Klicka nedan för att logga in med ditt Google-konto
                  </p>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="login-submit-btn w-full"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Ansluter...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Fortsätt med Google
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </button>

                <p className="text-white/40 text-xs text-center mt-4">
                  Du kommer att omdirigeras till Google för säker autentisering
                </p>
              </>
            ) : loginMethod === 'bankid' ? (
              // BankID Login
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#235971]/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-[#235971]" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    BankID
                  </h1>
                  <p className="text-white/60 text-sm">
                    Öppna BankID-appen på din mobil för att identifiera dig
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">Mobilt BankID</p>
                      <p className="text-white/50 text-xs mt-1">
                        Starta BankID-appen och tryck på "Identifiera" eller "Skriv under"
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBankIDLogin}
                  disabled={isLoading}
                  className="login-submit-btn w-full bankid-submit"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Väntar på BankID...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      Öppna BankID
                    </span>
                  )}
                </button>

                <p className="text-white/40 text-xs text-center mt-4">
                  Din information hanteras säkert enligt GDPR
                </p>
              </>
            ) : null}
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Lock className="w-4 h-4" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Shield className="w-4 h-4" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-white/30 text-sm mb-4">
          © 2025 Tendbee AB. All rights reserved.
        </p>
        
        {/* Admin Link */}
        <button
          onClick={() => navigate('/admin-login')}
          className="inline-flex items-center gap-2 text-white/20 hover:text-white/50 text-xs transition-colors"
        >
          <Settings className="w-3 h-3" />
          <span>Admin</span>
        </button>
      </footer>
    </div>
  );
}
