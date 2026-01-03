import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Handshake, ExternalLink, Heart, Globe, Users, Target,
  Building2, Award, Sparkles, Scale, Briefcase, GraduationCap,
  ArrowRight, CheckCircle2, AlertTriangle, TrendingUp, UserPlus,
  Clock, MapPin, Shield, Zap, ChevronRight, Mail, Phone,
  Factory, Truck, HeartHandshake, Lightbulb, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';

// Statistics about unemployment and exclusion
const impactStats = [
  { value: '350 000+', label: 'Långtidsarbetslösa i Sverige', icon: Users },
  { value: '23%', label: 'Ungdomsarbetslöshet', icon: TrendingUp },
  { value: '2x', label: 'Högre arbetslöshet för utrikesfödda', icon: Globe },
  { value: '40%', label: 'Upplever diskriminering vid rekrytering', icon: AlertTriangle },
];

// Challenge points for companies
const challengePoints = [
  {
    title: 'Era CSR-mål är inte bara rapporter',
    description: 'Varje år publiceras tusentals hållbarhetsrapporter. Men hur många leder till faktisk förändring? Det är dags att gå från ord till handling.',
    icon: BarChart3,
  },
  {
    title: 'Mångfald kräver mod',
    description: 'Att rekrytera kompetensbaserat innebär att ifrågasätta gamla mönster. Är ni redo att se bortom CV:t och ge alla en ärlig chans?',
    icon: Shield,
  },
  {
    title: 'Praktik förändrar liv',
    description: 'En praktikplats kan vara skillnaden mellan utanförskap och karriär. Varje plats ni erbjuder är en investering i framtiden.',
    icon: Lightbulb,
  },
];

// What companies can offer
const opportunityTypes = [
  {
    type: 'Praktikplatser',
    description: 'Ge unga och nyanlända en första erfarenhet av svenskt arbetsliv',
    duration: '2-6 månader',
    icon: GraduationCap,
    color: 'blue',
    benefits: ['Lär känna framtida talanger', 'Bidra till integration', 'Skatteavdrag möjligt'],
  },
  {
    type: 'Arbetsträning',
    description: 'Hjälp långtidsarbetslösa tillbaka till arbetsmarknaden',
    duration: '3-12 månader',
    icon: Briefcase,
    color: 'green',
    benefits: ['Subventionerad lönekostnad', 'Stöd från Arbetsförmedlingen', 'Social hållbarhet'],
  },
  {
    type: 'Anställning',
    description: 'Rekrytera kompetensbaserat utan fördomar',
    duration: 'Tillsvidareanställning',
    icon: UserPlus,
    color: 'amber',
    benefits: ['Breddad rekryteringsbas', 'Ökad innovation', 'Stärkt arbetsgivarvarumärke'],
  },
];

// Global Compact Swedish Network members (examples)
const globalCompactMembers = [
  'H&M Group', 'Volvo', 'IKEA', 'Ericsson', 'Sandvik', 'Atlas Copco', 
  'Electrolux', 'SKF', 'Scania', 'Telia', 'SEB', 'Handelsbanken'
];

// Diversity Charter Sweden members (examples)
const diversityCharterMembers = [
  'Swedbank', 'Spotify', 'Klarna', 'Bonnier', 'Praktikertjänst', 
  'Akademikerförbundet', 'SKR', 'Malmö stad', 'Göteborgs stad'
];

// SDG Goals with icons
const relevantSDGs = [
  { number: 4, title: 'God utbildning', color: '#C5192D' },
  { number: 5, title: 'Jämställdhet', color: '#EF402B' },
  { number: 8, title: 'Anständiga arbetsvillkor', color: '#A21942' },
  { number: 10, title: 'Minskad ojämlikhet', color: '#DD1367' },
  { number: 17, title: 'Partnerskap', color: '#19486A' },
];

// Success stories
const successStories = [
  {
    company: 'Logistikföretag X',
    role: 'Lagermedarbetare',
    story: 'Efter 3 månaders praktik genom TendBee fick Ali fast anställning. Idag är han teamledare.',
    result: '+15 anställningar via praktik',
  },
  {
    company: 'IT-företag Y',
    role: 'Utvecklare',
    story: 'Maria, nyexaminerad från bootcamp, fick sin första chans genom arbetsträning.',
    result: '100% av praktikanter erbjöds jobb',
  },
];

export default function PartnersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('praktik');

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation transparent={true} />

      {/* HERO - The Challenge */}
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white pt-32 pb-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              EN UTMANING TILL SVERIGES FÖRETAG
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Ni pratar om <span className="text-amber-400">CSR</span>.<br/>
              Vi utmanar er att <span className="text-amber-400">agera</span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Hundratusentals människor står utanför arbetsmarknaden. Ert företag kan göra skillnad 
              – genom praktik, arbetsträning och rättvisa anställningar. <strong className="text-white">Är ni redo?</strong>
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a 
                href="#join" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-gray-900 rounded-xl font-bold text-lg hover:bg-amber-400 transition-all hover:scale-105 shadow-xl shadow-amber-500/30"
              >
                Acceptera utmaningen
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#impact" 
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Se vår påverkan
              </a>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {impactStats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <stat.icon className="w-6 h-6 text-amber-400 mb-2" />
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vår utmaning till er
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Till alla medlemmar i <strong>Global Compact Swedish Network</strong>, 
              <strong> Diversity Charter Sweden</strong> och företag med CSR-ambitioner.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {challengePoints.map((point, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 h-full">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                    <point.icon className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{point.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white text-center">
            <blockquote className="text-2xl md:text-3xl font-medium mb-6 leading-relaxed">
              "Det enda som krävs för att ondskan ska segra är att goda människor 
              inte gör någonting."
            </blockquote>
            <p className="text-gray-400">– Edmund Burke</p>
            <p className="text-amber-400 mt-4 font-semibold">
              Detsamma gäller arbetsmarknaden. Passivitet är inte neutralt.
            </p>
          </div>
        </div>
      </section>

      {/* Networks We Challenge */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Building2 className="w-4 h-4" />
              Till dessa nätverk och deras medlemmar
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vi riktar oss till er
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Global Compact */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Global Compact Swedish Network</h3>
                  <p className="text-blue-600 font-medium">FN:s initiativ för hållbart företagande</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Ni har åtagit er att följa FN:s 10 principer – inklusive att <strong>eliminera diskriminering 
                i arbetslivet</strong> (princip 6). TendBee hjälper er att leva upp till det löftet.
              </p>
              <div className="flex flex-wrap gap-2">
                {globalCompactMembers.slice(0, 8).map((member, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
                    {member}
                  </span>
                ))}
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-bold">
                  +200 fler
                </span>
              </div>
            </div>

            {/* Diversity Charter */}
            <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Diversity Charter Sweden</h3>
                  <p className="text-purple-600 font-medium">Nätverk för mångfald och inkludering</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Som medlemmar har ni förbundit er att <strong>aktivt arbeta för inkludering</strong>. 
                Nu erbjuder vi ett konkret verktyg för att gå från löften till resultat.
              </p>
              <div className="flex flex-wrap gap-2">
                {diversityCharterMembers.slice(0, 8).map((member, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full font-medium">
                    {member}
                  </span>
                ))}
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-bold">
                  +70 fler
                </span>
              </div>
            </div>
          </div>

          {/* All companies with CSR */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Och till ALLA företag med CSR-ambitioner
            </h3>
            <p className="text-lg text-amber-900 mb-6 max-w-2xl mx-auto">
              Oavsett om ni är medlemmar i något nätverk eller inte – om ni har en hållbarhetsrapport, 
              ett CSR-mål eller bara en vilja att göra gott – <strong>den här utmaningen gäller er</strong>.
            </p>
            <a 
              href="#join" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              Vi vill vara med
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* What You Can Offer */}
      <section id="opportunities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HeartHandshake className="w-4 h-4" />
              Så kan ni bidra
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tre sätt att göra skillnad
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Välj det som passar er organisation bäst – eller kombinera alla tre för maximal påverkan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {opportunityTypes.map((opp, idx) => (
              <div 
                key={idx} 
                className={`relative bg-white rounded-3xl border-2 p-8 transition-all hover:shadow-2xl hover:-translate-y-2 ${
                  opp.color === 'blue' ? 'border-blue-200 hover:border-blue-400' :
                  opp.color === 'green' ? 'border-green-200 hover:border-green-400' :
                  'border-amber-200 hover:border-amber-400'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  opp.color === 'blue' ? 'bg-blue-100' :
                  opp.color === 'green' ? 'bg-green-100' :
                  'bg-amber-100'
                }`}>
                  <opp.icon className={`w-8 h-8 ${
                    opp.color === 'blue' ? 'text-blue-600' :
                    opp.color === 'green' ? 'text-green-600' :
                    'text-amber-600'
                  }`} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{opp.type}</h3>
                <p className="text-gray-600 mb-4">{opp.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Clock className="w-4 h-4" />
                  {opp.duration}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Fördelar för er:</p>
                  {opp.benefits.map((benefit, bidx) => (
                    <div key={bidx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 ${
                        opp.color === 'blue' ? 'text-blue-500' :
                        opp.color === 'green' ? 'text-green-500' :
                        'text-amber-500'
                      }`} />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & SDGs */}
      <section id="impact" className="py-20 bg-gradient-to-br from-slate-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bidra till Agenda 2030
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Genom att samarbeta med TendBee bidrar ni direkt till FN:s globala mål för hållbar utveckling.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {relevantSDGs.map((sdg) => (
              <div 
                key={sdg.number}
                className="flex items-center gap-3 px-6 py-4 rounded-xl"
                style={{ backgroundColor: sdg.color }}
              >
                <span className="text-3xl font-black text-white">{sdg.number}</span>
                <span className="text-sm font-medium text-white/90">{sdg.title}</span>
              </div>
            ))}
          </div>

          {/* Impact metrics */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: '10 000+', label: 'Matchningar gjorda', icon: Handshake },
              { value: '500+', label: 'Partnerföretag', icon: Building2 },
              { value: '73%', label: 'Fick jobb efter praktik', icon: TrendingUp },
              { value: '100%', label: 'Diskrimineringsfri matchning', icon: Shield },
            ].map((metric, idx) => (
              <div key={idx} className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                <metric.icon className="w-8 h-8 text-amber-400 mx-auto mb-4" />
                <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-sm text-gray-400">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Så enkelt kommer ni igång
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Kontakta oss', desc: 'Berätta om er organisation och era mål', icon: Mail },
              { step: '2', title: 'Skapa konto', desc: 'Vi sätter upp ert företagskonto på 24h', icon: Building2 },
              { step: '3', title: 'Publicera möjligheter', desc: 'Lägg ut praktik, arbetsträning eller jobb', icon: Briefcase },
              { step: '4', title: 'Matcha & Anställ', desc: 'AI matchar er med rätt kandidater', icon: Zap },
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                <div className="text-7xl font-black text-gray-100 absolute -top-2 left-1/2 -translate-x-1/2">
                  {item.step}
                </div>
                <div className="relative z-10 pt-10">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-20 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
            Accepterar ni utmaningen?
          </h2>
          <p className="text-xl text-amber-900 mb-8 max-w-2xl mx-auto">
            Bli en del av förändringen. Erbjud praktikplatser, arbetsträning eller anställningar 
            – och gör verklig skillnad för människor och samhälle.
          </p>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vi lovar att göra det enkelt för er
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              {[
                'Inga komplicerade processer',
                'Stöd i hela matchningen',
                'Mätbar CSR-påverkan',
                'Rapporter för hållbarhetsredovisning',
                'Kostnadsfri uppsättning',
                'Dedikerad kontaktperson',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gray-900" />
                  <span className="text-sm font-medium text-gray-900">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:partners@tendbee.se?subject=Vi accepterar utmaningen!"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl"
            >
              <Mail className="w-5 h-5" />
              partners@tendbee.se
            </a>
            <a 
              href="tel:+46701234567"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
            >
              <Phone className="w-5 h-5" />
              Ring oss direkt
            </a>
          </div>

          <p className="mt-8 text-amber-900 font-medium">
            🐝 Tillsammans bygger vi ett Sverige där kompetens, inte bakgrund, avgör vem som får jobbet.
          </p>
        </div>
      </section>

      {/* Final Message */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-2xl font-medium text-gray-300 leading-relaxed">
            "Varje praktikplats ni erbjuder är en investering i en människa. 
            Varje anställning ni gör är ett steg mot ett mer jämlikt samhälle. 
            <span className="text-amber-400 font-bold"> Ni har makten att förändra.</span>"
          </p>
          <p className="text-amber-500 mt-6 font-semibold">– TendBee-teamet</p>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
