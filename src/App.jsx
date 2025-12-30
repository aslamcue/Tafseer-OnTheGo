import React, { useState } from 'react';
import './styles/App.css';

// Components
import BackgroundPattern from './components/ui/BackgroundPattern.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import ErrorView from './components/common/ErrorView.jsx';
import FloatingControls from './components/player/FloatingControls.jsx';
import VerseCard from './components/verse/VerseCard.jsx';

// Hooks
import { useSurahData } from './hooks/useSurahData.js';
import { useAudioPlayer } from './hooks/useAudioPlayer.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';

// Icons
import { 
  Menu, Settings, Volume2, FileText, BookOpen, ToggleLeft, ToggleRight,
  User, UserCheck, Sparkles, Bot, Radio, Headphones, ChevronDown,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // UI State
  const [activeTab, setActiveTab] = useState('home');
  const [activeSurahId, setActiveSurahId] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedTafseer, setExpandedTafseer] = useState({});

  // Data fetching
  const { surahData, loading, loadingStage, error } = useSurahData(activeSurahId);

  // Audio player
  const audioPlayer = useAudioPlayer(surahData);

  // Persist favorites
  const [favorites, setFavorites] = useLocalStorage('tafseer-favorites', []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTogglePlay: audioPlayer.togglePlay,
    onPrevious: audioPlayer.skipToPrevVerse,
    onNext: audioPlayer.skipToNextVerse,
    onMute: audioPlayer.toggleMute,
    onToggleFavorite: () => {
      if (surahData?.verses?.[audioPlayer.currentVerseIndex]) {
        const verseId = surahData.verses[audioPlayer.currentVerseIndex].id;
        toggleFavorite(verseId);
      }
    },
    onEscape: () => {
      setShowSettings(false);
      setSidebarOpen(false);
    }
  });

  // Handlers
  const toggleFavorite = (verseId) => {
    setFavorites(prev => 
      prev.includes(verseId) 
        ? prev.filter(id => id !== verseId) 
        : [...prev, verseId]
    );
  };

  const handleSurahSelect = (surahId) => {
    setActiveSurahId(surahId);
    audioPlayer.stopPlayback();
    audioPlayer.setCurrentVerseIndex(0);
  };

  const handleModeChange = (mode) => {
    audioPlayer.setPlaybackMode(mode);
  };

  // Render podcast mode view
  const renderPodcastView = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8">
      <div className="w-36 h-36 rounded-full bg-gradient-to-br from-cyan-main/20 to-blue-600/20 flex items-center justify-center animate-pulse border border-cyan-main/20">
        <Radio className="w-16 h-16 text-cyan-main" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Deep Dive Podcast</h3>
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
          Listen to a complete AI-generated breakdown of <span className="text-cyan-main font-medium">{surahData?.name}</span>.  
          Includes themes, historical context, and practical lessons.
        </p>
      </div>
      {!surahData?.podcastUrl && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          <p className="text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            No podcast audio available for Surah {activeSurahId} yet.
          </p>
        </div>
      )}
    </div>
  );

  // Render interactive mode view
  const renderInteractiveView = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-48">
      {surahData?.verses.map((verse, index) => {
        const isExpanded = expandedTafseer[verse.id];
        const isSummary = audioPlayer.tafseerMode === 'summary';
        const displayedTafseer = isSummary && audioPlayer.generatedSummaries[verse.id] 
          ? audioPlayer.generatedSummaries[verse.id] 
          : verse.tafseer;

        return (
          <VerseCard
            key={verse.id}
            verse={verse}
            index={index}
            isActive={audioPlayer.currentVerseIndex === index}
            isExpanded={isExpanded}
            isFavorite={favorites.includes(verse.id)}
            isSummary={isSummary && audioPlayer.generatedSummaries[verse.id]}
            displayedTafseer={displayedTafseer}
            onPlay={audioPlayer.playSpecificVerse}
            onToggleFavorite={toggleFavorite}
            onToggleExpanded={(id) => setExpandedTafseer(prev => ({ ...prev, [id]: !prev[id] }))}
            onGenerateSummary={async (idx) => {
              // This will be handled by the audio player hook internally
              audioPlayer.setTafseerMode('summary');
            }}
          />
        );
      })}
    </div>
  );

  // Main render
  return (
    <div className="h-screen w-full relative overflow-hidden text-slate-200 font-sans selection:bg-cyan-main selection:text-charcoal-900 bg-charcoal-800 flex">
      <BackgroundPattern />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSurahId={activeSurahId}
        onSurahSelect={handleSurahSelect}
      />
      
      <div className="relative z-10 h-full flex-1 lg:ml-64 flex flex-col transition-all duration-300">
        {loading ? (
          <LoadingSpinner loadingStage={loadingStage} surahId={activeSurahId} />
        ) : error ? (
          <ErrorView error={error} onRetry={() => handleSurahSelect(activeSurahId)} />
        ) : (
          <>
            {/* Player Header - Simplified version inline since it's small */}
            <div className="px-6 py-4 bg-charcoal-900/50 backdrop-blur-md sticky top-0 z-20 flex flex-col gap-4 border-b border-glass-border">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white transition-colors min-w-[44px] min-h-[44px]">
                    <Menu className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-lg font-display font-bold text-white truncate max-w-[200px]">
                      {surahData?.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {surahData?.englishName} • {surahData?.versesCount} verses
                    </p>
                  </div>
                </div>
                
                {/* Settings and Mode indicators */}
                <div className="flex gap-2 items-center">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-full transition-colors min-w-[44px] min-h-[44px] ${showSettings ? 'bg-cyan-main text-charcoal-900' : 'bg-glass-surface text-slate-400 hover:text-white'}`}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  {audioPlayer.playbackMode === 'interactive' && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold border ${audioPlayer.usingAI ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {audioPlayer.usingAI ? <Sparkles className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      {audioPlayer.usingAI ? 'AI Voice' : 'Browser'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mode and Voice Controls */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                <div className="flex flex-col items-center gap-1 min-w-fit">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Mode</span>
                  <button 
                    onClick={() => handleModeChange(audioPlayer.playbackMode === 'interactive' ? 'podcast' : 'interactive')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 whitespace-nowrap ${audioPlayer.playbackMode === 'podcast' ? 'bg-cyan-main/10 border-cyan-main text-cyan-main' : 'bg-glass-surface border-glass-border text-slate-400 hover:border-slate-500'}`}
                  >
                    {audioPlayer.playbackMode === 'podcast' ? <Radio className="w-3 h-3" /> : <Headphones className="w-3 h-3" />}
                    {audioPlayer.playbackMode === 'podcast' ? 'Deep Dive' : 'Interactive'}
                  </button>
                </div>

                {audioPlayer.playbackMode === 'interactive' && (
                  <>
                    <div className="flex flex-col items-center gap-1 min-w-fit">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">Voice</span>
                      <button 
                        onClick={() => audioPlayer.setVoiceGender(audioPlayer.voiceGender === 'male' ? 'female' : 'male')} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-surface border border-glass-border text-xs font-medium text-cyan-main whitespace-nowrap hover:border-cyan-main/50 transition-colors"
                      >
                        {audioPlayer.voiceGender === 'male' ? <User className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                        {audioPlayer.voiceGender === 'male' ? 'Male' : 'Female'}
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1 min-w-fit">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">Tafseer</span>
                      <div className="relative">
                        <select 
                          value={audioPlayer.tafseerMode}
                          onChange={(e) => audioPlayer.setTafseerMode(e.target.value)}
                          className="appearance-none pl-3 pr-8 py-1.5 rounded-full bg-glass-surface border border-glass-border text-xs font-medium text-amber-400 focus:outline-none focus:border-amber-400/50 cursor-pointer"
                        >
                          <option value="full">Full</option>
                          <option value="summary">Summary</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-amber-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            {audioPlayer.playbackMode === 'podcast' ? renderPodcastView() : renderInteractiveView()}
            
            {/* Floating Controls */}
            <FloatingControls
              isPlaying={audioPlayer.isPlaying}
              playbackMode={audioPlayer.playbackMode}
              currentVerseIndex={audioPlayer.currentVerseIndex}
              totalVerses={surahData?.verses?.length || 0}
              surahName={surahData?.name || ''}
              volume={audioPlayer.volume}
              onTogglePlay={audioPlayer.togglePlay}
              onStop={audioPlayer.stopPlayback}
              onPrevious={audioPlayer.skipToPrevVerse}
              onNext={audioPlayer.skipToNextVerse}
              onVolumeChange={audioPlayer.handleVolumeChange}
              onToggleMute={audioPlayer.toggleMute}
            />
          </>
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <audio ref={audioPlayer.audioRef} hidden />
    </div>
  );
}
