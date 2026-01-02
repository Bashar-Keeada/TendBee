import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Briefcase, QrCode, Users, Sparkles } from 'lucide-react';

export const LandingScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer className="flex flex-col justify-between min-h-[80vh]">
      {/* Logo & Header */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 animate-scale-in">
          <Briefcase className="w-10 h-10 text-secondary" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">
          Jobbmatchning
        </h1>
        
        <p className="text-white/70 text-lg leading-relaxed max-w-xs">
          Hitta jobb. Hitta rätt person.
          <br />
          <span className="text-sm flex items-center justify-center gap-1 mt-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            AI-driven matchning
          </span>
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3 px-2">
        <Button 
          size="lg"
          className="w-full h-14 bg-gradient-to-r from-secondary to-accent text-white font-semibold hover:opacity-90"
          onClick={() => onNavigate('login', 'jobseeker')}
        >
          <Users className="w-5 h-5" />
          Jag söker jobb
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          className="w-full h-14 bg-white/5 border-white/20 text-white hover:bg-white/10"
          onClick={() => onNavigate('login', 'employer')}
        >
          <Briefcase className="w-5 h-5" />
          Jag är arbetsgivare
        </Button>
        
        <Button 
          variant="ghost"
          size="lg"
          className="w-full h-12 text-white/60 hover:text-white hover:bg-white/5"
          onClick={() => {}}
        >
          <QrCode className="w-5 h-5" />
          Skanna QR-kod
        </Button>
      </div>
      
      {/* Footer */}
      <div className="pt-6 pb-2 text-center">
        <p className="text-xs text-white/40">
          Genom att fortsätta godkänner du våra villkor
        </p>
      </div>
    </ScreenContainer>
  );
};

export default LandingScreen;
