import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight, Wallet, Info } from 'lucide-react';
import { getCountryConfig } from '@/config/appConfig';

export const SalaryPreferencesScreen = ({ onNavigate, onUpdateProfile, profile }) => {
  const [minSalary, setMinSalary] = useState([25000]);
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);
  
  const countryConfig = getCountryConfig(profile?.country || 'Sverige');
  const { currencySymbol, currencyLabel } = countryConfig;
  
  const formatSalary = (value) => {
    return new Intl.NumberFormat('sv-SE').format(value);
  };
  
  const handleContinue = () => {
    onUpdateProfile?.({
      minSalary: minSalary[0],
      salaryNegotiable,
    });
    onNavigate('cvQuestion1');
  };
  
  return (
    <ScreenContainer hasFooter>
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('locationPreferences')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Progress */}
      <ProgressBar currentStep={4} totalSteps={7} />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Löneönsemål
        </h1>
        <p className="text-muted-foreground">
          Vad är din förväntade lön?
        </p>
      </div>
      
      {/* Salary Slider */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Label className="form-label mb-0">
            <Wallet className="w-4 h-4 inline mr-2" />
            Minimi lön
          </Label>
          <span className="text-lg font-bold text-primary">
            {formatSalary(minSalary[0])} {currencyLabel}
          </span>
        </div>
        
        <div className="px-2">
          <Slider
            value={minSalary}
            onValueChange={setMinSalary}
            min={0}
            max={100000}
            step={1000}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0 {currencySymbol}</span>
            <span>100 000 {currencySymbol}</span>
          </div>
        </div>
      </div>
      
      {/* Visual Indicator */}
      <div className="mb-8">
        <div className="h-4 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary/30 via-primary to-primary/80 transition-all duration-300"
            style={{ width: `${(minSalary[0] / 100000) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Låg</span>
          <span>Medel</span>
          <span>Hög</span>
        </div>
      </div>
      
      {/* Negotiable Option */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setSalaryNegotiable(!salaryNegotiable)}
          className={`w-full option-card ${
            salaryNegotiable ? 'selected' : ''
          }`}
        >
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Lön kan diskuteras</p>
            <p className="text-xs text-muted-foreground">
              Jag är öppen för förhandling
            </p>
          </div>
          <Checkbox 
            checked={salaryNegotiable}
            onCheckedChange={setSalaryNegotiable}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </button>
      </div>
      
      {/* Info Box */}
      <div className="info-box info-box-primary">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              Löneuppgifterna hjälper oss att matcha dig med relevanta jobb. Du kan alltid förhandla direkt med arbetsgivaren.
            </p>
          </div>
        </div>
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="max-w-[390px] mx-auto">
          <Button 
            size="lg"
            className="w-full h-14"
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

export default SalaryPreferencesScreen;
