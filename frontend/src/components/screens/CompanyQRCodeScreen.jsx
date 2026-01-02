import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, QrCode, Download, Share2, Info, Printer, Building2 } from 'lucide-react';

export const CompanyQRCodeScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer >
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('employerDashboard')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Företagets QR-kod
        </h1>
        <p className="text-muted-foreground">
          Låt kandidater ansöka direkt
        </p>
      </div>
      
      {/* QR Code */}
      <div className="qr-container mb-6 animate-scale-in">
        <QrCode className="w-48 h-48 text-foreground" />
      </div>
      
      {/* Company Info */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-secondary" />
          <p className="font-semibold text-foreground text-lg">Arlanda Logistics AB</p>
        </div>
        <p className="text-sm text-muted-foreground">3 aktiva jobb</p>
      </div>
      
      {/* Tips */}
      <div className="info-box info-box-secondary mb-6">
        <div className="flex items-start gap-3">
          <Printer className="w-5 h-5 text-secondary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Tips!</p>
            <p className="text-sm text-muted-foreground">
              Skriv ut denna QR-kod och sätt upp på arbetsplatsen. Kandidater kan skanna för att se era lediga tjänster och ansöka direkt.
            </p>
          </div>
        </div>
      </div>
      
      {/* Info Box */}
      <div className="info-box info-box-primary mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Hur funkar det?</p>
            <p className="text-sm text-muted-foreground">
              När någon skannar koden kommer de direkt till era lediga tjänster och kan ansöka med sin profil.
            </p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="secondary"
          size="lg"
          className="w-full h-12"
          onClick={() => {}}
        >
          <Download className="w-5 h-5" />
          Ladda ner
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          className="w-full h-12"
          onClick={() => {}}
        >
          <Share2 className="w-5 h-5" />
          Dela
        </Button>
      </div>
    </ScreenContainer>
  );
};

export default CompanyQRCodeScreen;
