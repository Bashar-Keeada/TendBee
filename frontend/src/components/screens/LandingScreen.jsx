import React from 'react';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Briefcase, QrCode, Users, Sparkles, ArrowRight, Shield, Zap, Star } from 'lucide-react';

export const LandingScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer className="flex flex-col justify-between min-h-[85vh]">
      {/* Logo & Header */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-8">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/30 transform hover:scale-105 transition-transform duration-300">
            <Briefcase className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          TendBee
        </h1>
        
        <p className="text-gray-600 text-lg leading-relaxed max-w-xs mb-6">
          Hitta jobb. Hitta rätt person.
        </p>
        
        {/* Feature badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
            <Sparkles className="w-3.5 h-3.5" />
            AI-matchning
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
            <Shield className="w-3.5 h-3.5" />
            GDPR-säkert
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
            <Zap className="w-3.5 h-3.5" />
            Snabb matchning
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3 px-2">
        <button 
          className="w-full h-14 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-xl group"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
            boxShadow: '0 12px 35px -8px rgba(245, 158, 11, 0.5)'
          }}
          onClick={() => onNavigate('login', 'jobseeker')}
        >
          <Users className="w-5 h-5" />
          <span>Jag söker jobb</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <button 
          className="w-full h-14 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
            color: 'white'
          }}
          onClick={() => onNavigate('login', 'employer')}
        >
          <Briefcase className="w-5 h-5" />
          <span>Jag är arbetsgivare</span>
        </button>
        
        <button 
          className="w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
          onClick={() => {}}
        >
          <QrCode className="w-5 h-5" />
          Skanna QR-kod
        </button>
      </div>
      
      {/* Footer */}
      <div className="pt-6 pb-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-1 text-amber-600">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <span className="text-xs text-gray-500 ml-2">4.9 betyg</span>
        </div>
        <p className="text-xs text-gray-400">
          Genom att fortsätta godkänner du våra <a href="/terms" className="underline hover:text-gray-600">villkor</a>
        </p>
      </div>
    </ScreenContainer>
  );
};

export default LandingScreen;
