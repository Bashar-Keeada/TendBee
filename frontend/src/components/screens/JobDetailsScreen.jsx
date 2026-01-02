import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, MapPin, Clock, Building2, CheckCircle2, Heart } from 'lucide-react';
import { mockJobs } from '@/config/appConfig';

export const JobDetailsScreen = ({ onNavigate, selectedJob }) => {
  const job = selectedJob || mockJobs[0];
  
  const getMatchBadgeClass = (match) => {
    if (match >= 85) return 'match-badge match-high';
    if (match >= 70) return 'match-badge match-medium';
    return 'match-badge match-low';
  };
  
  return (
    <ScreenContainer hasFooter >
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('jobList')}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Tillbaka</span>
      </button>
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
          <span className={`${getMatchBadgeClass(job.match)} text-base px-4 py-1.5`}>
            {job.match}%
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-muted-foreground mb-2">
          <Building2 className="w-4 h-4" />
          <span>{job.company}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{job.type}</span>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-border mb-6" />
      
      {/* About the job */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Om jobbet</h2>
        <p className="text-muted-foreground leading-relaxed">
          {job.description}
        </p>
      </div>
      
      {/* Requirements */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Vi söker dig som</h2>
        <ul className="space-y-2">
          {job.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-1 shrink-0" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Benefits */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Vi erbjuder</h2>
        <ul className="space-y-2">
          {job.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-muted-foreground">
              <Heart className="w-4 h-4 text-accent mt-1 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Salary */}
      <div className="info-box info-box-secondary">
        <p className="font-medium text-foreground">Lön</p>
        <p className="text-muted-foreground">{job.salary}</p>
      </div>
      
      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="max-w-[390px] mx-auto">
          <Button 
            variant="secondary"
            size="lg"
            className="w-full h-14"
            onClick={() => onNavigate('interestSent')}
          >
            <Heart className="w-5 h-5" />
            Jag är intresserad
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default JobDetailsScreen;
