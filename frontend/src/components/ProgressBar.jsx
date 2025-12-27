import React from 'react';
import { cn } from '@/lib/utils';

export const ProgressBar = ({ currentStep, totalSteps, className }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Steg {currentStep} av {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
