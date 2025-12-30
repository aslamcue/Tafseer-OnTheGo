import React from 'react';
import { PlayCircle, Heart, FileText, BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
import TafseerPanel from './TafseerPanel.jsx';

const VerseCard = ({ 
  verse, 
  index,
  isActive, 
  isExpanded,
  isFavorite,
  isSummary,
  displayedTafseer,
  onPlay,
  onToggleFavorite,
  onToggleExpanded,
  onGenerateSummary
}) => {
  return (
    <div 
      className={`p-6 rounded-2xl border transition-all duration-300 relative ${
        isActive 
          ? 'bg-gradient-to-br from-charcoal-700 to-charcoal-800 border-cyan-main/40 shadow-cyan-glow' 
          : 'glass-card border-transparent hover:border-glass-border'
      }`}
    >
      {/* Verse Header */}
      <div className="flex justify-between items-start mb-4">
        <span 
          className="bg-charcoal-900 text-cyan-main text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-main/20"
          aria-label={`Verse ${verse.id}`}
        >
          {verse.id}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onPlay(index); 
            }} 
            className="text-slate-400 hover:text-cyan-main transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Play verse ${verse.id}`}
            title="Play this verse"
          >
            <PlayCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onToggleFavorite(verse.id); 
            }}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={isFavorite ? `Remove verse ${verse.id} from favorites` : `Add verse ${verse.id} to favorites`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-slate-600 hover:text-red-400'
              }`} 
            />
          </button>
        </div>
      </div>
      
      {/* Arabic Text */}
      <p 
        className="text-right font-quran text-2xl md:text-3xl text-white leading-loose mb-6 select-text"
        lang="ar"
        dir="rtl"
      >
        {verse.text}
      </p>
      
      {/* Translation */}
      <div className="mb-6 p-4 bg-charcoal-900/30 rounded-xl border border-glass-border/50">
        <p className="text-xs text-green-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
          <FileText className="w-3 h-3" aria-hidden="true" />
          Translation
        </p>
        <p 
          className="text-slate-200 text-sm md:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: verse.translation }}
        />
      </div>
      
      {/* Tafseer Section */}
      <div className="bg-charcoal-900/50 rounded-xl border border-glass-border relative overflow-hidden transition-all">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onToggleExpanded(verse.id); 
          }} 
          className="w-full flex justify-between items-center p-4 text-xs font-bold text-amber-400 uppercase tracking-wider hover:bg-white/5 transition-colors min-h-[44px]"
          aria-expanded={isExpanded}
          aria-controls={`tafseer-${verse.id}`}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            {isSummary ? 'Read Summary' : 'Read Tafseer (Ibn Kathir)'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-normal normal-case">
              {isExpanded ? 'Hide' : 'Expand'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </div>
        </button>
        
        {isExpanded && (
          <div 
            id={`tafseer-${verse.id}`}
            className="px-4 pb-4 pt-0 border-t border-glass-border animate-in slide-in-from-top-2 duration-300"
          >
            <div className="mt-4">
              <TafseerPanel 
                tafseerHTML={displayedTafseer}
                isSummary={isSummary}
                onGenerateSummary={onGenerateSummary ? () => onGenerateSummary(index) : null}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerseCard;
