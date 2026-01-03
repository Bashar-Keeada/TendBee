import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Handshake, ExternalLink, Heart, Globe, Users, Target,
  Building2, Award, Sparkles,
  ArrowRight, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';

// Official UN SDG Icons as SVG components with official colors
const SDGIcon4 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect fill="#C5192D" width="100" height="100"/>
    <g fill="white">
      <text x="10" y="25" fontSize="12" fontWeight="bold">4</text>
      <path d="M25,35 L25,70 L35,70 L35,55 L50,55 L50,70 L60,70 L60,35 L50,35 L50,45 L35,45 L35,35 Z M65,35 L65,70 L75,60 L75,70 L85,70 L85,35 L75,45 L75,35 Z"/>
      <circle cx="50" cy="75" r="3"/>
    </g>
  </svg>
);

const SDGIcon5 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect fill="#EF402B" width="100" height="100"/>
    <g fill="white">
      <text x="10" y="25" fontSize="12" fontWeight="bold">5</text>
      <circle cx="50" cy="40" r="12"/>
      <path d="M35,55 Q50,75 65,55 L65,80 L35,80 Z"/>
      <path d="M42,38 L42,42 M58,38 L58,42"/>
      <path d="M30,65 L70,65"/>
    </g>
  </svg>
);

const SDGIcon8 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect fill="#A21942" width="100" height="100"/>
    <g fill="white">
      <text x="10" y="25" fontSize="12" fontWeight="bold">8</text>
      <path d="M30,40 L30,75 L45,60 L55,70 L70,55 L70,40 L55,55 L45,45 Z"/>
    </g>
  </svg>
);

const SDGIcon10 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect fill="#DD1367" width="100" height="100"/>
    <g fill="white">
      <text x="6" y="25" fontSize="12" fontWeight="bold">10</text>
      <path d="M50,30 L60,50 L80,50 L65,62 L70,80 L50,68 L30,80 L35,62 L20,50 L40,50 Z"/>
    </g>
  </svg>
);

const SDGIcon17 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect fill="#19486A" width="100" height="100"/>
    <g fill="white">
      <text x="6" y="25" fontSize="12" fontWeight="bold">17</text>
      <circle cx="50" cy="55" r="20" fill="none" stroke="white" strokeWidth="4"/>
      <circle cx="50" cy="55" r="8"/>
      <path d="M50,30 L50,25 M50,85 L50,80 M25,55 L20,55 M80,55 L75,55"/>
    </g>
  </svg>
);

// Official SDG Goal data with correct colors
const sdgGoals = [
  {
    number: 4,
    title: 'God utbildning för alla',
    titleEn: 'Quality Education',
    description: 'Genom Keeada Academy erbjuder vi praktik och utbildning som ger människor verktyg att komma in på arbetsmarknaden.',
    color: '#C5192D',
    icon: SDGIcon4,
    tendbeeAction: 'Keeada Academy - certifierad utbildning inom lager & logistik'
  },
  {
    number: 5,
    title: 'Jämställdhet',
    titleEn: 'Gender Equality',
    description: 'Vi bekämpar könsdiskriminering genom att erbjuda anonyma matchningar där kön kan döljas.',
    color: '#EF402B',
    icon: SDGIcon5,
    tendbeeAction: 'Anonyma jobbansökningar utan könsidentifiering'
  },
  {
    number: 8,
    title: 'Anständiga arbetsvillkor och ekonomisk tillväxt',
    titleEn: 'Decent Work and Economic Growth',
    description: 'Vi kopplar samman arbetssökande med arbetsgivare för att skapa fler jobbtillfällen och ekonomisk tillväxt.',
    color: '#A21942',
    icon: SDGIcon8,
    tendbeeAction: '10,000+ lyckade matchningar mellan jobbsökare och företag'
  },
  {
    number: 10,
    title: 'Minskad ojämlikhet',
    titleEn: 'Reduced Inequalities',
    description: 'Vår plattform är designad för att ge alla lika möjligheter oavsett bakgrund, ålder eller utseende.',
    color: '#DD1367',
    icon: SDGIcon10,
    tendbeeAction: 'Plus-medlemskap för att dölja ålder, kön och bild'
  },
  {
    number: 17,
    title: 'Genomförande och globalt partnerskap',
    titleEn: 'Partnerships for the Goals',
    description: 'Vi samarbetar med företag, organisationer och myndigheter för att skapa en mer inkluderande arbetsmarknad.',
    color: '#19486A',
    icon: SDGIcon17,
    tendbeeAction: 'Partnerskap med Diversity Charter Sweden och 500+ företag'
  }
];

// UN Global Compact 10 Principles
const globalCompactPrinciples = [
  { category: 'Mänskliga rättigheter', principles: ['Stödja och respektera internationellt erkända mänskliga rättigheter', 'Försäkra att företaget inte är delaktigt i kränkningar av mänskliga rättigheter'] },
  { category: 'Arbetsrätt', principles: ['Upprätthålla föreningsfrihet och erkänna rätten till kollektiva förhandlingar', 'Avskaffa alla former av tvångsarbete', 'Avskaffa barnarbete', 'Eliminera diskriminering i arbetslivet'] },
  { category: 'Miljö', principles: ['Stödja försiktighetsprincipen vad gäller miljörisker', 'Ta initiativ för att främja större miljömässigt ansvarstagande', 'Uppmuntra utveckling och spridning av miljövänlig teknik'] },
  { category: 'Antikorruption', principles: ['Motarbeta alla former av korruption, inklusive utpressning och mutor'] }
];

// Partner organizations
const partners = [
  {
    name: 'Diversity Charter Sweden',
    description: 'Nätverk för företag och organisationer som arbetar för mångfald och inkludering på arbetsplatsen.',
    type: 'Huvudpartner',
    url: 'https://diversitycharter.se',
    featured: true
  },
  {
    name: 'Arbetsförmedlingen',
    description: 'Sveriges offentliga arbetsförmedling som vi samarbetar med för att hjälpa arbetssökande.',
    type: 'Myndighetspartner',
    url: 'https://arbetsformedlingen.se',
    featured: true
  },
  {
    name: 'Svenskt Näringsliv',
    description: 'Företräder näringslivets intressen och främjar en bra företagsmiljö.',
    type: 'Branschpartner',
    url: 'https://svensktnaringsliv.se',
    featured: false
  },
  {
    name: 'Almega',
    description: 'Arbetsgivarorganisation för tjänsteföretag i Sverige.',
    type: 'Branschpartner',
    url: 'https://almega.se',
    featured: false
  },
  {
    name: 'IF Metall',
    description: 'Fackförbund för industriarbetare som vi samarbetar med kring rättvisa arbetsvillkor.',
    type: 'Facklig partner',
    url: 'https://ifmetall.se',
    featured: false
  },
  {
    name: 'Länsstyrelserna',
    description: 'Samarbete för att främja integration och sysselsättning regionalt.',
    type: 'Myndighetspartner',
    url: 'https://lansstyrelsen.se',
    featured: false
  }
];

// SDG Card Component with Official Icons
const SDGCard = ({ goal }) => {
  const IconComponent = goal.icon;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
      <div className="h-2" style={{ backgroundColor: goal.color }}></div>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow"
          >
            <IconComponent />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">{goal.title}</h3>
            <p className="text-sm text-gray-500">{goal.titleEn}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">{goal.tendbeeAction}</p>
        </div>
      </div>
    </div>
  );
};

// Partner Card Component
const PartnerCard = ({ partner }) => (
  <div className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-lg ${
    partner.featured ? 'border-amber-200 shadow-sm' : 'border-gray-100'
  }`}>
    {partner.featured && (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full mb-4">
        <Award className="w-3 h-3" />
        {partner.type}
      </span>
    )}
    {!partner.featured && (
      <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full mb-4">
        {partner.type}
      </span>
    )}
    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
      <span className="text-2xl font-bold text-gray-400">{partner.name.charAt(0)}</span>
    </div>
    <h3 className="font-bold text-gray-900 mb-2">{partner.name}</h3>
    <p className="text-gray-600 text-sm mb-4">{partner.description}</p>
    <a 
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm"
    >
      Besök webbplats
      <ExternalLink className="w-4 h-4" />
    </a>
  </div>
);

export default function PartnersPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navigation */}
      <MainNavigation transparent={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              Agenda 2030 & Hållbarhet
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Partners & <span className="text-amber-400">Hållbarhet</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Vi arbetar enligt FN:s Agenda 2030 och Global Compacts 10 principer. 
              Tillsammans med våra partners skapar vi en mer inkluderande arbetsmarknad.
            </p>
          </div>
        </div>
      </section>

      {/* Agenda 2030 Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              FN:s Globala mål
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Agenda 2030
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vi har identifierat fem av FN:s 17 globala mål för hållbar utveckling 
              som är särskilt relevanta för vår verksamhet och vision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sdgGoals.map((goal) => (
              <SDGCard key={goal.number} goal={goal} />
            ))}
          </div>

          {/* SDG Wheel Image Placeholder */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 via-green-500 to-amber-500 rounded-full mb-4">
              <Globe className="w-16 h-16 text-white" />
            </div>
            <p className="text-sm text-gray-500">FN:s 17 globala mål för hållbar utveckling</p>
          </div>
        </div>
      </section>

      {/* Global Compact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Scale className="w-4 h-4" />
              UN Global Compact
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              De 10 principerna
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vi stödjer FN:s Global Compact och dess tio principer inom områdena 
              mänskliga rättigheter, arbetsrätt, miljö och antikorruption.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {globalCompactPrinciples.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.principles.map((principle, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Handshake className="w-4 h-4" />
              Vårt nätverk
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Våra partners
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vi samarbetar med ledande organisationer för att skapa en mer 
              inkluderande och rättvis arbetsmarknad i Sverige.
            </p>
          </div>

          {/* Featured Partners */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {partners.filter(p => p.featured).map((partner, index) => (
              <PartnerCard key={index} partner={partner} />
            ))}
          </div>

          {/* Other Partners */}
          <h3 className="font-semibold text-gray-900 mb-4">Fler partners</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {partners.filter(p => !p.featured).map((partner, index) => (
              <PartnerCard key={index} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Diversity Charter Highlight */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                Stolt medlem
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Diversity Charter Sweden
              </h2>
              <p className="text-purple-100 mb-6 text-lg">
                Tendbee är stolt medlem av Diversity Charter Sweden - ett nätverk 
                av över 70 organisationer som tillsammans representerar mer än 
                300 000 anställda.
              </p>
              <p className="text-purple-100 mb-8">
                Genom vårt medlemskap förbinder vi oss att skapa och upprätthålla 
                inkluderande arbetsmiljöer utan diskriminering baserat på kön, 
                etnicitet, religion, ålder, funktionsnedsättning eller sexuell läggning.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">70+</p>
                  <p className="text-xs text-purple-200">Medlemsorganisationer</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">300K+</p>
                  <p className="text-xs text-purple-200">Anställda totalt</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">27</p>
                  <p className="text-xs text-purple-200">EU-länder</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Vårt åtagande</h3>
                <ul className="text-left space-y-3">
                  {[
                    'Främja mångfald i rekrytering',
                    'Skapa inkluderande arbetsplatser',
                    'Motverka diskriminering aktivt',
                    'Utbilda om omedvetna fördomar',
                    'Mäta och följa upp mångfaldsarbete'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Vill du bli partner?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Är din organisation intresserad av att samarbeta med oss för en mer 
            inkluderande arbetsmarknad? Kontakta oss för att diskutera partnerskap.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => window.location.href = 'mailto:partners@tendbee.se'}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg"
            >
              Kontakta oss
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate('/om-oss')}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg"
            >
              Läs mer om oss
            </Button>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <MainFooter />
    </div>
  );
}
