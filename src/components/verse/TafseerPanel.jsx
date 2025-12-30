import React from 'react';
import { Sparkles } from 'lucide-react';
import { formatTafseerHTML } from '../../utils/formatters.js';

/**
 * Styled Tafseer Display Component
 * Renders formatted tafseer with beautiful typography and spacing
 */
const TafseerPanel = ({ tafseerHTML, isSummary, onGenerateSummary }) => {
  return (
    <div className="tafseer-content">
      <div 
        className="prose prose-invert prose-sm md:prose-base max-w-none"
        dangerouslySetInnerHTML={{ __html: formatTafseerHTML(tafseerHTML) }} 
      />
      {!isSummary && onGenerateSummary && (
        <button 
          onClick={onGenerateSummary}
          className="mt-6 text-xs bg-gradient-to-r from-cyan-main/10 to-blue-500/10 text-cyan-main px-4 py-2.5 rounded-lg hover:from-cyan-main/20 hover:to-blue-500/20 flex items-center gap-2 w-full justify-center border border-cyan-main/20 transition-all duration-300"
          aria-label="Generate concise summary of tafseer"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" /> 
          <span>Generate Concise Summary</span>
        </button>
      )}
    </div>
  );
};

export default TafseerPanel;
