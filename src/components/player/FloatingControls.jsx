import React from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX } from 'lucide-react';

const FloatingControls = ({ 
  isPlaying,
  playbackMode,
  currentVerseIndex,
  totalVerses,
  surahName,
  volume,
  onTogglePlay,
  onStop,
  onPrevious,
  onNext,
  onVolumeChange,
  onToggleMute
}) => {
  const progress = totalVerses > 0 ? ((currentVerseIndex + 1) / totalVerses) * 100 : 0;
  const isPodcastMode = playbackMode === 'podcast';

  return (
    <div className="fixed bottom-[80px] left-4 right-4 glass-card rounded-2xl p-4 border-t border-glass-border shadow-2xl flex items-center gap-4 z-40 lg:left-72">
      {/* Previous */}
      <button 
        onClick={onPrevious}
        disabled={isPodcastMode}
        className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Previous verse"
        title="Previous verse (Left Arrow)"
      >
        <SkipBack className="w-5 h-5" />
      </button>
      
      {/* Stop */}
      <button 
        onClick={onStop}
        className="text-slate-400 hover:text-red-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Stop playback"
        title="Stop playback"
      >
        <X className="w-5 h-5" />
      </button>
      
      {/* Play/Pause */}
      <button 
        onClick={onTogglePlay} 
        className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-main to-blue-500 flex items-center justify-center text-charcoal-900 shadow-cyan-glow hover:scale-105 transition-transform"
        aria-label={isPlaying ? "Pause" : "Play"}
        title={isPlaying ? "Pause (Space)" : "Play (Space)"}
      >
        {isPlaying 
          ? <Pause className="w-6 h-6 fill-current" /> 
          : <Play className="w-6 h-6 fill-current ml-1" />
        }
      </button>
      
      {/* Next */}
      <button 
        onClick={onNext}
        disabled={isPodcastMode}
        className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Next verse"
        title="Next verse (Right Arrow)"
      >
        <SkipForward className="w-5 h-5" />
      </button>
      
      {/* Volume Control */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={onToggleMute}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label={volume === 0 ? "Unmute" : "Mute"}
          title={volume === 0 ? "Unmute (M)" : "Mute (M)"}
        >
          {volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          aria-label="Volume control"
          title="Adjust volume"
          style={{
            background: `linear-gradient(to right, #32E0FF 0%, #32E0FF ${volume * 100}%, #334155 ${volume * 100}%, #334155 100%)`
          }}
        />
      </div>
      
      {/* Progress Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">
          {surahName}
          {!isPodcastMode && totalVerses > 0 && (
            <span className="text-slate-400 font-normal ml-2">
              Verse {currentVerseIndex + 1} of {totalVerses}
            </span>
          )}
        </p>
        <div 
          className="w-full h-1.5 bg-charcoal-700 rounded-full mt-2 overflow-hidden"
          role="progressbar"
          aria-valuenow={currentVerseIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalVerses}
        >
          <div 
            className="h-full bg-gradient-to-r from-cyan-main to-blue-500 transition-all duration-500 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingControls;
