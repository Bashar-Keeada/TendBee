// Country-specific configurations for the job matching platform

export const countryConfigs = {
  Sverige: {
    currency: 'SEK',
    currencySymbol: 'kr',
    currencyLabel: 'kr/månad',
    phonePrefix: '+46',
    cities: [
      'Stockholm',
      'Göteborg',
      'Malmö',
      'Uppsala',
      'Västerås',
      'Örebro',
      'Linköping',
      'Helsingborg',
      'Jönköping',
      'Norrköping',
      'Lund',
      'Umeå',
      'Gävle',
      'Borås',
      'Södertälje',
    ],
  },
  Norge: {
    currency: 'NOK',
    currencySymbol: 'kr',
    currencyLabel: 'kr/måned',
    phonePrefix: '+47',
    cities: [
      'Oslo',
      'Bergen',
      'Trondheim',
      'Stavanger',
      'Drammen',
      'Fredrikstad',
      'Kristiansand',
      'Sandnes',
      'Tromsø',
      'Sarpsborg',
    ],
  },
  Danmark: {
    currency: 'DKK',
    currencySymbol: 'kr',
    currencyLabel: 'kr/måned',
    phonePrefix: '+45',
    cities: [
      'København',
      'Aarhus',
      'Odense',
      'Aalborg',
      'Esbjerg',
      'Randers',
      'Kolding',
      'Horsens',
      'Vejle',
      'Roskilde',
    ],
  },
  USA: {
    currency: 'USD',
    currencySymbol: '$',
    currencyLabel: '$/month',
    phonePrefix: '+1',
    cities: [
      'New York',
      'Los Angeles',
      'Chicago',
      'Houston',
      'Phoenix',
      'Philadelphia',
      'San Antonio',
      'San Diego',
      'Dallas',
      'San Jose',
      'Austin',
      'Seattle',
      'Denver',
      'Boston',
      'Miami',
    ],
  },
};

export const defaultCountry = 'Sverige';

export const getCountryConfig = (country) => {
  return countryConfigs[country] || countryConfigs[defaultCountry];
};

// Job categories
export const jobCategories = [
  { id: 'warehouse', label: 'Lager & Logistik', icon: 'Package' },
  { id: 'construction', label: 'Bygg & Anläggning', icon: 'HardHat' },
  { id: 'hospitality', label: 'Restaurang & Hotell', icon: 'UtensilsCrossed' },
  { id: 'healthcare', label: 'Vård & Omsorg', icon: 'Heart' },
  { id: 'tech', label: 'IT & Teknik', icon: 'Monitor' },
  { id: 'other', label: 'Annat', icon: 'MoreHorizontal' },
];

// Languages
export const languages = [
  { id: 'swedish', label: 'Svenska' },
  { id: 'english', label: 'Engelska' },
  { id: 'arabic', label: 'Arabiska' },
  { id: 'spanish', label: 'Spanska' },
  { id: 'other', label: 'Annat' },
];

// Employment types
export const employmentTypes = [
  { id: 'fulltime', label: 'Heltid' },
  { id: 'parttime', label: 'Deltid' },
  { id: 'evening', label: 'Kvällstid' },
  { id: 'weekend', label: 'Helger' },
];

// AF Support options
export const afSupportOptions = [
  { id: 'rusta', label: 'Rusta och matcha' },
  { id: 'arbetstraining', label: 'Arbetsträning' },
  { id: 'fat', label: 'FAT (Förstärkt arbetsträning)' },
  { id: 'praktik', label: 'Praktik' },
  { id: 'other', label: 'Annat' },
];

// Mock job data
export const mockJobs = [
  {
    id: 1,
    title: 'Lagerarbetare',
    company: 'Arlanda Logistics AB',
    location: 'Stockholm, Arlanda',
    type: 'Heltid',
    match: 92,
    salary: '28 000 - 32 000 kr/månad',
    description: 'Vi söker en engagerad lagerarbetare till vårt team på Arlanda. Du kommer att arbeta med inleverans, plockning och utleverans av gods.',
    requirements: [
      'Erfarenhet av lagerarbete',
      'Truckkort är meriterande',
      'God fysik',
      'Flexibel med arbetstider',
    ],
    benefits: [
      'Konkurrenskraftig lön',
      'Friskvårdsbidrag',
      'Möjlighet till fast anställning',
      'Trevliga kollegor',
    ],
  },
  {
    id: 2,
    title: 'Truckförare',
    company: 'Göteborg Hamn',
    location: 'Göteborg',
    type: 'Heltid',
    match: 85,
    salary: '30 000 - 35 000 kr/månad',
    description: 'Göteborg Hamn söker erfarna truckförare för arbete i vår hamnterminal.',
    requirements: [
      'Giltigt truckkort (A+B)',
      'Minst 2 års erfarenhet',
      'Svenska i tal och skrift',
    ],
    benefits: [
      'Bra lön',
      'OB-tillägg',
      'Pension',
    ],
  },
  {
    id: 3,
    title: 'Restaurangbiträde',
    company: 'Malmö Restaurang',
    location: 'Malmö',
    type: 'Deltid',
    match: 78,
    salary: '140 - 160 kr/timme',
    description: 'Populär restaurang i centrala Malmö söker serviceinriktat restaurangbiträde.',
    requirements: [
      'Serviceinriktad',
      'Flexibel',
      'Talar svenska',
    ],
    benefits: [
      'Trevlig arbetsmiljö',
      'Gratis mat under arbetstid',
      'Möjlighet till fler timmar',
    ],
  },
];

// Mock candidates data
export const mockCandidates = [
  {
    id: 1,
    name: 'Anna Andersson',
    role: 'Lagerarbetare',
    experience: '3 år',
    location: 'Stockholm',
    match: 95,
    skills: ['Truckkort', 'Svenska', 'Engelska'],
    availability: 'Omgående',
  },
  {
    id: 2,
    name: 'Mohammed Hassan',
    role: 'Lagerarbetare',
    experience: '2 år',
    location: 'Stockholm',
    match: 88,
    skills: ['Svenska', 'Arabiska', 'Truck A'],
    availability: '2 veckors uppsägning',
  },
  {
    id: 3,
    name: 'Maria Svensson',
    role: 'Restaurang',
    experience: '1 år',
    location: 'Uppsala',
    match: 82,
    skills: ['Svenska', 'Engelska', 'Servering'],
    availability: 'Omgående',
  },
];
