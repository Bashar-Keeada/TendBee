import React from 'react';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';
import { 
  Building2, Globe, Users, Briefcase, ArrowRight, 
  CheckCircle2, Factory, GraduationCap, Heart, 
  Shield, Zap, BarChart3, Clock 
} from 'lucide-react';

const SolutionCard = ({ icon: Icon, title, description, features, ctaText, ctaLink, color }) => (
  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
    <div className={`p-8 bg-gradient-to-br from-${color}-500 to-${color}-600 text-white`}>
      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/80">{description}</p>
    </div>
    <div className="p-8">
      <ul className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle2 className={`w-5 h-5 text-${color}-500 mt-0.5 shrink-0`} />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <a 
        href={ctaLink}
        className={`inline-flex items-center gap-2 text-${color}-600 font-semibold hover:gap-3 transition-all`}
      >
        {ctaText}
        <ArrowRight className="w-5 h-5" />
      </a>
    </div>
  </div>
);

const SolutionsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <MainNavigation activePage="solutions" />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-enterprise text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              Lösningar för alla
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Anpassade lösningar för
              <span className="text-amber-400"> din bransch</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Oavsett om du är ett stort företag, offentlig sektor eller bemanningsföretag 
              har vi en lösning som passar dina unika behov.
            </p>
          </div>
        </div>
      </section>
      
      {/* Solutions Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <SolutionCard
              icon={Building2}
              title="Enterprise"
              description="För stora organisationer med komplexa rekryteringsbehov."
              features={[
                'Obegränsade användare och annonser',
                'Dedikerad kundansvarig',
                'Custom API-integrationer',
                'Avancerad analys och rapportering',
                'SLA med 99.9% upptid',
                'Single Sign-On (SSO)',
              ]}
              ctaText="Kontakta sälj"
              ctaLink="/om-oss"
              color="amber"
            />
            
            <SolutionCard
              icon={Globe}
              title="Offentlig Sektor"
              description="Anpassad för kommuner, regioner och myndigheter."
              features={[
                'GDPR-säker datahantering',
                'Integration med offentliga system',
                'Stöd för LOU-upphandling',
                'Tillgänglighetsanpassad (WCAG 2.1)',
                'Svenskt datacenter',
                'Säkerhetsgranskad kod',
              ]}
              ctaText="Begär offert"
              ctaLink="/om-oss"
              color="blue"
            />
            
            <SolutionCard
              icon={Users}
              title="Bemanningsföretag"
              description="Skala dina placeringar med AI-driven matchning."
              features={[
                'Kandidatpool-hantering',
                'Snabbmatchning för uppdrag',
                'Kundportal för arbetsgivare',
                'Automatiserad fakturering',
                'White-label lösning',
                'Integration med lönesystem',
              ]}
              ctaText="Boka demo"
              ctaLink="/app"
              color="purple"
            />
          </div>
        </div>
      </section>
      
      {/* Industry Solutions */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Branschspecifika lösningar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vi förstår att varje bransch har unika utmaningar - därför erbjuder vi specialanpassade lösningar.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Factory, title: 'Logistik & Lager', desc: 'Truckkort, certifikat & erfarenhet' },
              { icon: Heart, title: 'Vård & Omsorg', desc: 'Legitimationer & specialistkunskap' },
              { icon: GraduationCap, title: 'Utbildning', desc: 'Lärarlegitimationer & ämnesbehörighet' },
              { icon: Briefcase, title: 'Kontor & Admin', desc: 'Språkkunskaper & systemkunskap' },
            ].map((industry, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-2xl hover:bg-amber-50 hover:border-amber-200 border-2 border-transparent transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <industry.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{industry.title}</h3>
                <p className="text-sm text-gray-600">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Varför välja TendBee?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Resultat som talar för sig själva
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, value: '73%', label: 'Snabbare rekrytering' },
              { icon: Shield, value: '100%', label: 'Diskrimineringsfri' },
              { icon: BarChart3, value: '45%', label: 'Lägre personalomsättning' },
              { icon: Clock, value: '24h', label: 'Support svarstid' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Vilken lösning passar dig?
          </h2>
          <p className="text-lg text-amber-900 mb-8">
            Låt oss hjälpa dig att hitta rätt paket för dina behov.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/app" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              Testa gratis
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/om-oss" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Boka demo
            </a>
          </div>
        </div>
      </section>
      
      <MainFooter />
    </div>
  );
};

export default SolutionsPage;
