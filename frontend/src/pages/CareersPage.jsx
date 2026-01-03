import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, MapPin, Clock, ArrowRight, 
  Heart, Coffee, Laptop, Users, Sparkles, Check,
  Building2, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNavigation, MainFooter } from '@/components/MainNavigation';

// Job Card Component
const JobCard = ({ job, onApply }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.type}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.isNew ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {job.isNew ? 'Ny' : 'Öppen'}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{job.summary}</p>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm mb-4"
        >
          {expanded ? 'Visa mindre' : 'Visa mer'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="mb-4 space-y-4 animate-fade-in">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Om rollen</h4>
              <p className="text-gray-600 text-sm">{job.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Vi söker dig som</h4>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Vi erbjuder</h4>
              <ul className="space-y-2">
                {job.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Button 
          onClick={() => onApply(job)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        >
          Ansök nu
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Perk Card Component
const PerkCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-100">
    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
      <Icon className="w-6 h-6 text-amber-600" />
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

export default function CareersPage() {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Senior Full-Stack Utvecklare',
      department: 'Tech',
      location: 'Stockholm / Remote',
      type: 'Heltid',
      isNew: true,
      summary: 'Vi söker en erfaren utvecklare som vill vara med och bygga framtidens rekryteringsplattform.',
      description: 'Som Senior Full-Stack Utvecklare kommer du att spela en central roll i utvecklingen av vår plattform. Du kommer att arbeta med React, Node.js och moderna molntjänster för att skapa en sömlös upplevelse för våra användare.',
      requirements: [
        'Minst 4 års erfarenhet av full-stack utveckling',
        'Erfarenhet av React, TypeScript och Node.js',
        'Förståelse för databaser (SQL och NoSQL)',
        'Passion för att bygga användarvänliga produkter',
        'Flytande svenska och engelska'
      ],
      benefits: [
        'Flexibla arbetstider och remote-möjligheter',
        'Generöst optionsprogram',
        'Friskvårdsbidrag på 5000 kr/år',
        'MacBook Pro och valfri utrustning'
      ]
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Stockholm',
      type: 'Heltid',
      isNew: true,
      summary: 'Designa användarupplevelser som gör skillnad för tusentals jobbsökande.',
      description: 'Vi söker en kreativ UX/UI Designer som brinner för att skapa intuitiva och tillgängliga digitala upplevelser. Du kommer att arbeta nära produktteamet för att designa lösningar som hjälper människor att hitta jobb.',
      requirements: [
        '3+ års erfarenhet inom UX/UI design',
        'Erfarenhet av Figma och prototyping',
        'Förståelse för tillgänglighet och inkluderande design',
        'Portfolio som visar tidigare arbeten',
        'Förmåga att kommunicera designbeslut'
      ],
      benefits: [
        'Kreativ frihet att påverka produkten',
        'Arbeta med meningsfulla projekt',
        'Utvecklingsbudget för konferenser och kurser',
        'Härligt team och trevligt kontor i centrala Stockholm'
      ]
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      department: 'Sälj',
      location: 'Stockholm',
      type: 'Heltid',
      isNew: false,
      summary: 'Hjälp våra företagskunder att lyckas med sin rekrytering.',
      description: 'Som Customer Success Manager ansvarar du för att våra företagskunder får ut maximalt värde av Tendbee. Du kommer att bygga långsiktiga relationer och vara kundens röst internt.',
      requirements: [
        '2+ års erfarenhet inom Customer Success eller liknande',
        'Utmärkt kommunikationsförmåga på svenska och engelska',
        'Erfarenhet av B2B SaaS är meriterande',
        'Analytisk förmåga och datadriven approach',
        'Passion för kundservice och problemlösning'
      ],
      benefits: [
        'Provisionsbaserad bonus',
        'Karriärmöjligheter i ett växande bolag',
        'Centralt kontor med parkering',
        'Regelbundna teamaktiviteter'
      ]
    },
    {
      id: 4,
      title: 'Praktikhandledare - Keeada Academy',
      department: 'Utbildning',
      location: 'Arlanda',
      type: 'Heltid',
      isNew: false,
      summary: 'Utbilda och handleda nästa generation lagerarbetare.',
      description: 'Som Praktikhandledare på Keeada Academy kommer du att utbilda och stötta praktikanter inom lager och logistik. Du spelar en avgörande roll i att hjälpa människor in på arbetsmarknaden.',
      requirements: [
        'Erfarenhet inom lager och logistik',
        'Truckkort A och B',
        'Pedagogiskt intresse och tålamod',
        'God förmåga att kommunicera och motivera',
        'Positiv inställning och flexibilitet'
      ],
      benefits: [
        'Meningsfullt arbete som gör skillnad',
        'Utvecklingsmöjligheter inom organisationen',
        'Kollektivavtal och tjänstepension',
        'Trevlig arbetsmiljö'
      ]
    },
    {
      id: 5,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Stockholm / Hybrid',
      type: 'Heltid',
      isNew: true,
      summary: 'Driv vår tillväxt genom kreativ och datadriven marknadsföring.',
      description: 'Vi söker en driven Marketing Manager som vill ta vårt varumärke till nästa nivå. Du kommer att ansvara för hela marknadsföringsmixen - från content och sociala medier till performance marketing.',
      requirements: [
        '4+ års erfarenhet inom B2B/B2C marknadsföring',
        'Erfarenhet av digitala kanaler och analytics',
        'Kreativ förmåga att skapa engagerande innehåll',
        'Erfarenhet av budgetansvar',
        'Förmåga att arbeta självständigt'
      ],
      benefits: [
        'Stor kreativ frihet',
        'Budget för marknadsaktiviteter',
        'Flexibelt hybridarbete',
        'Bonusprogram kopplat till tillväxtmål'
      ]
    }
  ];

  const departments = [
    { id: 'all', name: 'Alla avdelningar' },
    { id: 'Tech', name: 'Tech' },
    { id: 'Design', name: 'Design' },
    { id: 'Sälj', name: 'Sälj' },
    { id: 'Marketing', name: 'Marketing' },
    { id: 'Utbildning', name: 'Utbildning' }
  ];

  const perks = [
    {
      icon: Laptop,
      title: 'Remote-vänligt',
      description: 'Arbeta hemifrån, från kontoret eller en mix - du väljer!'
    },
    {
      icon: Heart,
      title: 'Friskvård',
      description: '5000 kr per år att spendera på din hälsa och välmående.'
    },
    {
      icon: Coffee,
      title: 'Fika & lunch',
      description: 'Gratis fika varje dag och subventionerad lunch.'
    },
    {
      icon: Users,
      title: 'Teamaktiviteter',
      description: 'Regelbundna AWs, teamdagar och konferenser.'
    },
    {
      icon: Sparkles,
      title: 'Utveckling',
      description: 'Budget för kurser, konferenser och certifieringar.'
    },
    {
      icon: Briefcase,
      title: 'Karriär',
      description: 'Tydliga karriärvägar och interna möjligheter.'
    }
  ];

  const filteredJobs = selectedDepartment === 'all' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment);

  const handleApply = (job) => {
    const subject = encodeURIComponent(`Ansökan: ${job.title}`);
    const body = encodeURIComponent(`Hej!\n\nJag vill ansöka till tjänsten "${job.title}".\n\nMed vänliga hälsningar,\n[Ditt namn]`);
    window.location.href = `mailto:karriar@tendbee.se?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Navigation */}
      <MainNavigation transparent={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              {jobs.length} lediga tjänster
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bygg framtiden med <span className="text-amber-400">oss</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Vi söker passionerade människor som vill vara med och revolutionera 
              hur rekrytering fungerar. Här får du chansen att göra verklig skillnad.
            </p>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Varför jobba på Tendbee?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {perks.map((perk, index) => (
              <PerkCard key={index} {...perk} />
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Lediga tjänster
            </h2>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedDepartment === dept.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-100 rounded-2xl">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Inga lediga tjänster inom denna avdelning just nu.</p>
              <p className="text-gray-500 text-sm mt-2">Kolla tillbaka snart eller skicka en spontanansökan!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={handleApply} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Spontaneous Application Section */}
      <section className="py-16 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Hittar du inte rätt tjänst?
          </h2>
          <p className="text-amber-100 mb-8 text-lg">
            Skicka en spontanansökan! Vi är alltid intresserade av att träffa talangfulla 
            människor som delar vår vision.
          </p>
          <Button 
            onClick={() => window.location.href = 'mailto:karriar@tendbee.se?subject=Spontanansökan'}
            className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-6 text-lg"
          >
            Skicka spontanansökan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Shared Footer */}
      <MainFooter />
    </div>
  );
}
