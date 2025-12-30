import React from 'react';
import { Home, BookOpen, User } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-charcoal-900/90 backdrop-blur-xl border-t border-glass-border px-6 py-4 z-50 flex justify-around items-center text-xs font-medium safe-area-bottom lg:hidden">
    <button 
      onClick={() => setActiveTab('home')} 
      className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-cyan-main' : 'text-slate-500'}`}
      aria-label="Home"
    >
      <Home className="w-6 h-6" />
      <span>Home</span>
    </button>
    <button 
      onClick={() => setActiveTab('player')} 
      className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'player' ? 'text-cyan-main' : 'text-slate-500'}`}
      aria-label="Quran Player"
    >
      <BookOpen className="w-6 h-6" />
      <span>Quran</span>
    </button>
    <button 
      onClick={() => setActiveTab('profile')} 
      className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-cyan-main' : 'text-slate-500'}`}
      aria-label="Profile"
    >
      <User className="w-6 h-6" />
      <span>Profile</span>
    </button>
  </div>
);

export default BottomNav;
