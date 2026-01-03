import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, AlertTriangle, Scale, CreditCard, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';

export default function TermsOfServicePage() {
  const navigate = useNavigate();
  const lastUpdated = '2025-01-03';

  const sections = [
    {
      number: '1',
      title: 'Godkännande av villkor',
      content: `Genom att skapa ett konto eller använda Tendbees tjänster godkänner du dessa 
      allmänna villkor. Om du inte accepterar villkoren får du inte använda tjänsten. 
      Vi förbehåller oss rätten att ändra dessa villkor, och det är ditt ansvar att 
      regelbundet kontrollera eventuella uppdateringar.`
    },
    {
      number: '2',
      title: 'Beskrivning av tjänsten',
      content: `Tendbee är en digital plattform som matchar arbetssökande med arbetsgivare 
      baserat på kompetenser och erfarenheter. Tjänsten inkluderar:\n\n
      • Skapande av profil och CV\n
      • AI-baserad jobbmatchning\n
      • Anonyma ansökningar (Tendbee Plus)\n
      • QR-kod för snabb profildelning\n
      • Certifierad utbildning via Keeada Academy`
    },
    {
      number: '3',
      title: 'Användaransvar',
      content: `Som användare ansvarar du för att:\n\n
      • All information du anger är korrekt och sanningsenlig\n
      • Du endast använder tjänsten för lagliga ändamål\n
      • Du inte sprider olämpligt, stötande eller diskriminerande innehåll\n
      • Du håller dina inloggningsuppgifter konfidentiella\n
      • Du inte försöker manipulera eller störa tjänstens funktionalitet`
    },
    {
      number: '4',
      title: 'Immateriella rättigheter',
      content: `Allt innehåll på Tendbee, inklusive logotyper, design, text och programvara, 
      ägs av Tendbee AB eller våra licensgivare. Du får inte kopiera, distribuera, 
      modifiera eller skapa derivatverk av vårt innehåll utan skriftligt tillstånd. 
      Du behåller äganderätten till det innehåll du laddar upp, men ger oss en licens 
      att använda det för att tillhandahålla tjänsten.`
    },
    {
      number: '5',
      title: 'Tendbee Plus - Premiumtjänst',
      content: `Tendbee Plus är en betaltjänst som ger tillgång till:\n\n
      • Anonyma jobbansökningar\n
      • Möjlighet att dölja ålder, kön och profilbild\n
      • Prioriterad matchning\n
      • Tillgång till exklusiva jobbmöjligheter\n\n
      Prenumerationen förnyas automatiskt tills du avbryter. Återbetalning sker enligt 
      konsumentköplagen.`
    },
    {
      number: '6',
      title: 'Ansvarsbegränsning',
      content: `Tendbee tillhandahålls "som den är". Vi garanterar inte att tjänsten är 
      felfri eller oavbruten. Vi ansvarar inte för:\n\n
      • Indirekta skador eller följdskador\n
      • Förlust av data eller intäkter\n
      • Handlingar från tredje part (arbetsgivare/jobbsökare)\n
      • Avbrott orsakade av tekniska problem utanför vår kontroll\n\n
      Vår maximala ansvarighet är begränsad till det belopp du betalat för tjänsten 
      under de senaste 12 månaderna.`
    },
    {
      number: '7',
      title: 'Uppsägning',
      content: `Du kan när som helst avsluta ditt konto genom att kontakta oss eller 
      via kontoinställningar. Vi förbehåller oss rätten att stänga av eller avsluta 
      konton som bryter mot dessa villkor. Vid uppsägning kommer dina uppgifter att 
      raderas i enlighet med vår integritetspolicy, om inte lagkrav kräver att vi 
      behåller dem.`
    },
    {
      number: '8',
      title: 'Tvistlösning',
      content: `Dessa villkor regleras av svensk lag. Eventuella tvister ska i första 
      hand lösas genom förhandling. Om detta inte lyckas ska tvisten avgöras av 
      svensk allmän domstol med Stockholms tingsrätt som första instans. Som konsument 
      kan du också vända dig till Allmänna reklamationsnämnden (ARN) eller EU:s 
      tvistlösningsplattform.`
    }
  ];

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
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Juridiskt dokument
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Allmänna villkor
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Dessa villkor reglerar din användning av Tendbees tjänster. 
            Läs igenom dem noggrant innan du skapar ett konto.
          </p>
          <p className="text-sm text-gray-500">
            Senast uppdaterad: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Table of Contents */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Innehållsförteckning</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a 
                  key={section.number}
                  href={`#section-${section.number}`}
                  className="text-amber-600 hover:text-amber-700 hover:underline"
                >
                  {section.number}. {section.title}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div 
                key={section.number} 
                id={`section-${section.number}`}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 scroll-mt-24"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{section.number}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                    <div className="text-gray-600 whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Questions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mt-8 text-white">
            <h3 className="text-xl font-bold mb-4">Har du frågor?</h3>
            <p className="text-gray-300 mb-6">
              Om du har frågor om våra villkor eller behöver hjälp, tveka inte att kontakta oss.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.location.href = 'mailto:support@tendbee.se'}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Kontakta support
              </Button>
              <Button 
                onClick={() => navigate('/integritetspolicy')}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                Läs integritetspolicy
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
