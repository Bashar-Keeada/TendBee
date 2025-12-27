import React from 'react';
import { cn } from '@/lib/utils';

export const ScreenContainer = ({ 
  children, 
  className,
  hasFooter = false,
  animate = true 
}) => {
  return (
    <div 
      className={cn(
        'screen-container scrollbar-hide',
        hasFooter && 'pb-28',
        animate && 'animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ScreenContainer;
