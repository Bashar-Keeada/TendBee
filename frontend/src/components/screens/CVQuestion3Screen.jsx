import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight, CheckCircle2, Calendar, Clock, Car, CarFront } from 'lucide-react';
import { employmentTypes } from '@/config/appConfig';

export const CVQuestion3Screen = ({ onNavigate, onUpdateProfile }) => {
  const [startDate, setStartDate] = useState('');
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [hasDriversLicense, setHasDriversLicense] = useState(null);
  const [hasCar, setHasCar] = useState(null);
  
  const toggleWorkType = (id) => {
    setSelectedWorkTypes(prev => 
      prev.includes(id)
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };
  
  const isValid = startDate && selectedWorkTypes.length > 0 && 
    hasDriversLicense !== null && hasCar !== null;
  
  const handleContinue = () => {
    if (isValid) {
      onUpdateProfile?.({
        startDate,
        workTypes: selectedWorkTypes,
        hasDriversLicense,
        hasCar,
      });
      onNavigate('cvCompleted');
    }
  };
  
  return (
    <ScreenContainer hasFooter >
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('cvQuestion2')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Progress */}
      <ProgressBar currentStep={7} totalSteps={7} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Tillgänglighet
        </h1>
        <p className="text-muted-foreground">
          När kan du börja och hur vill du arbeta?
        </p>
      </div>
      
      {/* Start Date */}
      <div className="mb-6">
        <Label htmlFor="startDate" className="form-label">
          <Calendar className="w-4 h-4 inline mr-2" />
          När kan du börja?
        </Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-input"
        />
      </div>
      
      {/* Work Types */}
      <div className="mb-6">
        <Label className="form-label">
          <Clock className="w-4 h-4 inline mr-2" />
          Vilka arbetstider passar dig?
        </Label>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {employmentTypes.map((type) => {
            const isSelected = selectedWorkTypes.includes(type.id);
            
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => toggleWorkType(type.id)}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <span className="text-sm font-medium text-foreground">{type.label}</span>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Drivers License */}
      <div className="mb-6">
        <Label className="form-label">
          <Car className="w-4 h-4 inline mr-2" />
          Har du körkort?
        </Label>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            type="button"
            onClick={() => setHasDriversLicense(true)}
            className={`option-card justify-center ${
              hasDriversLicense === true ? 'selected' : ''
            }`}
          >
            <span className="font-medium text-foreground">Ja</span>
          </button>
          <button
            type="button"
            onClick={() => setHasDriversLicense(false)}
            className={`option-card justify-center ${
              hasDriversLicense === false ? 'selected' : ''
            }`}
          >
            <span className="font-medium text-foreground">Nej</span>
          </button>
        </div>
      </div>
      
      {/* Own Car */}
      <div className="mb-6">
        <Label className="form-label">
          <CarFront className="w-4 h-4 inline mr-2" />
          Har du egen bil?
        </Label>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            type="button"
            onClick={() => setHasCar(true)}
            className={`option-card justify-center ${
              hasCar === true ? 'selected' : ''
            }`}
          >
            <span className="font-medium text-foreground">Ja</span>
          </button>
          <button
            type="button"
            onClick={() => setHasCar(false)}
            className={`option-card justify-center ${
              hasCar === false ? 'selected' : ''
            }`}
          >
            <span className="font-medium text-foreground">Nej</span>
          </button>
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
            Slutför profil
            <CheckCircle2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default CVQuestion3Screen;
