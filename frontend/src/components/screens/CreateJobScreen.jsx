import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, ArrowRight, Briefcase, MapPin, Clock, Wallet } from 'lucide-react';
import { employmentTypes } from '@/config/appConfig';

export const CreateJobScreen = ({ onNavigate, onUpdateJob }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    employmentType: '',
    salaryMin: 25000,
    salaryMax: 35000,
    description: '',
  });
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const isValid = formData.title && formData.location && 
    formData.employmentType && formData.description;
  
  const formatSalary = (value) => {
    return new Intl.NumberFormat('sv-SE').format(value);
  };
  
  const handleContinue = () => {
    if (isValid) {
      onUpdateJob?.(formData);
      onNavigate('jobRequirements');
    }
  };
  
  return (
    <ScreenContainer hasFooter className="bg-background">
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('employerDashboard')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Skapa jobbannons
        </h1>
        <p className="text-muted-foreground">
          Beskriv tjänsten du söker
        </p>
      </div>
      
      {/* Form */}
      <div className="space-y-5">
        <div>
          <Label htmlFor="title" className="form-label">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Jobbtitel
          </Label>
          <Input
            id="title"
            placeholder="T.ex. Lagerarbetare"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div>
          <Label htmlFor="location" className="form-label">
            <MapPin className="w-4 h-4 inline mr-2" />
            Arbetsplats
          </Label>
          <Input
            id="location"
            placeholder="T.ex. Stockholm, Arlanda"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div>
          <Label className="form-label">
            <Clock className="w-4 h-4 inline mr-2" />
            Anställningsform
          </Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {employmentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleChange('employmentType', type.id)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  formData.employmentType === type.id
                    ? 'border-secondary bg-secondary/5 text-foreground'
                    : 'border-border text-muted-foreground hover:border-muted-foreground/30'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="form-label">
            <Wallet className="w-4 h-4 inline mr-2" />
            Löneintervall
          </Label>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-muted-foreground">{formatSalary(formData.salaryMin)} kr</span>
            <span className="text-muted-foreground">{formatSalary(formData.salaryMax)} kr</span>
          </div>
          <div className="space-y-3">
            <Slider
              value={[formData.salaryMin]}
              onValueChange={([val]) => handleChange('salaryMin', val)}
              min={15000}
              max={80000}
              step={1000}
              className="w-full"
            />
            <Slider
              value={[formData.salaryMax]}
              onValueChange={([val]) => handleChange('salaryMax', val)}
              min={15000}
              max={80000}
              step={1000}
              className="w-full"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description" className="form-label">Jobbeskrivning</Label>
          <Textarea
            id="description"
            placeholder="Beskriv tjänsten och vad den innebär..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="min-h-[120px] rounded-xl border-2 border-border bg-background p-4 text-foreground focus:border-secondary focus:outline-none resize-none"
          />
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

export default CreateJobScreen;
