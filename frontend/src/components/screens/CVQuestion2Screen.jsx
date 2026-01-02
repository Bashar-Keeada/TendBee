import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight, CheckCircle2, Languages } from 'lucide-react';

const languageOptions = [
  { id: 'swedish', label: 'Svenska', flag: '🇸🇪' },
  { id: 'english', label: 'Engelska', flag: '🇬🇧' },
  { id: 'arabic', label: 'Arabiska', flag: '🇸🇦' },
  { id: 'spanish', label: 'Spanska', flag: '🇪🇸' },
  { id: 'german', label: 'Tyska', flag: '🇩🇪' },
  { id: 'french', label: 'Franska', flag: '🇫🇷' },
  { id: 'other', label: 'Annat', flag: '🌐' },
];

export const CVQuestion2Screen = ({ onNavigate, onUpdateProfile }) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [otherText, setOtherText] = useState('');
  
  const toggleLanguage = (id) => {
    setSelectedLanguages(prev => 
      prev.includes(id)
        ? prev.filter(l => l !== id)
        : [...prev, id]
    );
  };
  
  const isValid = selectedLanguages.length > 0 && 
    (!selectedLanguages.includes('other') || otherText.trim());
  
  const handleContinue = () => {
    if (isValid) {
      onUpdateProfile?.({
        languages: selectedLanguages,
        otherLanguage: otherText,
      });
      onNavigate('cvQuestion3');
    }
  };
  
  return (
    <ScreenContainer hasFooter >
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('cvQuestion1')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Progress */}
      <ProgressBar currentStep={6} totalSteps={7} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Språkkunskaper
        </h1>
        <p className="text-muted-foreground">
          Vilka språk talar du?
        </p>
      </div>
      
      {/* Languages */}
      <div className="space-y-3 mb-6">
        {languageOptions.map((language) => {
          const isSelected = selectedLanguages.includes(language.id);
          
          return (
            <button
              key={language.id}
              type="button"
              onClick={() => toggleLanguage(language.id)}
              className={`w-full option-card ${
                isSelected ? 'selected' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-primary/20' : 'bg-muted'
              }`}>
                <span className="text-lg">{language.flag}</span>
              </div>
              <span className="flex-1 text-left font-medium text-foreground">
                {language.label}
              </span>
              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Other Text Input */}
      {selectedLanguages.includes('other') && (
        <div className="mb-6 animate-fade-in">
          <Label className="form-label">Vilket språk?</Label>
          <Input
            placeholder="T.ex. Mandarin, Persiska..."
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            className="form-input"
          />
        </div>
      )}
      
      {/* Selection count */}
      {selectedLanguages.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Languages className="w-4 h-4" />
          <span>{selectedLanguages.length} språk valda</span>
        </div>
      )}
      
      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="max-w-[390px] mx-auto">
          <Button 
            size="lg"
            className="w-full h-14"
            disabled={!isValid}
            onClick={handleContinue}
          >
            Fortsätt
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default CVQuestion2Screen;
