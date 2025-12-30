import React from 'react';
import { BookOpen } from 'lucide-react';

const LoadingSpinner = ({ loadingStage, surahId }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8">
    <div className="relative" aria-live="polite" aria-busy="true">
      <div className="w-20 h-20 rounded-full border-4 border-charcoal-700 border-t-cyan-main animate-spin" />
      <BookOpen className="w-8 h-8 text-cyan-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
    <p className="mt-6 text-lg font-medium text-white animate-pulse">
      Loading Surah {surahId}...
    </p>
    {loadingStage && (
      <p className="mt-2 text-sm text-slate-500">{loadingStage}</p>
    )}
  </div>
);

export default LoadingSpinner;
