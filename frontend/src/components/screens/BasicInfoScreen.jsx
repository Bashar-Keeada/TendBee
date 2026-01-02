import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight } from 'lucide-react';

export const BasicInfoScreen = ({ onNavigate, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
  });
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const isValid = formData.firstName && formData.lastName && formData.age && formData.phone;
  
  const handleContinue = () => {
    if (isValid) {
      onUpdateProfile?.(formData);
      onNavigate('employmentStatus');
    }
  };
  
  return (
    <ScreenContainer hasFooter>
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('login')}
        className="flex items-center gap-1 text-white/60 hover:text-white transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Progress */}
      <ProgressBar currentStep={1} totalSteps={7} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Grundläggande information
        </h1>
        <p className="text-white/60">
          Berätta lite om dig själv
        </p>
      </div>
      
      {/* Form */}
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-white/70 text-sm mb-2 block">Förnamn</Label>
            <Input
              id="firstName"
              placeholder="Erik"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-white/40"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-white/70 text-sm mb-2 block">Efternamn</Label>
            <Input
              id="lastName"
              placeholder="Svensson"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-white/40"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="age" className="text-white/70 text-sm mb-2 block">Ålder</Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            min="16"
            max="100"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-white/40"
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-white/70 text-sm mb-2 block">Telefonnummer</Label>
          <div className="flex gap-2">
            <div className="flex items-center justify-center px-4 h-12 bg-muted rounded-xl border-2 border-border text-sm font-medium text-muted-foreground">
              +46
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="70 123 45 67"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="form-input flex-1"
            />
          </div>
        </div>
      </div>
      
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

export default BasicInfoScreen;
