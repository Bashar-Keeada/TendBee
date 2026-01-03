import React from 'react';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';
import { 
  Cpu, Shield, Users, Zap, Database, Globe, 
  ArrowRight, CheckCircle2, Code2, Layers, 
  BarChart3, Lock, RefreshCw, Building2 
} from 'lucide-react';

const PlatformPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <MainNavigation activePage="platform" />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-enterprise text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
              <Cpu className="w-4 h-4" />
              AI-driven plattform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Framtidens
              <span className="text-amber-400"> rekryteringsplattform</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              TendBee kombinerar avancerad AI-matchning med Sveriges första anti-diskriminerande 
              jobbplattform. Hitta rätt talang baserat på kompetens, inte fördomar.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/app" className="btn-enterprise">
                Testa gratis
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#features" className="btn-outline-enterprise">
                Läs mer
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              En plattform, alla verktyg
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Allt du behöver för att hitta, utvärdera och anställa de bästa kandidaterna
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: 'AI-matchning', desc: 'Avancerade algoritmer matchar kandidater baserat på kompetens och potential, inte bakgrund.', color: 'amber' },
              { icon: Shield, title: 'Anti-diskriminering', desc: 'Dölj känslig information som ålder, kön och foto för objektiv bedömning.', color: 'green' },
              { icon: BarChart3, title: 'Analytik & Insikter', desc: 'Detaljerade rapporter och insikter för bättre rekryteringsbeslut.', color: 'blue' },
              { icon: Database, title: 'Kandidatdatabas', desc: 'Bygg och hantera din egen talangpool med smarta sök- och filterfunktioner.', color: 'purple' },
              { icon: RefreshCw, title: 'Automatisering', desc: 'Automatisera repetitiva uppgifter och fokusera på det som spelar roll.', color: 'pink' },
              { icon: Lock, title: 'GDPR-säker', desc: 'Full efterlevnad av dataskyddsförordningen med end-to-end kryptering.', color: 'gray' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Så fungerar det
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tre enkla steg för att hitta din nästa stjärnanställd
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Skapa profil', desc: 'Publicera din tjänst och definiera vilka kompetenser du söker.', icon: Users },
              { step: '02', title: 'AI-matchning', desc: 'Vårt AI rankar kandidater baserat på kompetens och potential.', icon: Cpu },
              { step: '03', title: 'Intervjua & Anställ', desc: 'Granska objektiva profiler och boka intervjuer direkt.', icon: CheckCircle2 },
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                <div className="text-8xl font-bold text-gray-100 absolute -top-4 left-1/2 -translate-x-1/2">
                  {item.step}
                </div>
                <div className="relative z-10 pt-12">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Tech Stack */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
                <Code2 className="w-4 h-4" />
                Teknisk arkitektur
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Byggd för skalbarhet och säkerhet
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Vår plattform är byggd med moderna teknologier som garanterar hög prestanda, 
                skalbarhet och datasäkerhet enligt GDPR.
              </p>
              
              <div className="space-y-4">
                {[
                  'Vector-baserad AI-matchning med 95% precision',
                  'End-to-end kryptering av all persondata',
                  'Automatisk skalning för upp till 100k+ samtidiga användare',
                  'Integration med Arbetsförmedlingen & Platsbanken',
                  'RESTful API för tredjepartsintegrationer',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Layers, label: 'Microservices' },
                    { icon: Database, label: 'MongoDB' },
                    { icon: Globe, label: 'React + FastAPI' },
                    { icon: Lock, label: 'OAuth 2.0' },
                  ].map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-xl">
                      <tech.icon className="w-6 h-6 text-amber-500" />
                      <span className="text-sm font-medium">{tech.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Redo att revolutionera din rekrytering?
          </h2>
          <p className="text-lg text-amber-900 mb-8">
            Gå med över 500 företag som redan använder TendBee för rättvis rekrytering.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/app" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              Starta gratis
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/om-oss" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Kontakta oss
            </a>
          </div>
        </div>
      </section>
      
      <MainFooter />
    </div>
  );
};

export default PlatformPage;
