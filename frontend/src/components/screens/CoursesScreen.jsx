import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { ChevronLeft, Monitor, MapPin, Clock, CheckCircle2, Award, ArrowRight, GraduationCap, Briefcase, Wrench, Plus, X } from 'lucide-react';

// Fördefinierade kompetenser
const PREDEFINED_SKILLS = [
  { id: 'truck_a', label: 'Truckkort A', category: 'certifikat' },
  { id: 'truck_b', label: 'Truckkort B', category: 'certifikat' },
  { id: 'forklift', label: 'Gaffeltruckkort', category: 'certifikat' },
  { id: 'reach_truck', label: 'Skjutstativtruck', category: 'certifikat' },
  { id: 'adr', label: 'ADR-certifikat', category: 'certifikat' },
  { id: 'hygiene', label: 'Livsmedelshygien', category: 'certifikat' },
  { id: 'first_aid', label: 'Första hjälpen', category: 'certifikat' },
  { id: 'fire_safety', label: 'Brandskyddsutbildning', category: 'certifikat' },
  { id: 'excel', label: 'Excel', category: 'kompetens' },
  { id: 'wms', label: 'Lagersystem (WMS)', category: 'kompetens' },
  { id: 'inventory', label: 'Inventering', category: 'kompetens' },
  { id: 'packing', label: 'Plockning & Pack', category: 'kompetens' },
  { id: 'shipping', label: 'Godsmottagning', category: 'kompetens' },
  { id: 'quality', label: 'Kvalitetskontroll', category: 'kompetens' },
];

// Fördefinierade utbildningar
const PREDEFINED_EDUCATION = [
  { id: 'gymnasium', label: 'Gymnasium', category: 'utbildning' },
  { id: 'hogskola', label: 'Högskola/Universitet', category: 'utbildning' },
  { id: 'yrkeshogskola', label: 'Yrkeshögskola', category: 'utbildning' },
  { id: 'lager_logistik', label: 'Lager & Logistik (YH)', category: 'utbildning' },
  { id: 'transport', label: 'Transport & Spedition', category: 'utbildning' },
  { id: 'ekonomi', label: 'Ekonomi/Administration', category: 'utbildning' },
  { id: 'it', label: 'IT/Data', category: 'utbildning' },
  { id: 'handel', label: 'Handel & Service', category: 'utbildning' },
];

// Fördefinierad erfarenhet
const PREDEFINED_EXPERIENCE = [
  { id: 'exp_warehouse', label: 'Lagerarbete', category: 'erfarenhet' },
  { id: 'exp_logistics', label: 'Logistik', category: 'erfarenhet' },
  { id: 'exp_retail', label: 'Butik/Handel', category: 'erfarenhet' },
  { id: 'exp_customer', label: 'Kundtjänst', category: 'erfarenhet' },
  { id: 'exp_production', label: 'Produktion/Industri', category: 'erfarenhet' },
  { id: 'exp_transport', label: 'Transport', category: 'erfarenhet' },
  { id: 'exp_cleaning', label: 'Städ/Lokalvård', category: 'erfarenhet' },
  { id: 'exp_food', label: 'Restaurang/Livsmedel', category: 'erfarenhet' },
];

export const CoursesScreen = ({ onNavigate, coursesCompleted, onCompleteCourse, userData, onUpdate, profilePercentage = 20 }) => {
  const { online = false, physical = false } = coursesCompleted || {};
  
  // State för valda kompetenser och utbildningar - initialisera med userData
  const [selectedSkills, setSelectedSkills] = useState(userData?.skills || []);
  const [selectedEducation, setSelectedEducation] = useState(userData?.education || []);
  const [selectedExperience, setSelectedExperience] = useState(userData?.experience || []);
  const [customSkill, setCustomSkill] = useState('');
  const [customEducation, setCustomEducation] = useState('');
  const [customExperience, setCustomExperience] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [showEducationInput, setShowEducationInput] = useState(false);
  const [showExperienceInput, setShowExperienceInput] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // 'skills', 'education', 'experience'

  // Synkronisera med userData när det ändras
  useEffect(() => {
    if (userData?.skills) setSelectedSkills(userData.skills);
    if (userData?.education) setSelectedEducation(userData.education);
    if (userData?.experience) setSelectedExperience(userData.experience);
  }, [userData]);

  // Hantera val av fördefinierad kompetens
  const toggleSkill = (skill) => {
    setSelectedSkills(prev => {
      const exists = prev.find(s => s.id === skill.id);
      const newSkills = exists 
        ? prev.filter(s => s.id !== skill.id)
        : [...prev, skill];
      // Auto-spara direkt till parent
      onUpdate?.({ skills: newSkills });
      return newSkills;
    });
  };

  // Hantera val av fördefinierad utbildning
  const toggleEducation = (edu) => {
    setSelectedEducation(prev => {
      const exists = prev.find(e => e.id === edu.id);
      const newEducation = exists 
        ? prev.filter(e => e.id !== edu.id)
        : [...prev, edu];
      // Auto-spara direkt till parent
      onUpdate?.({ education: newEducation });
      return newEducation;
    });
  };

  // Hantera val av fördefinierad erfarenhet
  const toggleExperience = (exp) => {
    setSelectedExperience(prev => {
      const exists = prev.find(e => e.id === exp.id);
      const newExperience = exists 
        ? prev.filter(e => e.id !== exp.id)
        : [...prev, exp];
      // Auto-spara direkt till parent
      onUpdate?.({ experience: newExperience });
      return newExperience;
    });
  };

  // Lägg till egen kompetens
  const addCustomSkill = () => {
    if (customSkill.trim()) {
      const newSkill = { id: `custom_${Date.now()}`, label: customSkill.trim(), category: 'övrigt' };
      setSelectedSkills(prev => {
        const newSkills = [...prev, newSkill];
        onUpdate?.({ skills: newSkills });
        return newSkills;
      });
      setCustomSkill('');
      setShowSkillInput(false);
    }
  };

  // Lägg till egen utbildning
  const addCustomEducation = () => {
    if (customEducation.trim()) {
      const newEdu = { id: `custom_edu_${Date.now()}`, label: customEducation.trim(), category: 'övrigt' };
      setSelectedEducation(prev => {
        const newEducation = [...prev, newEdu];
        onUpdate?.({ education: newEducation });
        return newEducation;
      });
      setCustomEducation('');
      setShowEducationInput(false);
    }
  };

  // Lägg till egen erfarenhet
  const addCustomExperience = () => {
    if (customExperience.trim()) {
      const newExp = { id: `custom_exp_${Date.now()}`, label: customExperience.trim(), category: 'övrigt' };
      setSelectedExperience(prev => {
        const newExperience = [...prev, newExp];
        onUpdate?.({ experience: newExperience });
        return newExperience;
      });
      setCustomExperience('');
      setShowExperienceInput(false);
    }
  };

  // Ta bort kompetens
  const removeSkill = (skillId) => {
    setSelectedSkills(prev => {
      const newSkills = prev.filter(s => s.id !== skillId);
      onUpdate?.({ skills: newSkills });
      return newSkills;
    });
  };

  // Ta bort utbildning
  const removeEducation = (eduId) => {
    setSelectedEducation(prev => {
      const newEducation = prev.filter(e => e.id !== eduId);
      onUpdate?.({ education: newEducation });
      return newEducation;
    });
  };

  // Ta bort erfarenhet
  const removeExperience = (expId) => {
    setSelectedExperience(prev => {
      const newExperience = prev.filter(e => e.id !== expId);
      onUpdate?.({ experience: newExperience });
      return newExperience;
    });
  };

  // Spara alla val och gå till nästa steg
  const handleSave = () => {
    onNavigate('cvCompleted');
  };

  // Gå tillbaka
  const handleBack = () => {
    onNavigate('cvCompleted');
  };

  const totalAdditions = selectedSkills.length + selectedEducation.length + selectedExperience.length;
  const coursesCompletedCount = [online, physical].filter(Boolean).length;
  
  return (
    <ScreenContainer>
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors mb-6 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-medium">Tillbaka</span>
      </button>
      
      {/* Profile Completeness - Visa aktuell procent */}
      <ProfileCompleteness percentage={profilePercentage} className="mb-8" />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Kurser & Tester
        </h1>
        <p className="text-gray-500">
          Öka ditt profilvärde och stå ut
        </p>
      </div>
      
      {/* Kurser Progress */}
      <div className="p-4 rounded-2xl mb-6"
        style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '1px solid #fcd34d' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Kurser genomförda</p>
              <p className="text-xs text-amber-700">
                {online && physical 
                  ? 'Alla kurser genomförda!' 
                  : `Varje kurs ökar din profil`
                }
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-amber-600">
            {coursesCompletedCount}/2
          </span>
        </div>
      </div>
      
      {/* Course 1: Online */}
      <div className={`p-5 rounded-2xl border-2 mb-4 transition-all duration-300 ${
        online ? 'border-amber-400 bg-amber-50/50' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
            online ? 'bg-amber-400' : 'bg-purple-100'
          }`}>
            <Monitor className={`w-7 h-7 ${online ? 'text-white' : 'text-purple-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900">Online Kunskapskurs</h3>
              {online && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Testa din teoretiska kunskap med vårt online-test
            </p>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                20 min
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {online ? '✓ Genomförd' : 'Ej genomförd'}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                +15%
              </span>
            </div>
            {!online && (
              <button 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
                onClick={() => onCompleteCourse?.('online')}
              >
                Starta kurs
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Course 2: Physical - Keeada Academy */}
      <div className={`p-5 rounded-2xl border-2 mb-8 transition-all duration-300 ${
        physical ? 'border-amber-400 bg-amber-50/50' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
            physical ? 'bg-amber-400' : 'bg-orange-100'
          }`}>
            <MapPin className={`w-7 h-7 ${physical ? 'text-white' : 'text-orange-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900">Praktisk Kurs</h3>
              {physical && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Keeada Academy - Testa dina praktiska färdigheter på plats
            </p>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                2-4 veckor
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                Betald praktik
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                +15%
              </span>
            </div>
            {!physical && (
              <button 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
                onClick={() => onCompleteCourse?.('physical')}
              >
                Ansök till praktik
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-8"></div>

      {/* NEW SECTION: Förbättra CV */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Förbättra ditt CV
        </h2>
        <p className="text-sm text-gray-500">
          Lägg till kompetenser, utbildning och erfarenhet för att öka din profil
        </p>
      </div>

      {/* Selected items summary */}
      {totalAdditions > 0 && (
        <div className="p-4 rounded-xl mb-6" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #6ee7b7' }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-sm text-green-800">{totalAdditions} tillagda till din profil</span>
          </div>
        </div>
      )}

      {/* Section 1: Kompetenser & Certifikat */}
      <div className="card-interactive mb-4">
        <button 
          onClick={() => setActiveSection(activeSection === 'skills' ? null : 'skills')}
          className="w-full flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100">
            <Wrench className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Kompetenser & Certifikat</h3>
              {selectedSkills.length > 0 && (
                <Badge className="bg-blue-100 text-blue-600 text-xs">{selectedSkills.length}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Truckkort, kurser, färdigheter (+20%)
            </p>
          </div>
          <ArrowRight className={`w-5 h-5 text-muted-foreground transition-transform ${activeSection === 'skills' ? 'rotate-90' : ''}`} />
        </button>

        {activeSection === 'skills' && (
          <div className="mt-4 pt-4 border-t border-border animate-fade-in">
            {/* Valda kompetenser */}
            {selectedSkills.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Valda:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map(skill => (
                    <Badge 
                      key={skill.id} 
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer flex items-center gap-1"
                      onClick={() => removeSkill(skill.id)}
                    >
                      {skill.label}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Fördefinierade val */}
            <p className="text-xs text-muted-foreground mb-2">Välj från listan:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {PREDEFINED_SKILLS.map(skill => {
                const isSelected = selectedSkills.find(s => s.id === skill.id);
                return (
                  <Badge 
                    key={skill.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'hover:bg-blue-50 hover:border-blue-300'
                    }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {skill.label}
                  </Badge>
                );
              })}
            </div>

            {/* Lägg till egen */}
            {showSkillInput ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Skriv egen kompetens..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                  className="flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={addCustomSkill}>Lägg till</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowSkillInput(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSkillInput(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Övrigt - Lägg till egen
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Section 2: Utbildning */}
      <div className="card-interactive mb-4">
        <button 
          onClick={() => setActiveSection(activeSection === 'education' ? null : 'education')}
          className="w-full flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
            <GraduationCap className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Utbildning</h3>
              {selectedEducation.length > 0 && (
                <Badge className="bg-green-100 text-green-600 text-xs">{selectedEducation.length}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Högskola, YH, gymnasium, kurser (+15%)
            </p>
          </div>
          <ArrowRight className={`w-5 h-5 text-muted-foreground transition-transform ${activeSection === 'education' ? 'rotate-90' : ''}`} />
        </button>

        {activeSection === 'education' && (
          <div className="mt-4 pt-4 border-t border-border animate-fade-in">
            {/* Valda utbildningar */}
            {selectedEducation.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Valda:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEducation.map(edu => (
                    <Badge 
                      key={edu.id} 
                      className="bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer flex items-center gap-1"
                      onClick={() => removeEducation(edu.id)}
                    >
                      {edu.label}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Fördefinierade val */}
            <p className="text-xs text-muted-foreground mb-2">Välj från listan:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {PREDEFINED_EDUCATION.map(edu => {
                const isSelected = selectedEducation.find(e => e.id === edu.id);
                return (
                  <Badge 
                    key={edu.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'hover:bg-green-50 hover:border-green-300'
                    }`}
                    onClick={() => toggleEducation(edu)}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {edu.label}
                  </Badge>
                );
              })}
            </div>

            {/* Lägg till egen */}
            {showEducationInput ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Skriv egen utbildning..."
                  value={customEducation}
                  onChange={(e) => setCustomEducation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomEducation()}
                  className="flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={addCustomEducation}>Lägg till</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowEducationInput(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowEducationInput(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Övrigt - Lägg till egen
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Section 3: Erfarenhet */}
      <div className="card-interactive mb-6">
        <button 
          onClick={() => setActiveSection(activeSection === 'experience' ? null : 'experience')}
          className="w-full flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100">
            <Briefcase className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Erfarenhet</h3>
              {selectedExperience.length > 0 && (
                <Badge className="bg-orange-100 text-orange-600 text-xs">{selectedExperience.length}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Arbetslivserfarenhet inom olika områden (+15%)
            </p>
          </div>
          <ArrowRight className={`w-5 h-5 text-muted-foreground transition-transform ${activeSection === 'experience' ? 'rotate-90' : ''}`} />
        </button>

        {activeSection === 'experience' && (
          <div className="mt-4 pt-4 border-t border-border animate-fade-in">
            {/* Valda erfarenheter */}
            {selectedExperience.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Valda:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedExperience.map(exp => (
                    <Badge 
                      key={exp.id} 
                      className="bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer flex items-center gap-1"
                      onClick={() => removeExperience(exp.id)}
                    >
                      {exp.label}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Fördefinierade val */}
            <p className="text-xs text-muted-foreground mb-2">Välj från listan:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {PREDEFINED_EXPERIENCE.map(exp => {
                const isSelected = selectedExperience.find(e => e.id === exp.id);
                return (
                  <Badge 
                    key={exp.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'hover:bg-orange-50 hover:border-orange-300'
                    }`}
                    onClick={() => toggleExperience(exp)}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {exp.label}
                  </Badge>
                );
              })}
            </div>

            {/* Lägg till egen */}
            {showExperienceInput ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Skriv egen erfarenhet..."
                  value={customExperience}
                  onChange={(e) => setCustomExperience(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomExperience()}
                  className="flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={addCustomExperience}>Lägg till</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowExperienceInput(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowExperienceInput(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Övrigt - Lägg till egen
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Save & Back buttons */}
      <div className="space-y-3 mt-6">
        {totalAdditions > 0 && (
          <Button 
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary"
            onClick={handleSave}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Spara ändringar {totalAdditions > 0 && `(${totalAdditions} tillagda)`}
          </Button>
        )}
        <Button 
          variant="outline"
          className="w-full h-12"
          onClick={handleBack}
        >
          Tillbaka till profil
        </Button>
      </div>
    </ScreenContainer>
  );
};

export default CoursesScreen;
