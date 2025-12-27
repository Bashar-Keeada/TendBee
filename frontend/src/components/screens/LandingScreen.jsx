import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Briefcase, QrCode, Users, Sparkles } from 'lucide-react';

export const LandingScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer className="flex flex-col justify-between min-h-full bg-background">
      {/* Logo & Header */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 animate-scale-in">
          <Briefcase className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Jobbmatchning
        </h1>
        
        <p className="text-muted-foreground text-lg leading-relaxed max-w-xs">
          Hitta jobb. Hitta rätt person.
          <br />
          <span className="text-sm flex items-center justify-center gap-1 mt-2">
            <Sparkles className="w-4 h-4 text-accent" />
            AI-driven matchning
          </span>
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3 px-2">
        <Button 
          size="lg"
          className="w-full h-14"
          onClick={() => onNavigate('login', 'jobseeker')}
        >
          <Users className="w-5 h-5" />
          Jag söker jobb
        </Button>
        
        <Button 
          variant="secondary"
          size="lg"
          className="w-full h-14"
          onClick={() => onNavigate('login', 'employer')}
        >
          <Briefcase className="w-5 h-5" />
          Jag är arbetsgivare
        </Button>
        
        <Button 
          variant="ghost"
          size="lg"
          className="w-full h-12 text-muted-foreground"
          onClick={() => {}}
        >
          <QrCode className="w-5 h-5" />
          Skanna QR-kod
        </Button>
      </div>
      
      {/* Footer */}
      <div className="pt-6 pb-2 text-center">
        <p className="text-xs text-muted-foreground">
          Genom att fortsätta godkänner du våra villkor
        </p>
      </div>
    </ScreenContainer>
  );
};

export default LandingScreen;
