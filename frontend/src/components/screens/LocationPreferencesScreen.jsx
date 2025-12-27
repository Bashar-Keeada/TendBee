import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight, MapPin, Globe, Home, CheckCircle2 } from 'lucide-react';
import { countryConfigs } from '@/config/appConfig';

export const LocationPreferencesScreen = ({ onNavigate, onUpdateProfile }) => {
  const [selectedCountry, setSelectedCountry] = useState('Sverige');
  const [selectedCities, setSelectedCities] = useState([]);
  const [remoteWork, setRemoteWork] = useState(false);
  
  const countries = Object.keys(countryConfigs);
  const cities = countryConfigs[selectedCountry]?.cities || [];
  
  const toggleCity = (city) => {
    setSelectedCities(prev => 
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };
  
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCities([]);
  };
  
  const isValid = selectedCities.length > 0 || remoteWork;
  
  const handleContinue = () => {
    if (isValid) {
      onUpdateProfile?.({
        country: selectedCountry,
        cities: selectedCities,
        remoteWork,
      });
      onNavigate('salaryPreferences');
    }
  };
  
  return (
    <ScreenContainer hasFooter className="bg-background">
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('employmentStatus')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Progress */}
      <ProgressBar currentStep={3} totalSteps={7} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Platsönsemål
        </h1>
        <p className="text-muted-foreground">
          Var vill du arbeta?
        </p>
      </div>
      
      {/* Country Selection */}
      <div className="mb-6">
        <Label className="form-label mb-3 block">
          <Globe className="w-4 h-4 inline mr-2" />
          Land
        </Label>
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => handleCountryChange(country)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCountry === country
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>
      
      {/* Cities */}
      <div className="mb-6">
        <Label className="form-label mb-3 block">
          <MapPin className="w-4 h-4 inline mr-2" />
          Städer
        </Label>
        <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => toggleCity(city)}
              className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                selectedCities.includes(city)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <span className="text-sm font-medium text-foreground">{city}</span>
              {selectedCities.includes(city) && (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Remote Work Option */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setRemoteWork(!remoteWork)}
          className={`w-full option-card ${
            remoteWork ? 'selected' : ''
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Distansarbete</p>
            <p className="text-xs text-muted-foreground">Arbeta hemifrån</p>
          </div>
          <Checkbox 
            checked={remoteWork}
            onCheckedChange={setRemoteWork}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </button>
      </div>
      
      {/* Selection Summary */}
      {(selectedCities.length > 0 || remoteWork) && (
        <div className="info-box info-box-primary animate-fade-in">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Ditt val: </span>
            {selectedCities.join(', ')}
            {selectedCities.length > 0 && remoteWork && ', '}
            {remoteWork && 'Distansarbete'}
          </p>
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

export default LocationPreferencesScreen;
