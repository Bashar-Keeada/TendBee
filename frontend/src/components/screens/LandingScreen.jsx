import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Briefcase, QrCode, Users, Sparkles, ArrowRight } from 'lucide-react';

export const LandingScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer className="flex flex-col justify-between min-h-[80vh]">
      {/* Logo & Header */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 animate-scale-in shadow-lg shadow-amber-500/30">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Jobbmatchning
        </h1>
        
        <p className="text-muted-foreground text-lg leading-relaxed max-w-xs">
          Hitta jobb. Hitta rätt person.
          <br />
          <span className="text-sm flex items-center justify-center gap-1 mt-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI-driven matchning
          </span>
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3 px-2">
        <button 
          className="w-full h-14 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
            boxShadow: '0 10px 30px -5px rgba(245, 158, 11, 0.4)'
          }}
          onClick={() => onNavigate('login', 'jobseeker')}
        >
          <Users className="w-5 h-5" />
          Jag söker jobb
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <button 
          className="w-full h-14 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] border-2"
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'white'
          }}
          onClick={() => onNavigate('login', 'employer')}
        >
          <Briefcase className="w-5 h-5" />
          Jag är arbetsgivare
        </button>
        
        <Button 
          variant="ghost"
          size="lg"
          className="w-full h-12 text-muted-foreground hover:text-foreground"
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
