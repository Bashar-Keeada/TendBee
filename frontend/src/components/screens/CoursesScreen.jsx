import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, Monitor, MapPin, Clock, CheckCircle2, Award, ArrowRight, Lock } from 'lucide-react';

export const CoursesScreen = ({ onNavigate, coursesCompleted, onCompleteCourse }) => {
  const { online = false, physical = false } = coursesCompleted || {};
  const completedCount = [online, physical].filter(Boolean).length;
  const allCompleted = online && physical;
  
  return (
    <ScreenContainer >
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('cvCompleted')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Kurser & Tester
        </h1>
        <p className="text-muted-foreground">
          Öka ditt profilvärde och stå ut
        </p>
      </div>
      
      {/* Progress */}
      <div className="info-box info-box-primary mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground text-sm">Öka din profil</p>
              <p className="text-xs text-muted-foreground">
                {allCompleted 
                  ? 'Alla kurser genomförda!' 
                  : `Varje kurs ökar din profil med 25%`
                }
              </p>
            </div>
          </div>
          <span className="text-lg font-bold text-primary">
            {completedCount}/2
          </span>
        </div>
      </div>
      
      {/* Course 1: Online */}
      <div className={`card-interactive mb-4 ${
        online ? 'border-secondary bg-secondary/5' : ''
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            online ? 'bg-secondary/20' : 'bg-purple-100'
          }`}>
            <Monitor className={`w-6 h-6 ${online ? 'text-secondary' : 'text-purple-600'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">Online Kunskapskurs</h3>
              {online && <CheckCircle2 className="w-4 h-4 text-secondary" />}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Testa din teoretiska kunskap med vårt online-test
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>20 min</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {online ? 'Genomförd' : 'Ej genomförd'}
              </Badge>
            </div>
            {!online && (
              <Button 
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-primary-foreground"
                onClick={() => onCompleteCourse?.('online')}
              >
                Starta kurs
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Course 2: Physical - Keeada Academy */}
      <div className={`card-interactive mb-6 ${
        physical ? 'border-secondary bg-secondary/5' : ''
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            physical ? 'bg-secondary/20' : 'bg-accent/20'
          }`}>
            <MapPin className={`w-6 h-6 ${physical ? 'text-secondary' : 'text-accent'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">Praktisk Kurs</h3>
              {physical && <CheckCircle2 className="w-4 h-4 text-secondary" />}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Keeada Academy - Testa dina praktiska färdigheter på plats
            </p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>2-4 veckor</span>
              </div>
              <Badge className="bg-secondary/15 text-secondary text-xs border-0">
                Betald praktik
              </Badge>
              <Badge className="bg-accent/15 text-accent text-xs border-0">
                Möjlig anställning
              </Badge>
            </div>
            {!physical && (
              <Button 
                size="sm"
                variant="accent"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => onCompleteCourse?.('physical')}
              >
                Ansök till praktik
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* All Completed Message */}
      {allCompleted && (
        <div className="info-box info-box-secondary animate-fade-in">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-semibold text-foreground">Alla kurser genomförda!</p>
              <p className="text-sm text-muted-foreground">
                Din profil är nu 100% komplett
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Back to Profile */}
      <div className="mt-6">
        <Button 
          variant="outline"
          className="w-full h-12"
          onClick={() => onNavigate('cvCompleted')}
        >
          Tillbaka till profil
        </Button>
      </div>
    </ScreenContainer>
  );
};

export default CoursesScreen;
