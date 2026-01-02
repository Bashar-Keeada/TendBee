import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, CheckCircle2, Award, Languages, Car, Calendar, Sparkles, Briefcase } from 'lucide-react';

const experienceLevels = [
  { id: 'none', label: 'Ingen erfarenhet krävs' },
  { id: 'junior', label: '0-1 års erfarenhet' },
  { id: 'mid', label: '1-3 års erfarenhet' },
  { id: 'senior', label: '3+ års erfarenhet' },
];

const languageOptions = [
  { id: 'swedish', label: 'Svenska' },
  { id: 'english', label: 'Engelska' },
];

export const JobRequirementsScreen = ({ onNavigate }) => {
  const [experienceLevel, setExperienceLevel] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [requiresLicense, setRequiresLicense] = useState(null);
  const [startImmediately, setStartImmediately] = useState(null);
  
  const toggleLanguage = (id) => {
    setSelectedLanguages(prev => 
      prev.includes(id)
        ? prev.filter(l => l !== id)
        : [...prev, id]
    );
  };
  
  const isValid = experienceLevel && selectedLanguages.length > 0 && 
    requiresLicense !== null && startImmediately !== null;
  
  const handlePublish = () => {
    if (isValid) {
      onNavigate('employerDashboard');
    }
  };
  
  return (
    <ScreenContainer hasFooter >
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('createJob')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Jobbkrav
        </h1>
        <p className="text-muted-foreground">
          Definiera vem du söker
        </p>
      </div>
      
      {/* Experience Level */}
      <div className="mb-6">
        <Label className="form-label">
          <Award className="w-4 h-4 inline mr-2" />
          Erfarenhetsnivå
        </Label>
        <div className="space-y-2 mt-2">
          {experienceLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => setExperienceLevel(level.id)}
              className={`w-full option-card option-card-secondary justify-between ${
                experienceLevel === level.id ? 'selected' : ''
              }`}
            >
              <span className="font-medium text-foreground">{level.label}</span>
              {experienceLevel === level.id && (
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Languages */}
      <div className="mb-6">
        <Label className="form-label">
          <Languages className="w-4 h-4 inline mr-2" />
          Språkkrav
        </Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {languageOptions.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => toggleLanguage(lang.id)}
              className={`p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-between ${
                selectedLanguages.includes(lang.id)
                  ? 'border-secondary bg-secondary/5'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <span className="text-foreground">{lang.label}</span>
              {selectedLanguages.includes(lang.id) && (
                <CheckCircle2 className="w-4 h-4 text-secondary" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Driver's License */}
      <div className="mb-6">
        <Label className="form-label">
          <Car className="w-4 h-4 inline mr-2" />
          Krävs körkort?
        </Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={() => setRequiresLicense(true)}
            className={`option-card option-card-secondary justify-center ${
              requiresLicense === true ? 'selected' : ''
            }`}
          >
            <span className="font-medium text-foreground">Ja</span>
          </button>
          <button
            type="button"
            onClick={() => setRequiresLicense(false)}
            className={`option-card option-card-secondary justify-center ${
              requiresLicense === false ? 'selected' : ''
            }`}
          >
            <span className="font-medium text-foreground">Nej</span>
          </button>
        </div>
      </div>
      
      {/* Start Immediately */}
      <div className="mb-6">
        <Label className="form-label">
          <Calendar className="w-4 h-4 inline mr-2" />
          Tillträde omgående?
        </Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={() => setStartImmediately(true)}
            className={`option-card option-card-secondary justify-center ${
              startImmediately === true ? 'selected' : ''
            }`}
          >
            <span className="font-medium text-foreground">Ja</span>
          </button>
          <button
            type="button"
            onClick={() => setStartImmediately(false)}
            className={`option-card option-card-secondary justify-center ${
              startImmediately === false ? 'selected' : ''
            }`}
          >
            <span className="font-medium text-foreground">Nej</span>
          </button>
        </div>
      </div>
      
      {/* AI Matching Info */}
      <div className="info-box info-box-secondary">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-secondary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">AI-matchning</p>
            <p className="text-xs text-muted-foreground">
              Vår AI matchar automatiskt kandidater baserat på dina krav och deras profiler.
            </p>
          </div>
        </div>
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="max-w-[390px] mx-auto">
          <Button 
            variant="secondary"
            size="lg"
            className="w-full h-14"
            disabled={!isValid}
            onClick={handlePublish}
          >
            <Briefcase className="w-5 h-5" />
            Publicera jobb
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default JobRequirementsScreen;
