import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProgressBar } from '@/components/ProgressBar';
import { ChevronLeft, ArrowRight, Briefcase, UserX, Building2, Info, CheckCircle2 } from 'lucide-react';
import { afSupportOptions } from '@/config/appConfig';

export const EmploymentStatusScreen = ({ onNavigate, onUpdateProfile }) => {
  const [isEmployed, setIsEmployed] = useState(null);
  const [monthsUnemployed, setMonthsUnemployed] = useState('');
  const [isRegisteredAF, setIsRegisteredAF] = useState(null);
  const [selectedSupports, setSelectedSupports] = useState([]);
  const [otherSupportText, setOtherSupportText] = useState('');
  const [praktikDuration, setPraktikDuration] = useState('');
  const [praktikStartDate, setPraktikStartDate] = useState('');
  
  const toggleSupport = (id) => {
    setSelectedSupports(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };
  
  const isValid = () => {
    if (isEmployed === null) return false;
    if (isEmployed === true) return true;
    
    // If unemployed
    if (!monthsUnemployed) return false;
    if (isRegisteredAF === null) return false;
    
    if (isRegisteredAF === true) {
      if (selectedSupports.length === 0) return false;
      if (selectedSupports.includes('other') && !otherSupportText) return false;
      if (selectedSupports.includes('praktik') && (!praktikDuration || !praktikStartDate)) return false;
    }
    
    return true;
  };
  
  const handleContinue = () => {
    if (isValid()) {
      onUpdateProfile?.({
        isEmployed,
        monthsUnemployed,
        isRegisteredAF,
        selectedSupports,
        otherSupportText,
        praktikDuration,
        praktikStartDate,
      });
      onNavigate('locationPreferences');
    }
  };
  
  return (
    <ScreenContainer hasFooter className="bg-background">
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('basicInfo')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Progress */}
      <ProgressBar currentStep={2} totalSteps={7} />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Arbetssituation
        </h1>
        <p className="text-muted-foreground">
          Berätta om din nuvarande situation
        </p>
      </div>
      
      {/* Employment Status Question */}
      <div className="space-y-6">
        <div>
          <Label className="form-label mb-3 block">Arbetar du just nu?</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsEmployed(true)}
              className={`option-card ${
                isEmployed === true ? 'selected' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Ja</p>
                <p className="text-xs text-muted-foreground">I arbete</p>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setIsEmployed(false)}
              className={`option-card ${
                isEmployed === false ? 'selected' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <UserX className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Nej</p>
                <p className="text-xs text-muted-foreground">Arbetslös</p>
              </div>
            </button>
          </div>
        </div>
        
        {/* If Employed */}
        {isEmployed === true && (
          <div className="info-box info-box-secondary animate-fade-in">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm">Bra!</p>
                <p className="text-sm text-muted-foreground">
                  Du kan fortfarande söka nya möjligheter medan du är anställd.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* If Unemployed */}
        {isEmployed === false && (
          <div className="space-y-5 animate-fade-in">
            {/* Months Unemployed */}
            <div>
              <Label htmlFor="monthsUnemployed" className="form-label">
                Hur länge har du varit arbetslös?
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="monthsUnemployed"
                  type="number"
                  placeholder="6"
                  min="0"
                  max="120"
                  value={monthsUnemployed}
                  onChange={(e) => setMonthsUnemployed(e.target.value)}
                  className="form-input w-24"
                />
                <span className="text-muted-foreground">månader</span>
              </div>
            </div>
            
            {/* AF Registered */}
            <div>
              <Label className="form-label mb-3 block">
                Är du registrerad hos Arbetsförmedlingen?
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisteredAF(true)}
                  className={`option-card ${
                    isRegisteredAF === true ? 'selected' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">Ja</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsRegisteredAF(false)}
                  className={`option-card ${
                    isRegisteredAF === false ? 'selected' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <UserX className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">Nej</span>
                </button>
              </div>
            </div>
            
            {/* AF Support Options */}
            {isRegisteredAF === true && (
              <div className="animate-fade-in">
                <Label className="form-label mb-3 block">
                  Vilka insatser är du berättigad till?
                </Label>
                <div className="space-y-2">
                  {afSupportOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleSupport(option.id)}
                      className={`w-full option-card justify-between ${
                        selectedSupports.includes(option.id) ? 'selected' : ''
                      }`}
                    >
                      <span className="font-medium text-foreground">{option.label}</span>
                      {selectedSupports.includes(option.id) && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Other Support Text */}
                {selectedSupports.includes('other') && (
                  <div className="mt-3 animate-fade-in">
                    <Input
                      placeholder="Beskriv vilken insats..."
                      value={otherSupportText}
                      onChange={(e) => setOtherSupportText(e.target.value)}
                      className="form-input"
                    />
                  </div>
                )}
                
                {/* Praktik Details */}
                {selectedSupports.includes('praktik') && (
                  <div className="mt-4 p-4 bg-accent/5 rounded-xl border-2 border-accent/20 animate-fade-in">
                    <p className="font-medium text-foreground mb-3">Praktikdetaljer</p>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-1 block">
                          Varaktighet
                        </Label>
                        <select
                          value={praktikDuration}
                          onChange={(e) => setPraktikDuration(e.target.value)}
                          className="w-full h-12 rounded-xl border-2 border-border bg-background px-4 text-foreground focus:border-primary focus:outline-none"
                        >
                          <option value="">Välj varaktighet</option>
                          <option value="1">1 månad</option>
                          <option value="2">2 månader</option>
                          <option value="3">3 månader</option>
                          <option value="4">4 månader</option>
                          <option value="5">5 månader</option>
                          <option value="6">6 månader</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground mb-1 block">
                          Startdatum
                        </Label>
                        <Input
                          type="date"
                          value={praktikStartDate}
                          onChange={(e) => setPraktikStartDate(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Info about AF benefits */}
                <div className="info-box info-box-primary mt-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Fördelar med AF-stöd</p>
                      <p className="text-sm text-muted-foreground">
                        Arbetsgivare kan få ekonomiskt stöd för att anställa dig, vilket ökar dina chanser att få jobb.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="max-w-[390px] mx-auto">
          <Button 
            size="lg"
            className="w-full h-14"
            disabled={!isValid()}
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

export default EmploymentStatusScreen;
