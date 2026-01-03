import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Building2, Globe, Users } from 'lucide-react';

// TendBee Logo - Minimalist line-art bee style
export const TendbeeLogo = ({ className = "h-8", dark = false }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative">
      <svg className="w-12 h-12" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 35 Q10 25 18 12 Q24 5 30 15" stroke={dark ? "#92400E" : "#F59E0B"} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M30 35 Q50 25 42 12 Q36 5 30 15" stroke={dark ? "#92400E" : "#F59E0B"} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M30 35 Q25 45 30 55 Q35 45 30 35" stroke={dark ? "#92400E" : "#F59E0B"} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M26 8 L30 14 L34 8" stroke={dark ? "#92400E" : "#F59E0B"} strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    </div>
    <span className={`font-bold text-2xl tracking-tight ${dark ? 'text-gray-900' : 'text-white'}`}>
      Tend<span style={{ color: '#F59E0B' }}>Bee</span>
    </span>
  </div>
);

// Shared Navigation Component
export const MainNavigation = ({ transparent = false, activePage = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => navigate('/login');
  const handleDemo = () => navigate('/app');

  const isActive = (path) => location.pathname === path;
  const isDark = scrolled || !transparent;

  const navLinkClass = (path) => {
    const baseClass = "font-medium transition-colors";
    const activeClass = "text-amber-500";
    const inactiveClass = isDark 
      ? "text-gray-700 hover:text-gray-900" 
      : "text-white/70 hover:text-white";
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  const anchorClass = isDark 
    ? "font-medium text-gray-700 hover:text-gray-900 transition-colors"
    : "font-medium text-white/70 hover:text-white transition-colors";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDark ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center">
            <TendbeeLogo dark={isDark} />
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => navigate('/')} className={navLinkClass('/')}>
              Hem
            </button>
            <a href="/#platform" className={anchorClass}>Platform</a>
            <div className="relative group">
              <button className={`${anchorClass} flex items-center gap-1`}>
                Solutions <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                <a href="/#enterprise" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-gray-900">Enterprise</p>
                    <p className="text-xs text-gray-500">For large organizations</p>
                  </div>
                </a>
                <a href="/#public" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50">
                  <Globe className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-gray-900">Public Sector</p>
                    <p className="text-xs text-gray-500">Government & municipalities</p>
                  </div>
                </a>
                <a href="/#staffing" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50">
                  <Users className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-gray-900">Staffing Agencies</p>
                    <p className="text-xs text-gray-500">Scale your placements</p>
                  </div>
                </a>
              </div>
            </div>
            <button onClick={() => navigate('/om-oss')} className={navLinkClass('/om-oss')}>
              Om oss
            </button>
            <button onClick={() => navigate('/karriar')} className={navLinkClass('/karriar')}>
              Karriär
            </button>
            <a href="/#pricing" className={anchorClass}>Pricing</a>
          </div>
          
          {/* Right side buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={handleLogin} className={anchorClass}>
              Login
            </button>
            <button 
              onClick={handleDemo}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                isDark 
                  ? 'bg-amber-500 text-white hover:bg-amber-600' 
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              Kom igång
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen 
              ? <X className={`w-6 h-6 ${isDark ? 'text-gray-900' : 'text-white'}`} /> 
              : <Menu className={`w-6 h-6 ${isDark ? 'text-gray-900' : 'text-white'}`} />
            }
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="block py-2 text-gray-900 font-medium w-full text-left">
              Hem
            </button>
            <a href="/#platform" className="block py-2 text-gray-900 font-medium">Platform</a>
            <a href="/#solutions" className="block py-2 text-gray-900 font-medium">Solutions</a>
            <button onClick={() => { navigate('/om-oss'); setMobileMenuOpen(false); }} className={`block py-2 font-medium w-full text-left ${isActive('/om-oss') ? 'text-amber-500' : 'text-gray-900'}`}>
              Om oss
            </button>
            <button onClick={() => { navigate('/karriar'); setMobileMenuOpen(false); }} className={`block py-2 font-medium w-full text-left ${isActive('/karriar') ? 'text-amber-500' : 'text-gray-900'}`}>
              Karriär
            </button>
            <a href="/#pricing" className="block py-2 text-gray-900 font-medium">Pricing</a>
            <button onClick={() => { handleLogin(); setMobileMenuOpen(false); }} className="block py-2 text-gray-900 font-medium w-full text-left">
              Login
            </button>
            <button 
              onClick={() => { handleDemo(); setMobileMenuOpen(false); }}
              className="w-full mt-4 px-5 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
            >
              Kom igång
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Shared Footer Component
export const MainFooter = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-gray-950 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <button onClick={() => navigate('/')}>
            <TendbeeLogo />
          </button>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Hem</button>
            <button onClick={() => navigate('/om-oss')} className="hover:text-white transition-colors">Om oss</button>
            <button onClick={() => navigate('/karriar')} className="hover:text-white transition-colors">Karriär</button>
            <a href="mailto:kontakt@tendbee.se" className="hover:text-white transition-colors">Kontakt</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="mailto:kontakt@tendbee.se" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Tendbee. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
};

export default MainNavigation;
