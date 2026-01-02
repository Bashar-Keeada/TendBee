import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChevronLeft, MapPin, Briefcase, Clock, Calendar, Filter, SortDesc, Users } from 'lucide-react';
import { mockCandidates } from '@/config/appConfig';

export const CandidateListScreen = ({ onNavigate }) => {
  const getMatchBadgeClass = (match) => {
    if (match >= 85) return 'match-badge match-high';
    if (match >= 70) return 'match-badge match-medium';
    return 'match-badge match-low';
  };
  
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground mb-1">
            Matchande kandidater
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="w-4 h-4" />
            {mockCandidates.length} kandidater
          </p>
        </div>
      </div>
      
      {/* Filter/Sort Buttons */}
      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" className="flex-1">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <SortDesc className="w-4 h-4" />
          Sortera
        </Button>
      </div>
      
      {/* Candidate List */}
      <div className="space-y-4">
        {mockCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="card-interactive animate-fade-in"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-secondary">
                    {candidate.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.role}</p>
                </div>
              </div>
              <span className={getMatchBadgeClass(candidate.match)}>
                {candidate.match}%
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{candidate.experience}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{candidate.location}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {candidate.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-muted text-muted-foreground border-0">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{candidate.availability}</span>
              </div>
              <Button size="sm" variant="secondary">
                <Calendar className="w-4 h-4" />
                Bjud in
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More */}
      <div className="mt-6 text-center">
        <Button variant="ghost" className="text-muted-foreground">
          Visa fler kandidater
        </Button>
      </div>
    </ScreenContainer>
  );
};

export default CandidateListScreen;
