import React from 'react';

export const MobileFrame = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-border flex items-center justify-center p-4">
      <div className="phone-frame">
        {/* Notch */}
        <div className="phone-notch" />
        
        {/* Screen */}
        <div className="phone-screen">
          <div className="h-full overflow-hidden">
            {children}
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-muted-foreground/30 rounded-full z-50" />
      </div>
    </div>
  );
};

export default MobileFrame;
