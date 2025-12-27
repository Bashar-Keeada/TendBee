import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export const ProfileCompleteness = ({ percentage, className }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const isComplete = percentage === 100;
  
  return (
    <div className={cn('flex items-center gap-4 p-4 bg-muted/50 rounded-xl', className)}>
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={isComplete ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isComplete ? (
            <CheckCircle2 className="w-8 h-8 text-secondary" />
          ) : (
            <span className="text-lg font-bold text-foreground">{percentage}%</span>
          )}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground">Profil</h4>
        <p className="text-sm text-muted-foreground">
          {isComplete 
            ? 'Din profil är komplett!' 
            : `${100 - percentage}% kvar till komplett profil`
          }
        </p>
      </div>
    </div>
  );
};

export default ProfileCompleteness;
