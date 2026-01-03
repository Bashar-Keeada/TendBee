import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, Shield, Smartphone, ArrowRight } from 'lucide-react';

export const LoginScreen = ({ onNavigate, userType }) => {
  const isJobseeker = userType === 'jobseeker';
  
  return (
    <ScreenContainer className="flex flex-col min-h-[80vh]">
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* BankID Mock Icon */}
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
          style={{
            background: isJobseeker 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
            boxShadow: isJobseeker 
              ? '0 10px 30px -5px rgba(245, 158, 11, 0.4)'
              : '0 10px 30px -5px rgba(30, 58, 95, 0.4)'
          }}
        >
          <Shield className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isJobseeker ? 'Logga in som jobbsökare' : 'Logga in som arbetsgivare'}
        </h1>
        
        <p className="text-muted-foreground mb-8 max-w-xs">
          {isJobseeker 
            ? 'Identifiera dig säkert med BankID för att skapa din profil'
            : 'Logga in med BankID för att hantera ditt företag och hitta kandidater'
          }
        </p>
        
        {/* BankID Info Box */}
        <div className="w-full mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-left">
              <p className="font-medium text-foreground text-sm">Mobilt BankID</p>
              <p className="text-sm text-muted-foreground">
                Öppna BankID-appen på din mobil för att identifiera dig
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Button */}
      <div className="px-2 pb-4">
        <button 
          className="w-full h-14 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] shadow-lg"
          style={{
            background: isJobseeker 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
              : 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
            boxShadow: isJobseeker 
              ? '0 10px 30px -5px rgba(245, 158, 11, 0.4)'
              : '0 10px 30px -5px rgba(30, 58, 95, 0.4)'
          }}
          onClick={() => onNavigate(isJobseeker ? 'basicInfo' : 'companyInfo')}
        >
          <Shield className="w-5 h-5" />
          Logga in med BankID
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          Din information hanteras säkert enligt GDPR
        </p>
      </div>
    </ScreenContainer>
  );
};

export default LoginScreen;
