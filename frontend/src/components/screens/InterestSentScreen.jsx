import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { CheckCircle2, ChevronRight, Calendar, Bell, Search } from 'lucide-react';

export const InterestSentScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer className="bg-background">
      {/* Success Header */}
      <div className="text-center pt-12 pb-8">
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-secondary" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Intresse skickat!
        </h1>
        <p className="text-muted-foreground">
          Arbetsgivaren har fått din intresseanmälan
        </p>
      </div>
      
      {/* Success Message */}
      <div className="info-box info-box-secondary mb-6 animate-fade-in">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-secondary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Notis skickad</p>
            <p className="text-sm text-muted-foreground">
              Arbetsgivaren får en notis om ditt intresse och kan kontakta dig direkt.
            </p>
          </div>
        </div>
      </div>
      
      {/* Next Steps Card */}
      <div className="bg-muted/50 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Nästa steg</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Arbetsgivaren granskar</p>
              <p className="text-xs text-muted-foreground">Din profil jämförs med jobbkraven</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/60 flex items-center justify-center text-primary-foreground text-xs font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Kalenderinbjudan</p>
              <p className="text-xs text-muted-foreground">Du kan få en inbjudan till intervju</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-foreground text-xs font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Möte</p>
              <p className="text-xs text-muted-foreground">Träffa arbetsgivaren för intervju</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          size="lg"
          className="w-full h-14"
          onClick={() => onNavigate('jobList')}
        >
          <Search className="w-5 h-5" />
          Se fler jobb
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          className="w-full h-12"
          onClick={() => onNavigate('calendarInvite')}
        >
          <Calendar className="w-5 h-5" />
          Se exempel på kalenderinbjudan
        </Button>
      </div>
    </ScreenContainer>
  );
};

export default InterestSentScreen;
