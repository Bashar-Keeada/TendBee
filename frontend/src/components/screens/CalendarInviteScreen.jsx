import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, Calendar, Clock, MapPin, Building2, CheckCircle2, X } from 'lucide-react';

export const CalendarInviteScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer className="bg-background">
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('interestSent')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Kalenderinbjudan
        </h1>
        <p className="text-sm text-muted-foreground">
          Exempel på hur en inbjudan ser ut
        </p>
      </div>
      
      {/* Event Card */}
      <div className="bg-card border-2 border-border rounded-xl p-5 mb-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-xs font-medium text-secondary uppercase tracking-wide">
            Kommande händelse
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-foreground mb-2">
          Intervju - Lagerarbetare
        </h2>
        
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Building2 className="w-4 h-4" />
          <span>Arlanda Logistics AB</span>
        </div>
        
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Måndag 15 januari 2025</p>
              <p className="text-sm text-muted-foreground">kl. 10:00 - 11:00</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Arlanda Logistics AB</p>
              <p className="text-sm text-muted-foreground">Flygplatsvgen 12, Arlanda</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">1 timme</p>
              <p className="text-sm text-muted-foreground">Beräknad tid</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="bg-muted/50 rounded-xl p-4 mb-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Beskrivning:</span> Välkommen till intervju för tjänsten som lagerarbetare. Ta med dig legitimation och eventuella intyg. Fråga efter Anna vid receptionen.
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="secondary"
          size="lg"
          className="w-full h-14"
          onClick={() => onNavigate('jobList')}
        >
          <CheckCircle2 className="w-5 h-5" />
          Acceptera
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          className="w-full h-12"
          onClick={() => onNavigate('jobList')}
        >
          <X className="w-5 h-5" />
          Neka
        </Button>
      </div>
    </ScreenContainer>
  );
};

export default CalendarInviteScreen;
