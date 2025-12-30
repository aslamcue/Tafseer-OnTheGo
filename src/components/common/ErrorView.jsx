import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorView = ({ error, onRetry }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" role="alert">
    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
      <AlertCircle className="w-10 h-10 text-red-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">Failed to Load</h3>
    <p className="text-sm text-slate-400 max-w-sm mb-6">{error}</p>
    <button 
      onClick={onRetry}
      className="px-6 py-3 bg-cyan-main text-charcoal-900 rounded-lg font-medium hover:bg-cyan-main/90 transition-colors"
      aria-label="Try loading again"
    >
      Try Again
    </button>
  </div>
);

export default ErrorView;
