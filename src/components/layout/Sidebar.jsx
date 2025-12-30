import React, { useState } from 'react';
import { BookOpen, X, Search, ChevronRight } from 'lucide-react';
import { JUZ_30_SURAHS } from '../../constants/surahs.js';

const Sidebar = ({ isOpen, onClose, activeSurahId, onSurahSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter surahs based on search query
  const filteredSurahs = JUZ_30_SURAHS.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.id.toString().includes(searchQuery)
  );

  const handleSurahClick = (surahId) => {
    onSurahSelect(surahId);
    onClose();
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-charcoal-900 border-r border-glass-border transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      role="navigation"
      aria-label="Surah navigation"
    >
      <div className="p-6 border-b border-glass-border flex justify-between items-center">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-main" aria-hidden="true" /> 
          Tafseer OnTheGo
        </h2>
        <button 
          onClick={onClose} 
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 border-b border-glass-border">
        <div className="bg-charcoal-800 rounded-lg p-2 flex items-center gap-2 border border-glass-border focus-within:border-cyan-main/50 transition-colors">
          <Search className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Search Surah..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white focus:outline-none w-full placeholder:text-slate-600" 
            aria-label="Search for Surah by name or number"
          />
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-140px)]">
        {/* Surah 1: Al-Fatiha */}
        <button 
          onClick={() => handleSurahClick(1)}
          className={`w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-glass-border ${activeSurahId === 1 ? 'bg-cyan-main/10 border-l-4 border-l-cyan-main' : ''}`}
          aria-current={activeSurahId === 1 ? 'page' : undefined}
        >
          <div className="font-bold text-white">1. Al-Fatiha</div>
          <div className="text-xs text-slate-500">The Opener</div>
        </button>

        {/* Juz 30 List */}
        <div className="px-4 py-2 text-xs font-bold text-cyan-main uppercase tracking-wider mt-4">
          Juz 30 (Amma)
        </div>
        
        {filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <button 
              key={surah.id}
              onClick={() => handleSurahClick(surah.id)}
              className={`w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-glass-border ${activeSurahId === surah.id ? 'bg-cyan-main/10 border-l-4 border-l-cyan-main' : ''}`}
              aria-current={activeSurahId === surah.id ? 'page' : undefined}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">{surah.id}. {surah.name}</div>
                  <div className="text-xs text-slate-500">{surah.english}</div>
                </div>
                {activeSurahId === surah.id && (
                  <ChevronRight className="w-4 h-4 text-cyan-main" aria-hidden="true" />
                )}
              </div>
            </button>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            No surahs found matching "{searchQuery}"
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
