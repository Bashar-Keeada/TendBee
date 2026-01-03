import React from 'react';
import { cn } from '@/lib/utils';

export const ProgressBar = ({ currentStep, totalSteps, className }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-gray-600">
          Steg {currentStep} av {totalSteps}
        </span>
        <span className="text-sm font-bold text-amber-600">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
