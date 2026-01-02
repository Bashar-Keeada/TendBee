import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { ChevronLeft, QrCode, Share2, Info, Search } from 'lucide-react';

export const MyQRCodeScreen = ({ onNavigate, profilePercentage = 50 }) => {
  return (
    <ScreenContainer hasFooter >
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('cvCompleted')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Profile Completeness */}
      <ProfileCompleteness percentage={profilePercentage} className="mb-6" />
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Min QR-kod
        </h1>
        <p className="text-muted-foreground">
          Visa denna kod för arbetsgivare
        </p>
      </div>
      
      {/* QR Code */}
      <div className="qr-container mb-6 animate-scale-in">
        <QrCode className="w-48 h-48 text-foreground" />
      </div>
      
      {/* Name placeholder */}
      <div className="text-center mb-6">
        <p className="font-semibold text-foreground text-lg">Erik Svensson</p>
        <p className="text-sm text-muted-foreground">Lager & Logistik</p>
      </div>
      
      {/* Info Box */}
      <div className="info-box info-box-primary mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Hur funkar det?</p>
            <p className="text-sm text-muted-foreground">
              När en arbetsgivare skannar din QR-kod får de direkt tillgång till din profil och kan kontakta dig för jobb.
            </p>
          </div>
        </div>
      </div>
      
      {/* Share Button */}
      <Button 
        variant="outline"
        size="lg"
        className="w-full h-12 mb-3"
        onClick={() => {}}
      >
        <Share2 className="w-5 h-5" />
        Dela QR-kod
      </Button>
      
      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="max-w-[390px] mx-auto">
          <Button 
            size="lg"
            className="w-full h-14"
            onClick={() => onNavigate('jobList')}
          >
            <Search className="w-5 h-5" />
            Se jobb
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default MyQRCodeScreen;
