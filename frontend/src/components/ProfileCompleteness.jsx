import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export const ProfileCompleteness = ({ percentage, className }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const isComplete = percentage === 100;
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 80) return '#22c55e'; // green
    if (percentage >= 50) return '#f59e0b'; // amber
    return '#f59e0b'; // amber default
  };
  
  return (
    <div className={cn('flex items-center gap-4 p-5 rounded-2xl border-2 transition-all', 
      isComplete ? 'bg-green-50 border-green-200' : 'bg-amber-50/50 border-amber-200',
      className
    )}>
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={isComplete ? '#dcfce7' : '#fef3c7'}
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={isComplete ? '#22c55e' : getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isComplete ? (
            <CheckCircle2 className="w-9 h-9 text-green-500" />
          ) : (
            <span className="text-xl font-bold text-gray-900">{percentage}%</span>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-gray-900">Profilstyrka</h4>
          {!isComplete && <TrendingUp className="w-4 h-4 text-amber-500" />}
        </div>
        <p className="text-sm text-gray-600">
          {isComplete 
            ? 'Din profil är komplett! 🎉' 
            : `${100 - percentage}% kvar till komplett profil`
          }
        </p>
        {!isComplete && percentage < 50 && (
          <p className="text-xs text-amber-600 mt-1 font-medium">
            Fyll i mer för bättre matchningar
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileCompleteness;
