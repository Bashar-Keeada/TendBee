import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Briefcase, Users, QrCode, PlusCircle, Building2, TrendingUp } from 'lucide-react';

export const EmployerDashboardScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer hasFooter className="bg-background">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Välkommen tillbaka!
        </p>
      </div>
      
      {/* Company Card */}
      <div className="bg-secondary/10 rounded-xl p-4 mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Arlanda Logistics AB</p>
            <p className="text-sm text-muted-foreground">Lager & Logistik</p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card border-2 border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-3xl font-bold text-foreground">3</span>
          </div>
          <p className="text-sm text-muted-foreground">Aktiva jobb</p>
        </div>
        
        <div className="bg-card border-2 border-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground">12</span>
          </div>
          <p className="text-sm text-muted-foreground">Matchande kandidater</p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="info-box info-box-secondary mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-secondary" />
          <div>
            <p className="font-medium text-foreground text-sm">Bra matchningar!</p>
            <p className="text-xs text-muted-foreground">
              Du har 4 kandidater med över 90% matchning
            </p>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-6">
        <h2 className="font-semibold text-foreground mb-3">Senaste aktivitet</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <p className="text-sm text-foreground flex-1">Anna Andersson visade intresse</p>
            <span className="text-xs text-muted-foreground">2 tim</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <p className="text-sm text-foreground flex-1">Ny matchning: 95%</p>
            <span className="text-xs text-muted-foreground">5 tim</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-sm text-foreground flex-1">QR-kod skannades 3 ggr</p>
            <span className="text-xs text-muted-foreground">1 dag</span>
          </div>
        </div>
      </div>
      
      {/* Sticky Footer Navigation */}
      <div className="sticky-footer">
        <div className="max-w-[390px] mx-auto grid grid-cols-3 gap-3">
          <Button 
            variant="secondary"
            className="flex-col h-auto py-3 gap-1"
            onClick={() => onNavigate('createJob')}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-xs">Nytt jobb</span>
          </Button>
          
          <Button 
            variant="outline"
            className="flex-col h-auto py-3 gap-1"
            onClick={() => onNavigate('companyQRCode')}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs">QR-kod</span>
          </Button>
          
          <Button 
            variant="outline"
            className="flex-col h-auto py-3 gap-1"
            onClick={() => onNavigate('candidateList')}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Kandidater</span>
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default EmployerDashboardScreen;
