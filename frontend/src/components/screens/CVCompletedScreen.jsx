import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { CheckCircle2, QrCode, Search, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export const CVCompletedScreen = ({ onNavigate, profilePercentage = 50 }) => {
  return (
    <ScreenContainer className="bg-background">
      {/* Success Header */}
      <div className="text-center pt-8 pb-6">
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-secondary" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Din profil är klar!
        </h1>
        <p className="text-muted-foreground">
          Nu kan arbetsgivare hitta dig
        </p>
      </div>
      
      {/* Profile Completeness */}
      <ProfileCompleteness percentage={profilePercentage} className="mb-6" />
      
      {/* Info Box */}
      <div className="info-box info-box-secondary mb-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-secondary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Grattis!</p>
            <p className="text-sm text-muted-foreground">
              Din profil är nu synlig för arbetsgivare. Ju mer komplett profil, desto bättre matchningar!
            </p>
          </div>
        </div>
      </div>
      
      {/* Action Cards */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('myQRCode')}
          className="w-full card-interactive flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <QrCode className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-foreground">Se min QR-kod</p>
            <p className="text-sm text-muted-foreground">Visa för arbetsgivare</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <button
          onClick={() => onNavigate('jobList')}
          className="w-full card-interactive flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-secondary" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-foreground">Sök jobb nu</p>
            <p className="text-sm text-muted-foreground">Se matchade jobb</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <button
          onClick={() => onNavigate('courses')}
          className="w-full card-interactive flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-foreground">Förbättra min profil</p>
            <p className="text-sm text-muted-foreground">Ta kurser och tester</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      
      {/* Tips */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Tips: Genomför kurser för att öka din profil till 100%
        </p>
      </div>
    </ScreenContainer>
  );
};

export default CVCompletedScreen;
