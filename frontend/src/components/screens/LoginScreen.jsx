import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, Shield, Smartphone, ArrowRight, Lock } from 'lucide-react';

export const LoginScreen = ({ onNavigate, userType }) => {
  const isJobseeker = userType === 'jobseeker';
  
  return (
    <ScreenContainer className="flex flex-col min-h-[85vh]">
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('landing')}
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors mb-8 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-medium">Tillbaka</span>
      </button>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* BankID Mock Icon */}
        <div className="relative mb-8">
          <div 
            className={`absolute inset-0 rounded-full blur-xl opacity-40 ${isJobseeker ? 'bg-amber-400' : 'bg-slate-700'}`}
          />
          <div 
            className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: isJobseeker 
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
            }}
          >
            <Shield className="w-14 h-14 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isJobseeker ? 'Logga in som jobbsökare' : 'Logga in som arbetsgivare'}
        </h1>
        
        <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">
          {isJobseeker 
            ? 'Identifiera dig säkert med BankID för att skapa din profil'
            : 'Logga in med BankID för att hantera ditt företag och hitta kandidater'
          }
        </p>
        
        {/* BankID Info Box */}
        <div className="w-full mb-8 p-5 rounded-2xl border-2"
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderColor: '#fcd34d'
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm">Mobilt BankID</p>
              <p className="text-sm text-amber-700">
                Öppna BankID-appen på din mobil för att identifiera dig
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Button */}
      <div className="px-2 pb-6">
        <button 
          className="w-full h-14 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-xl group"
          style={{
            background: isJobseeker 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
              : 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
            boxShadow: isJobseeker 
              ? '0 12px 35px -8px rgba(245, 158, 11, 0.5)'
              : '0 12px 35px -8px rgba(30, 58, 95, 0.5)'
          }}
          onClick={() => onNavigate(isJobseeker ? 'basicInfo' : 'companyInfo')}
        >
          <Shield className="w-5 h-5" />
          <span>Logga in med BankID</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          Din information hanteras säkert enligt GDPR
        </p>
      </div>
    </ScreenContainer>
  );
};

export default LoginScreen;
