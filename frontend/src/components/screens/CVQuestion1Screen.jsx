import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight, CheckCircle2, Package, HardHat, UtensilsCrossed, Heart, Monitor, MoreHorizontal } from 'lucide-react';

const jobCategories = [
  { id: 'warehouse', label: 'Lager & Logistik', icon: Package },
  { id: 'construction', label: 'Bygg & Anläggning', icon: HardHat },
  { id: 'hospitality', label: 'Restaurang & Hotell', icon: UtensilsCrossed },
  { id: 'healthcare', label: 'Vård & Omsorg', icon: Heart },
  { id: 'tech', label: 'IT & Teknik', icon: Monitor },
  { id: 'other', label: 'Annat', icon: MoreHorizontal },
];

export const CVQuestion1Screen = ({ onNavigate, onUpdateProfile }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [otherText, setOtherText] = useState('');
  
  const toggleCategory = (id) => {
    setSelectedCategories(prev => 
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };
  
  const isValid = selectedCategories.length > 0 && 
    (!selectedCategories.includes('other') || otherText.trim());
  
  const handleContinue = () => {
    if (isValid) {
      onUpdateProfile?.({
        jobCategories: selectedCategories,
        otherJobCategory: otherText,
      });
      onNavigate('cvQuestion2');
    }
  };
  
  return (
    <ScreenContainer hasFooter >
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('salaryPreferences')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Progress */}
      <ProgressBar currentStep={5} totalSteps={7} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Yrkeserfarenhet
        </h1>
        <p className="text-muted-foreground">
          Vilka områden har du erfarenhet inom?
        </p>
      </div>
      
      {/* Categories */}
      <div className="space-y-3 mb-6">
        {jobCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`w-full option-card ${
                isSelected ? 'selected' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-primary/20' : 'bg-muted'
              }`}>
                <Icon className={`w-5 h-5 ${
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">
                {category.label}
              </span>
              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Other Text Input */}
      {selectedCategories.includes('other') && (
        <div className="mb-6 animate-fade-in">
          <Label className="form-label">Beskriv din erfarenhet</Label>
          <Input
            placeholder="T.ex. Kundsupport, Försäljning..."
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            className="form-input"
          />
        </div>
      )}
      
      {/* Selection count */}
      {selectedCategories.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {selectedCategories.length} område(n) valda
        </p>
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

export default CVQuestion1Screen;
