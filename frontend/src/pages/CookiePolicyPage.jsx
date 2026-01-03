import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookie, Settings, BarChart3, Shield, ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';

export default function CookiePolicyPage() {
  const navigate = useNavigate();
  const lastUpdated = '2025-01-03';
  
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const cookieTypes = [
    {
      id: 'necessary',
      icon: Shield,
      title: 'Nödvändiga cookies',
      description: 'Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt. De kan inte stängas av.',
      required: true,
      examples: ['Autentisering och inloggning', 'Säkerhetsfunktioner', 'Språkinställningar']
    },
    {
      id: 'functional',
      icon: Settings,
      title: 'Funktionella cookies',
      description: 'Dessa cookies möjliggör förbättrad funktionalitet och personalisering, som att komma ihåg dina preferenser.',
      required: false,
      examples: ['Sparade sökfilter', 'Profilinställningar', 'Tema-val (mörkt/ljust läge)']
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytiska cookies',
      description: 'Dessa cookies hjälper oss förstå hur besökare använder webbplatsen genom att samla in anonym statistik.',
      required: false,
      examples: ['Google Analytics', 'Sidvisningar och besökstid', 'Enhets- och webbläsartyp']
    },
    {
      id: 'marketing',
      icon: Cookie,
      title: 'Marknadsföringscookies',
      description: 'Dessa cookies används för att visa relevanta annonser och mäta effektiviteten av marknadsföringskampanjer.',
      required: false,
      examples: ['Facebook Pixel', 'LinkedIn Insight Tag', 'Remarketing-annonser']
    }
  ];

  const handleToggle = (id) => {
    if (id === 'necessary') return; // Cannot toggle necessary cookies
    setCookiePreferences(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Dina cookie-inställningar har sparats!');
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    alert('Alla cookies har godkänts!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation transparent={false} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </button>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Cookie className="w-4 h-4" />
            Cookie-inställningar
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Cookie-policy
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Vi använder cookies för att förbättra din upplevelse på Tendbee. 
            Här kan du läsa mer och hantera dina inställningar.
          </p>
          <p className="text-sm text-gray-500">
            Senast uppdaterad: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vad är cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. 
              De hjälper webbplatsen att komma ihåg information om ditt besök, som dina 
              preferenser och inloggningsstatus.
            </p>
            <p className="text-gray-600">
              Vi använder både egna cookies och cookies från tredje part. Vissa är nödvändiga 
              för att webbplatsen ska fungera, medan andra hjälper oss att förbättra din 
              upplevelse och analysera hur tjänsten används.
            </p>
          </div>

          {/* Cookie Types */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Typer av cookies vi använder</h2>
          <div className="space-y-4 mb-8">
            {cookieTypes.map((cookie) => {
              const Icon = cookie.icon;
              const isEnabled = cookiePreferences[cookie.id];
              
              return (
                <div 
                  key={cookie.id} 
                  className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                    isEnabled ? 'border-amber-200' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isEnabled ? 'bg-amber-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${isEnabled ? 'text-amber-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{cookie.title}</h3>
                          {cookie.required && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              Obligatorisk
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{cookie.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {cookie.examples.map((example, i) => (
                            <span key={i} className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(cookie.id)}
                      disabled={cookie.required}
                      className={`w-14 h-8 rounded-full flex items-center transition-all flex-shrink-0 ${
                        isEnabled 
                          ? 'bg-amber-500 justify-end' 
                          : 'bg-gray-200 justify-start'
                      } ${cookie.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-white shadow mx-1 flex items-center justify-center`}>
                        {isEnabled ? (
                          <Check className="w-3 h-3 text-amber-500" />
                        ) : (
                          <X className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              Du kan ändra dina inställningar när som helst genom att återvända till denna sida.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={handleSavePreferences}
                variant="outline"
                className="border-gray-300"
              >
                Spara inställningar
              </Button>
              <Button 
                onClick={handleAcceptAll}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Godkänn alla
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Hur länge sparas cookies?</h3>
              <p className="text-gray-600 text-sm">
                Sessioncookies raderas när du stänger webbläsaren. Permanenta cookies 
                kan lagras i upp till 12 månader beroende på typ.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Hur tar jag bort cookies?</h3>
              <p className="text-gray-600 text-sm">
                Du kan radera cookies via din webbläsares inställningar. Observera att 
                detta kan påverka webbplatsens funktionalitet.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <button 
              onClick={() => navigate('/integritetspolicy')}
              className="text-amber-600 hover:text-amber-700 hover:underline"
            >
              Läs vår integritetspolicy →
            </button>
            <button 
              onClick={() => navigate('/villkor')}
              className="text-amber-600 hover:text-amber-700 hover:underline"
            >
              Läs våra allmänna villkor →
            </button>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
