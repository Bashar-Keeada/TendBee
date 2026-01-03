import React, { useState } from 'react';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';
import { 
  Check, X, ArrowRight, Zap, Building2, Crown, 
  Users, Shield, BarChart3, Headphones, Globe,
  Star, CheckCircle2
} from 'lucide-react';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const plans = [
    {
      name: 'Starter',
      description: 'Perfekt för små företag som börjar rekrytera.',
      price: isAnnual ? 990 : 1290,
      period: isAnnual ? '/mån (faktureras årligen)' : '/mån',
      icon: Zap,
      color: 'gray',
      features: [
        { name: 'Upp till 5 aktiva annonser', included: true },
        { name: 'AI-matchning', included: true },
        { name: 'Kandidatdatabas (100)', included: true },
        { name: 'E-postsupport', included: true },
        { name: 'Anti-diskrimineringsfunktion', included: true },
        { name: 'Analys & rapporter', included: false },
        { name: 'API-åtkomst', included: false },
        { name: 'Dedikerad kundansvarig', included: false },
      ],
      cta: 'Kom igång',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'För växande företag med regelbundna rekryteringsbehov.',
      price: isAnnual ? 2490 : 2990,
      period: isAnnual ? '/mån (faktureras årligen)' : '/mån',
      icon: Building2,
      color: 'amber',
      features: [
        { name: 'Upp till 20 aktiva annonser', included: true },
        { name: 'Avancerad AI-matchning', included: true },
        { name: 'Kandidatdatabas (500)', included: true },
        { name: 'Prioriterad support', included: true },
        { name: 'Anti-diskrimineringsfunktion', included: true },
        { name: 'Analys & rapporter', included: true },
        { name: 'API-åtkomst', included: false },
        { name: 'Dedikerad kundansvarig', included: false },
      ],
      cta: 'Starta provperiod',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Skräddarsydd lösning för stora organisationer.',
      price: null,
      period: 'Kontakta oss',
      icon: Crown,
      color: 'purple',
      features: [
        { name: 'Obegränsade annonser', included: true },
        { name: 'Premium AI-matchning', included: true },
        { name: 'Obegränsad kandidatdatabas', included: true },
        { name: '24/7 telefonsupport', included: true },
        { name: 'Anti-diskrimineringsfunktion', included: true },
        { name: 'Avancerad analys & BI', included: true },
        { name: 'Full API-åtkomst', included: true },
        { name: 'Dedikerad kundansvarig', included: true },
      ],
      cta: 'Kontakta sälj',
      popular: false,
    },
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <MainNavigation activePage="pricing" />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Enkel, transparent prissättning
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Välj rätt plan för ditt <span className="text-amber-500">företag</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Alla planer inkluderar vår unika anti-diskrimineringsfunktion. 
            Ingen uppsägningstid, inga dolda avgifter.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 bg-gray-100 rounded-full">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
            >
              Månadsvis
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
            >
              Årsvis
              <span className="ml-2 text-xs text-amber-600 font-bold">Spara 20%</span>
            </button>
          </div>
        </div>
      </section>
      
      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div 
                key={idx}
                className={`relative bg-white rounded-3xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-amber-400 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">
                      <Star className="w-4 h-4" />
                      Populärast
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-${plan.color}-100 flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className={`w-7 h-7 text-${plan.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>
                
                <div className="text-center mb-8">
                  {plan.price ? (
                    <>
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500"> kr</span>
                      <p className="text-sm text-gray-500 mt-1">{plan.period}</p>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">{plan.period}</span>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <a 
                  href={plan.name === 'Enterprise' ? '/om-oss' : '/app'}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Comparison */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Alla planer inkluderar</h2>
            <p className="text-gray-600">Grundläggande funktioner som alla våra kunder får</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Anti-diskriminering', desc: 'Dölj känslig information' },
              { icon: Users, title: 'Kandidathantering', desc: 'Organisera din talangpool' },
              { icon: Globe, title: 'Svenskt datacenter', desc: 'GDPR-säker lagring' },
              { icon: BarChart3, title: 'Grundläggande analys', desc: 'Se hur dina annonser presterar' },
              { icon: Headphones, title: 'E-postsupport', desc: 'Vi svarar inom 24h' },
              { icon: Zap, title: 'Snabb setup', desc: 'Kom igång på 5 minuter' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-xl">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vanliga frågor</h2>
          </div>
          
          <div className="space-y-6">
            {[
              { q: 'Kan jag byta plan när som helst?', a: 'Ja, du kan uppgradera eller nedgradera din plan när som helst. Ändringen träder i kraft vid nästa faktureringsperiod.' },
              { q: 'Finns det någon bindningstid?', a: 'Nej, alla våra planer är utan bindningstid. Du kan säga upp när du vill.' },
              { q: 'Vad händer om jag överskrider mina gränser?', a: 'Vi kontaktar dig och hjälper dig att välja en plan som passar dina behov bättre.' },
              { q: 'Erbjuder ni rabatt för ideella organisationer?', a: 'Ja, vi erbjuder 50% rabatt för ideella organisationer och startups. Kontakta oss för mer information.' },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Osäker på vilken plan som passar?
          </h2>
          <p className="text-gray-400 mb-8">
            Boka ett kostnadsfritt samtal så hjälper vi dig att hitta rätt.
          </p>
          <a 
            href="/om-oss"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
          >
            Boka demo
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
      
      <MainFooter />
    </div>
  );
};

export default PricingPage;
