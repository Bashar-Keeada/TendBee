import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, Shield, Smartphone } from 'lucide-react';

export const LoginScreen = ({ onNavigate, userType }) => {
  const isJobseeker = userType === 'jobseeker';
  
  return (
    <ScreenContainer className="flex flex-col min-h-[80vh]">
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-1 text-white/60 hover:text-white transition-colors mb-8"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* BankID Mock Icon */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-secondary/20">
          <Shield className="w-12 h-12 text-secondary" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          {isJobseeker ? 'Logga in som jobbsökare' : 'Logga in som arbetsgivare'}
        </h1>
        
        <p className="text-white/60 mb-8 max-w-xs">
          {isJobseeker 
            ? 'Identifiera dig säkert med BankID för att skapa din profil'
            : 'Logga in med BankID för att hantera ditt företag och hitta kandidater'
          }
        </p>
        
        {/* BankID Info Box */}
        <div className="w-full mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-secondary mt-0.5" />
            <div className="text-left">
              <p className="font-medium text-white text-sm">Mobilt BankID</p>
              <p className="text-sm text-white/60">
                Öppna BankID-appen på din mobil för att identifiera dig
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Button */}
      <div className="px-2 pb-4">
        <Button 
          size="lg"
          className="w-full h-14 bg-gradient-to-r from-secondary to-accent text-white font-semibold hover:opacity-90"
          onClick={() => onNavigate(isJobseeker ? 'basicInfo' : 'companyInfo')}
        >
          <Shield className="w-5 h-5" />
          Logga in med BankID
        </Button>
        
        <p className="text-xs text-center text-white/40 mt-4">
          Din information hanteras säkert enligt GDPR
        </p>
      </div>
    </ScreenContainer>
  );
};

export default LoginScreen;
