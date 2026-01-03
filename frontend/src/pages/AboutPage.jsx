import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Target, Users, Lightbulb, Shield, 
  Globe, Award, Sparkles, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';

// Team Member Component
const TeamMember = ({ name, role, description }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
      <span className="text-3xl font-bold text-amber-600">{name.charAt(0)}</span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{name}</h3>
    <p className="text-amber-600 text-sm font-medium text-center mb-3">{role}</p>
    <p className="text-gray-600 text-sm text-center">{description}</p>
  </div>
);

// Value Card Component
const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100">
    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-amber-600" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: 'Passion för människor',
      description: 'Vi tror på varje individs potential och arbetar för att alla ska få en rättvis chans på arbetsmarknaden.'
    },
    {
      icon: Shield,
      title: 'Integritet först',
      description: 'Vi skyddar användarnas data och bekämpar aktivt diskriminering genom anonyma matchningar.'
    },
    {
      icon: Target,
      title: 'Kompetensbaserad matchning',
      description: 'Vi fokuserar på vad du kan - inte hur du ser ut, ditt kön eller din ålder.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Vi använder AI och modern teknik för att revolutionera rekryteringsprocessen.'
    },
    {
      icon: Globe,
      title: 'Inkludering',
      description: 'Vår plattform är designad för att ge alla lika möjligheter oavsett bakgrund.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Vi bygger broar mellan arbetssökande och arbetsgivare för ett bättre arbetsliv.'
    }
  ];

  const team = [
    {
      name: 'Bashar Al-Keeada',
      role: 'Grundare & VD',
      description: 'Visionär entreprenör med bakgrund inom logistik och tech. Grundade Tendbee för att demokratisera rekrytering.'
    },
    {
      name: 'Keeada Academy',
      role: 'Utbildning & Praktik',
      description: 'Vårt utbildningsprogram som ger arbetssökande praktiska färdigheter och certifieringar inom lager & logistik.'
    },
    {
      name: 'Tech Team',
      role: 'Produktutveckling',
      description: 'Ett dedikerat team av utvecklare och designers som bygger framtidens rekryteringsplattform.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navigation */}
      <MainNavigation transparent={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Världens första anti-diskriminerande jobbplattform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Vi bygger framtidens <span className="text-amber-400">rekrytering</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Tendbee grundades med en enkel men kraftfull vision: att skapa en arbetsmarknad 
              där alla bedöms på sina kompetenser - inte sitt utseende, kön eller ålder.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Vår mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Att ge alla en rättvis chans på arbetsmarknaden
              </h2>
              <p className="text-gray-600 mb-6">
                Vi tror att varje människa har unika talanger och förmågor som förtjänar att 
                upptäckas. Tyvärr missar traditionell rekrytering ofta de bästa kandidaterna 
                på grund av omedvetna fördomar.
              </p>
              <p className="text-gray-600 mb-6">
                Tendbee löser detta genom att fokusera på det som verkligen spelar roll: 
                kompetenser, erfarenheter och motivation. Med vårt unika integritetsskydd 
                kan jobbsökare välja att dölja personlig information och bli matchade 
                helt anonymt.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">10,000+</p>
                  <p className="text-sm text-gray-500">Matchade kandidater</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">500+</p>
                  <p className="text-sm text-gray-500">Företag</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">95%</p>
                  <p className="text-sm text-gray-500">Nöjda användare</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300/30 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  "Alla förtjänar en chans"
                </h3>
                <p className="text-gray-700">
                  Vi startade Tendbee efter att ha sett hur många talangfulla människor 
                  blev förbisedda på grund av diskriminering. Nu bygger vi framtiden - 
                  en arbetsmarknad där kompetens alltid vinner.
                </p>
                <p className="text-amber-700 font-semibold mt-4">
                  — Bashar, Grundare
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Våra värderingar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dessa principer vägleder allt vi gör - från produktutveckling till hur vi behandlar våra användare.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Teamet bakom Tendbee
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ett passionerat team som arbetar för att förändra hur rekrytering fungerar.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Keeada Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Keeada Academy
              </h2>
              <p className="text-amber-100 mb-6 text-lg">
                Vår utbildningsgren som ger arbetssökande praktiska färdigheter och 
                certifieringar inom lager och logistik. Genom Keeada Academy kan du:
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Få betald praktik hos ledande företag',
                  'Certifieras inom truckkörning och lagerarbete',
                  'Bygga ett nätverk med arbetsgivare',
                  'Få direkt väg till anställning'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => navigate('/app')}
                className="bg-white text-amber-600 hover:bg-amber-50"
              >
                Ansök till Keeada Academy
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">2-4</p>
                <p className="text-amber-100 mb-6">veckors utbildning</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-xs text-amber-100">Betald praktik</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-xs text-amber-100">Får anställning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Redo att vara med på resan?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Oavsett om du söker jobb eller letar efter talanger - vi finns här för att hjälpa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/app')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg"
            >
              Skapa konto gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate('/karriar')}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg"
            >
              Se lediga tjänster
            </Button>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <MainFooter />
    </div>
  );
}
