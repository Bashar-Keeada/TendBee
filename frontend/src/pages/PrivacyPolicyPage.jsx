import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const lastUpdated = '2025-01-03';

  const sections = [
    {
      icon: Database,
      title: 'Vilka uppgifter samlar vi in?',
      content: [
        'Personuppgifter: Namn, e-postadress, telefonnummer och adress som du anger vid registrering.',
        'Profilinformation: CV, utbildning, arbetslivserfarenhet, kompetenser och certifieringar.',
        'Användningsdata: Information om hur du använder vår tjänst, inklusive inloggningshistorik och interaktioner.',
        'Teknisk data: IP-adress, webbläsartyp, enhetsinformation och cookies.'
      ]
    },
    {
      icon: Eye,
      title: 'Hur använder vi dina uppgifter?',
      content: [
        'Matchning: För att matcha dig med relevanta jobb och arbetsgivare baserat på dina kompetenser.',
        'Kommunikation: För att skicka jobberbjudanden, uppdateringar och viktig information.',
        'Förbättring: För att analysera och förbättra vår tjänst och användarupplevelse.',
        'Säkerhet: För att skydda mot bedrägeri och säkerställa plattformens integritet.'
      ]
    },
    {
      icon: UserCheck,
      title: 'Dina rättigheter enligt GDPR',
      content: [
        'Tillgång: Du har rätt att begära en kopia av alla personuppgifter vi har om dig.',
        'Rättelse: Du kan begära att vi korrigerar felaktiga eller ofullständiga uppgifter.',
        'Radering: Du kan begära att vi raderar dina personuppgifter ("rätten att bli glömd").',
        'Dataportabilitet: Du kan begära att få dina uppgifter i ett maskinläsbart format.',
        'Invändning: Du kan invända mot viss behandling av dina personuppgifter.'
      ]
    },
    {
      icon: Lock,
      title: 'Hur skyddar vi dina uppgifter?',
      content: [
        'Kryptering: All datatrafik är krypterad med SSL/TLS-teknik.',
        'Säker lagring: Dina uppgifter lagras på säkra servrar inom EU.',
        'Åtkomstkontroll: Endast behörig personal har tillgång till personuppgifter.',
        'Regelbundna säkerhetsgranskningar: Vi genomför kontinuerliga säkerhetstester.'
      ]
    },
    {
      icon: Shield,
      title: 'Tendbee Plus - Integritetsskydd',
      content: [
        'Anonymitet: Med Tendbee Plus kan du dölja ålder, kön och profilbild för arbetsgivare.',
        'Anonymt ID: Du tilldelas ett unikt anonymt ID istället för ditt riktiga namn.',
        'Kompetensbaserad matchning: Arbetsgivare ser endast dina kompetenser, inte din identitet.',
        'Diskrimineringsskydd: Minskar risken för omedvetna fördomar i rekryteringsprocessen.'
      ]
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
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            GDPR-kompatibel
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Integritetspolicy
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Vi värnar om din integritet. Här förklarar vi hur Tendbee samlar in, 
            använder och skyddar dina personuppgifter.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Översikt</h2>
            <p className="text-gray-600 mb-4">
              Tendbee AB ("vi", "oss", "vår") är personuppgiftsansvarig för behandlingen 
              av dina personuppgifter. Vi följer EU:s dataskyddsförordning (GDPR) och 
              svensk dataskyddslag.
            </p>
            <p className="text-gray-600">
              Denna integritetspolicy förklarar vilka uppgifter vi samlar in, hur vi 
              använder dem, och vilka rättigheter du har som användare av vår plattform.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                      <ul className="space-y-3">
                        {section.content.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-600">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 mt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kontakta oss</h3>
                <p className="text-gray-600 mb-4">
                  Har du frågor om hur vi hanterar dina personuppgifter eller vill utöva 
                  dina rättigheter? Kontakta vårt dataskyddsombud.
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>E-post:</strong> privacy@tendbee.se</p>
                  <p><strong>Adress:</strong> Tendbee AB, Storgatan 1, 111 23 Stockholm</p>
                  <p><strong>Organisationsnummer:</strong> 559XXX-XXXX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
