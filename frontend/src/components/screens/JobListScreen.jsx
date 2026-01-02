import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { ChevronLeft, MapPin, Clock, Building2, Settings2, Sparkles } from 'lucide-react';
import { mockJobs } from '@/config/appConfig';

export const JobListScreen = ({ onNavigate, onSelectJob, profilePercentage = 50 }) => {
  const getMatchBadgeClass = (match) => {
    if (match >= 85) return 'match-badge match-high';
    if (match >= 70) return 'match-badge match-medium';
    return 'match-badge match-low';
  };
  
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
      
      {/* Profile Completeness */}
      <ProfileCompleteness percentage={profilePercentage} className="mb-6" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground mb-1">
            Rekommenderade jobb
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-accent" />
            Baserat på din profil
          </p>
        </div>
        <Button variant="outline" size="icon-sm">
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Job List */}
      <div className="space-y-4">
        {mockJobs.map((job) => (
          <button
            key={job.id}
            onClick={() => {
              onSelectJob?.(job);
              onNavigate('jobDetails');
            }}
            className="w-full card-interactive text-left animate-fade-in"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{job.company}</span>
                </div>
              </div>
              <span className={getMatchBadgeClass(job.match)}>
                {job.match}% match
              </span>
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
            
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">{job.salary}</p>
            </div>
          </button>
        ))}
      </div>
      
      {/* Load More */}
      <div className="mt-6 text-center">
        <Button variant="ghost" className="text-muted-foreground">
          Visa fler jobb
        </Button>
      </div>
    </ScreenContainer>
  );
};

export default JobListScreen;
