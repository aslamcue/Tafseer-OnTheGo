import React from 'react';

const BackgroundPattern = () => (
  <div className="fixed inset-0 z-0 opacity-[0.08] pointer-events-none">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <pattern id="hex-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z" fill="none" stroke="#32E0FF" strokeWidth="0.5" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#hex-grid)" />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-b from-charcoal-800 via-transparent to-charcoal-900"></div>
  </div>
);

export default BackgroundPattern;
