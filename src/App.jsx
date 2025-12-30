import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, BookOpen, Volume2,
  Settings, ChevronRight, PenTool, Home, Loader2, AlertCircle,
  User, UserCheck, Sparkles, Bot, Trophy, Heart, Folder,
  CheckCircle2, Flame, BrainCircuit, X, Share2, Award,
  FileText, AlignLeft, Layers, ChevronDown, ChevronUp, PlayCircle,
  Mic2, Headphones, Radio, Menu, Search, ToggleLeft, ToggleRight,
  Lock
} from 'lucide-react';
import './styles/App.css';

// --- CONFIGURATION ---
const API_KEY = "YOUR_OPENAI_KEY_HERE"; // 🔴 PASTE SK-KEY HERE

// --- PODCAST LINKS ---
const SURAH_PODCASTS = {
  // Surah 108:  Al-Kawthar
  108: "https://anchor.fm/s/10cdf39c0/podcast/play/112697600/https%3A%2F%2Fd3ctxlq1ktw2nl. cloudfront.net%2Fstaging%2F2025-11-16%2Fa782f8d4-732a-bb57-9900-5b8d152816be. m4a",
  
  // Placeholder for Al-Fatiha
  1: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
};

// --- DATA:  JUZ 30 SURAHS ---
const JUZ_30_SURAHS = [
  { id: 78, name: "An-Naba", english: "The Tidings" },
  { id: 79, name: "An-Nazi'at", english: "The Snatchers" },
  { id: 80, name: "Abasa", english: "He Frowned" },
  { id: 81, name: "At-Takwir", english:  "The Overthrowing" },
  { id: 82, name: "Al-Infitar", english: "The Cleaving" },
  { id: 83, name: "Al-Mutaffifin", english: "Defrauding" },
  { id: 84, name: "Al-Inshiqaq", english: "The Sundering" },
  { id: 85, name: "Al-Buruj", english: "The Mansions of the Stars" },
  { id: 86, name: "At-Tariq", english: "The Morning Star" },
  { id: 87, name: "Al-A'la", english: "The Most High" },
  { id: 88, name: "Al-Ghashiyah", english: "The Overwhelming" },
  { id: 89, name: "Al-Fajr", english: "The Dawn" },
  { id: 90, name: "Al-Balad", english: "The City" },
  { id: 91, name: "Ash-Shams", english: "The Sun" },
  { id: 92, name: "Al-Lail", english: "The Night" },
  { id: 93, name: "Ad-Duha", english: "The Morning Hours" },
  { id: 94, name: "Ash-Sharh", english: "The Relief" },
  { id: 95, name: "At-Tin", english: "The Fig" },
  { id: 96, name: "Al-Alaq", english: "The Clot" },
  { id: 97, name: "Al-Qadr", english: "The Power" },
  { id: 98, name: "Al-Bayyinah", english: "The Clear Proof" },
  { id: 99, name: "Az-Zalzalah", english: "The Earthquake" },
  { id: 100, name: "Al-Adiyat", english: "The Courser" },
  { id: 101, name: "Al-Qari'ah", english: "The Calamity" },
  { id: 102, name: "At-Takathur", english: "The Rivalry in World Increase" },
  { id: 103, name: "Al-Asr", english: "The Declining Day" },
  { id: 104, name: "Al-Humazah", english:  "The Traducer" },
  { id: 105, name: "Al-Fil", english: "The Elephant" },
  { id: 106, name: "Quraish", english: "Quraish" },
  { id: 107, name: "Al-Ma'un", english: "The Small Kindnesses" },
  { id: 108, name: "Al-Kawthar", english: "The Abundance" },
  { id: 109, name: "Al-Kafirun", english: "The Disbelievers" },
  { id:  110, name:  "An-Nasr", english: "The Succour" },
  { id: 111, name: "Al-Masad", english: "The Palm Fibre" },
  { id: 112, name: "Al-Ikhlas", english:  "The Sincerity" },
  { id: 113, name: "Al-Falaq", english: "The Daybreak" },
  { id: 114, name: "An-Nas", english: "Mankind" },
];

const THEMES = [
  { id:  'anxiety', label: 'Anxiety & Fear', icon: '🌧️', color: 'from-blue-900 to-slate-900' },
  { id: 'gratitude', label: 'Gratitude (Shukr)', icon: '✨', color: 'from-amber-900 to-slate-900' },
  { id: 'patience', label: 'Patience (Sabr)', icon: '🛡️', color:  'from-emerald-900 to-slate-900' },
];

// --- TAFSEER FORMATTING UTILITIES ---

/**
 * Formats raw HTML tafseer text into beautiful, readable content
 * with proper spacing, styled paragraphs, and visual hierarchy. 
 */
const formatTafseerHTML = (rawHTML) => {
  if (!rawHTML) return '<p class="text-slate-400 italic">Tafseer unavailable for this verse. </p>';
  
  let formatted = rawHTML;
  
  // Step 1: Clean up excessive whitespace and normalize line breaks
  formatted = formatted.replace(/\s+/g, ' ').trim();
  
  // Step 2: Convert <p> tags to styled paragraphs with proper spacing
  formatted = formatted.replace(
    /<p>/gi, 
    '<p class="text-slate-300 leading-relaxed mb-4 text-sm md:text-base">'
  );
  
  // Step 3: Style headings if present
  formatted = formatted.replace(
    /<h(\d)>/gi, 
    '<h$1 class="text-cyan-400 font-bold mt-6 mb-3 text-base md:text-lg">'
  );
  
  // Step 4: Convert plain numbered lists (1. 2. 3.) to styled bullet points
  // Match patterns like "1." or "(1)" at the start of sentences
  formatted = formatted.replace(
    /(\d+)\.\s+/g, 
    '</p><div class="flex items-start gap-3 mb-3 pl-2"><span class="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-main/20 text-cyan-main text-xs flex items-center justify-center font-bold">$1</span><p class="text-slate-300 leading-relaxed flex-1">'
  );
  
  // Step 5: Handle bullet points that use • or -
  formatted = formatted.replace(
    /[•\-]\s+/g,
    '</p><div class="flex items-start gap-3 mb-3 pl-2"><span class="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-main mt-2"></span><p class="text-slate-300 leading-relaxed flex-1">'
  );
  
  // Step 6: Add visual breaks for long passages (after every ~3 paragraphs)
  let paragraphCount = 0;
  formatted = formatted.replace(/<\/p>/gi, () => {
    paragraphCount++;
    if (paragraphCount % 3 === 0) {
      return '</p><div class="my-6 border-t border-glass-border/30"></div>';
    }
    return '</p>';
  });
  
  // Step 7: Style any inline quotes with italic and distinct color
  formatted = formatted.replace(
    /"([^"]+)"/g, 
    '<span class="italic text-amber-300/90">"$1"</span>'
  );
  
  // Step 8: Style Arabic text if enclosed in specific markers
  formatted = formatted.replace(
    /\{([^}]+)\}/g,
    '<span class="font-quran text-lg text-white bg-charcoal-900/50 px-2 py-1 rounded inline-block my-1">$1</span>'
  );
  
  // Step 9: Wrap the entire content if it doesn't start with a paragraph
  if (!formatted.startsWith('<p') && !formatted.startsWith('<h') && !formatted.startsWith('<div')) {
    formatted = `<p class="text-slate-300 leading-relaxed mb-4 text-sm md:text-base">${formatted}</p>`;
  }
  
  return formatted;
};

/**
 * Cleans tafseer text for TTS reading - removes references, 
 * formats for natural speech pauses, and sanitizes special characters.
 */
const formatTafseerForTTS = (rawText) => {
  if (!rawText) return "";
  
  let cleaned = rawText;
  
  // Step 1: Strip all HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Step 2: Remove reference numbers like [1], (2), {3}, etc. 
  cleaned = cleaned.replace(/\[\d+\]/g, '');
  cleaned = cleaned.replace(/\(\d+\)/g, '');
  cleaned = cleaned.replace(/\{\d+\}/g, '');
  
  // Step 3: Remove footnote markers and superscripts
  cleaned = cleaned.replace(/[\u00B2\u00B3\u00B9\u2070-\u209F]/g, '');
  
  // Step 4: Remove verse reference patterns like "1: 1" or "Surah 2:255"
  cleaned = cleaned.replace(/\b\d+:\d+\b/g, '');
  
  // Step 5: Normalize quotes for better TTS pronunciation
  cleaned = cleaned.replace(/[""]/g, '"');
  cleaned = cleaned.replace(/['']/g, "'");
  
  // Step 6: Add pauses after colons (for natural reading)
  cleaned = cleaned.replace(/:\s*/g, '.  ');
  
  // Step 7:  Ensure sentences end with proper punctuation
  cleaned = cleaned.replace(/([a-zA-Z])\s+([A-Z])/g, '$1. $2');
  
  // Step 8: Remove excessive punctuation
  cleaned = cleaned.replace(/\. {2,}/g, '.');
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  // Step 9: Remove any remaining special characters that confuse TTS
  cleaned = cleaned.replace(/[^\w\s.,? !;:'"()-]/g, '');
  
  // Step 10: Ensure proper spacing around punctuation
  cleaned = cleaned.replace(/\s+\./g, '.');
  cleaned = cleaned.replace(/\s+,/g, ',');
  cleaned = cleaned.replace(/\s+!/g, '!');
  cleaned = cleaned.replace(/\s+\?/, '?');
  
  return cleaned. trim();
};

/**
 * Generates a concise summary from tafseer text (first 2-3 key sentences)
 */
const generateTafseerSummary = (plainText) => {
  if (!plainText) return "Summary unavailable. ";
  
  const cleaned = formatTafseerForTTS(plainText);
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  
  // Take first 2-3 sentences, but ensure we have meaningful content
  const summarysentences = sentences.slice(0, 3).filter(s => s. trim().length > 20);
  
  if (summarysentences.length === 0) {
    return sentences.slice(0, 2).join(' ').trim();
  }
  
  return summarysentences. join(' ').trim();
};

// --- COMPONENTS ---

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

const TabBar = ({ activeTab, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-charcoal-900/90 backdrop-blur-xl border-t border-glass-border px-6 py-4 z-50 flex justify-around items-center text-xs font-medium safe-area-bottom lg:hidden">
    <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-cyan-main' : 'text-slate-500'}`}>
      <Home className="w-6 h-6" />
      <span>Home</span>
    </button>
    <button onClick={() => setActiveTab('player')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'player' ? 'text-cyan-main' : 'text-slate-500'}`}>
      <BookOpen className="w-6 h-6" />
      <span>Quran</span>
    </button>
    <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-cyan-main' : 'text-slate-500'}`}>
      <User className="w-6 h-6" />
      <span>Profile</span>
    </button>
  </div>
);

/**
 * Styled Tafseer Display Component
 * Renders formatted tafseer with beautiful typography and spacing
 */
const TafseerDisplay = ({ tafseerHTML, isSummary, onGenerateSummary }) => {
  return (
    <div className="tafseer-content">
      <div 
        className="prose prose-invert prose-sm md:prose-base max-w-none"
        dangerouslySetInnerHTML={{ __html: formatTafseerHTML(tafseerHTML) }} 
      />
      {! isSummary && (
        <button 
          onClick={onGenerateSummary}
          className="mt-6 text-xs bg-gradient-to-r from-cyan-main/10 to-blue-500/10 text-cyan-main px-4 py-2.5 rounded-lg hover:from-cyan-main/20 hover:to-blue-500/20 flex items-center gap-2 w-full justify-center border border-cyan-main/20 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4" /> 
          <span>Generate Concise Summary</span>
        </button>
      )}
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSurahId, setActiveSurahId] = useState(1); // Default to Fatiha
  const [activeSurahData, setActiveSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState(''); // For granular loading feedback
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [voiceGender, setVoiceGender] = useState('male'); 
  const [playbackMode, setPlaybackMode] = useState('interactive'); 
  const [usingAI, setUsingAI] = useState(false);
  const [tafseerMode, setTafseerMode] = useState('full');
  
  // Playback Toggle Options
  const [playbackOptions, setPlaybackOptions] = useState({
    recitation: true,
    translation: true,
    tafseer: true
  });
  const [showSettings, setShowSettings] = useState(false);

  const [generatedSummaries, setGeneratedSummaries] = useState({});
  const [expandedTafseer, setExpandedTafseer] = useState({});

  const audioRef = useRef(new Audio()); 
  const synth = useRef(window.speechSynthesis);
  const playbackQueue = useRef({ step: 0, verseIndex: 0, active: false });

  const [favorites, setFavorites] = useState([]);
  const [userStats, setUserStats] = useState({ streak: 4, surahsCompleted: 1, reflectionsCount: 3, xp: 1250 });
  const [translationEdition, setTranslationEdition] = useState('en. clearquran'); // Default to Mustafa Khattab - The Clear Quran

  // --- 1. DATA FETCHING (DUAL-FETCH STRATEGY) ---
  useEffect(() => {
    const fetchSurahData = async () => {
      if (!activeSurahId) return;
      
      setLoading(true);
      setError(null);
      setLoadingStage('Initializing...');
      
      // Stop any playing audio when switching surah
      playbackQueue.current. active = false;
      audioRef.current.pause();
      synth.current.cancel();
      setIsPlaying(false);
      setCurrentVerseIndex(0);

      try {
        // ============================================
        // UPDATED: Use AlQuran.cloud for Surah info and audio, Quran.com (with proxy) for translations and tafseer
        // ============================================
        
        setLoadingStage('Fetching Surah info...');
        
        // Fetch Surah metadata and verses from AlQuran.cloud
        const surahRes = await fetch(`https://api.alquran.cloud/v1/surah/${activeSurahId}`);
        if (!surahRes.ok) throw new Error(`Failed to fetch Surah (${surahRes.status})`);
        const surahData = await surahRes.json();
        const surahInfo = surahData.data;
        console.log('Surah data:', surahInfo); // Debug log

        setLoadingStage('Loading translations...');
        
        // Fetch translations from Quran.com with CORS proxy
        const clearQuranUrl = `https://api.quran.com/api/v4/quran/translations/131?chapter_number=${activeSurahId}`;
        const saheehUrl = `https://api.quran.com/api/v4/quran/translations/20?chapter_number=${activeSurahId}`;
        
        const [clearQuranRes, saheehRes] = await Promise.all([
          fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(clearQuranUrl)}`),
          fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(saheehUrl)}`)
        ]);

        let clearQuranTranslations = [];
        let saheehTranslations = [];

        if (clearQuranRes.ok) {
          const proxyData = await clearQuranRes.json();
          const data = JSON.parse(proxyData.contents);
          clearQuranTranslations = data.translations || [];
          console.log('Clear Quran translations:', clearQuranTranslations); // Debug log
        } else {
          console.warn('Clear Quran fetch failed');
        }

        if (saheehRes.ok) {
          const proxyData = await saheehRes.json();
          const data = JSON.parse(proxyData.contents);
          saheehTranslations = data.translations || [];
          console.log('Saheeh translations:', saheehTranslations); // Debug log
        } else {
          console.warn('Saheeh International fetch failed');
        }

        setLoadingStage('Loading Tafseer Ibn Kathir...');
        
        // Fetch Tafseer from Quran.com with CORS proxy
        const tafseerUrl = `https://api.quran.com/api/v4/tafsirs/169/by_chapter/${activeSurahId}?per_page=300`;
        const tafseerRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(tafseerUrl)}`);
        
        let tafsirsData = { tafsirs: [] };
        if (tafseerRes.ok) {
          const proxyData = await tafseerRes.json();
          tafsirsData = JSON.parse(proxyData.contents);
          console.log('Tafseer data:', tafsirsData); // Debug log
        } else {
          console.warn('Tafseer fetch failed');
        }

        setLoadingStage('Merging data...');

        // ============================================
        // MERGE LOGIC: Map by verse_key for Quran.com, by numberInSurah for AlQuran
        // ============================================
        
        // Maps for Quran.com data
        const clearQuranMap = new Map();
        clearQuranTranslations.forEach(t => {
          clearQuranMap.set(t.verse_key, t.text);
        });

        const saheehMap = new Map();
        saheehTranslations.forEach(t => {
          saheehMap.set(t.verse_key, t.text);
        });

        const tafseerMap = new Map();
        tafsirsData.tafsirs.forEach(t => {
          tafseerMap.set(t.verse_key, t.text);
        });

        // Merge all data together
        const mergedVerses = surahInfo.ayahs.map((verse) => {
          const verseKey = `${activeSurahId}:${verse.numberInSurah}`;
          
          // Get translation: Prioritize Clear Quran, fallback to Saheeh
          let translationText = clearQuranMap.get(verseKey);
          if (!translationText || translationText.trim() === '') {
            translationText = saheehMap.get(verseKey);
          }
          if (!translationText || translationText.trim() === '') {
            translationText = "Translation unavailable";
          }

          // Clean translation text (remove footnote markers)
          translationText = translationText
            .replace(/<sup[^>]*>.*?<\/sup>/gi, '') // Remove superscript footnotes
            .replace(/\[\d+\]/g, '') // Remove [1] style references
            .replace(/\(\d+\)/g, '') // Remove (1) references
            .replace(/\{\d+\}/g, '') // Remove {1} references
            .replace(/\b\d+:\d+\b/g, '') // Remove verse references like 2:255
            .replace(/[^\w\s.,? !: ;'"-]/gi, '') // Keep only safe characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();

          // Get Tafseer
          const tafseerText = tafseerMap.get(verseKey) || "Tafseer unavailable for this verse.";
          
          // Generate clean text for TTS
          const plainTafseer = formatTafseerForTTS(tafseerText);
          
          // Build audio URL from AlQuran.cloud
          const audioUrl = verse.audio || null;

          return {
            id: verseKey,
            verseNumber: verse.numberInSurah,
            text: verse.text,
            translation: translationText,
            tafseer: tafseerText, // Raw HTML for display
            plainTafseer: plainTafseer, // Clean text for TTS
            formattedTafseer: formatTafseerHTML(tafseerText), // Pre-formatted HTML
            audioUrl: audioUrl,
            isFavorite: false
          };
        });

        // Add podcast URL if available
        const podcastUrl = SURAH_PODCASTS[activeSurahId] || null;

        setActiveSurahData({ 
          id: activeSurahId, 
          name: surahInfo.name, 
          arabicName: surahInfo.name,
          englishName: surahInfo.englishName,
          versesCount: surahInfo.numberOfAyahs,
          revelationType: surahInfo.revelationType,
          verses: mergedVerses,
          podcastUrl: podcastUrl 
        });

        setLoadingStage('Complete! ');

      } catch (err) {
        console. error("Fetch Error:", err);
        setError(`Failed to load Quran data:  ${err.message}.  Please check your connection and try again.`);
      } finally {
        setLoading(false);
        setLoadingStage('');
      }
    };

    fetchSurahData();
  }, [activeSurahId]);

  // --- 2. HELPERS ---
  const cleanTextForTTS = (text) => {
    if (!text) return "";
    return text
      .replace(/<[^>]*>? /gm, '') // Remove HTML tags
      . replace(/\[\d+\]/g, '') // Remove [1] references
      .replace(/\(\d+\)/g, '') // Remove (1) references
      .replace(/\{\d+\}/g, '') // Remove {1} references
      .replace(/\b\d+:\d+\b/g, '') // Remove verse references like 2:255
      .replace(/[^\w\s.,? !: ;'"-]/gi, '') // Keep only safe characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  const generateSummary = async (verseIndex) => {
    const verse = activeSurahData. verses[verseIndex];
    if (generatedSummaries[verse.id]) return generatedSummaries[verse.id];
    
    const summary = generateTafseerSummary(verse.tafseer);
    setGeneratedSummaries(prev => ({ ... prev, [verse. id]: summary }));
    return summary;
  };

  // --- 3. AUDIO ENGINE ---
  const playAudioFile = (url) => {
    return new Promise((resolve) => {
      if (!url) {
        alert("Audio URL is missing or invalid.");
        resolve();
        return;
      }

      audioRef.current.src = url;
      audioRef.current.onended = resolve;
      audioRef.current.onerror = () => {
        console.error("Audio file failed to load:", url);
        alert("Failed to load the audio file. Please check your internet connection or try again later.");
        resolve();
      };

      audioRef.current
        .play()
        .then(() => {
          console.log("Audio playback started successfully.");
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
          alert("Audio playback failed. Please ensure your browser allows autoplay.");
          resolve();
        });
    });
  };

  const playTTS = async (text, forcedGender = null) => {
    const cleanText = cleanTextForTTS(text);
    if (! cleanText || cleanText.length < 5) return;
    
    // Split into sentences for natural pauses
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

    const speakSentence = (sentence) => {
      return new Promise((resolve) => {
        const trimmedSentence = sentence.trim();
        if (! trimmedSentence || trimmedSentence.length < 3) {
          resolve();
          return;
        }

        let currentGender = forcedGender || voiceGender;

        if (! API_KEY || API_KEY === "YOUR_OPENAI_KEY_HERE") {
          // Use browser's Web Speech API
          setUsingAI(false);
          synth.current.cancel();
          
          const voices = synth.current.getVoices();
          const keywords = currentGender === 'male' 
            ? ['Male', 'Guy', 'David', 'Daniel', 'James'] 
            : ['Female', 'Aria', 'Zira', 'Samantha', 'Karen'];
          
          let bestVoice = voices.find(v => 
            v.lang. includes('en') && 
            v.name.includes('Natural') && 
            keywords.some(k => v.name.includes(k))
          );
          if (!bestVoice) {
            bestVoice = voices. find(v => v.lang.includes('en-US'));
          }
          if (!bestVoice) {
            bestVoice = voices. find(v => v.lang.includes('en'));
          }

          const utterance = new SpeechSynthesisUtterance(trimmedSentence);
          if (bestVoice) utterance.voice = bestVoice;
          utterance.rate = 0.85; // Slightly slower for better comprehension
          utterance.pitch = currentGender === 'male' ? 0.9 : 1.1;
          utterance.onend = resolve;
          utterance.onerror = () => resolve();
          synth.current.speak(utterance);
        } else {
          // Use OpenAI TTS
          const modelVoice = currentGender === 'male' ?  'onyx' : 'shimmer';
          fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: { 
              "Authorization": `Bearer ${API_KEY}`, 
              "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
              model:  "tts-1", 
              input:  trimmedSentence, 
              voice: modelVoice,
              speed: 0.9 // Slightly slower for clarity
            }),
          })
          .then(res => {
            if (!res.ok) throw new Error('OpenAI TTS failed');
            return res.blob();
          })
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.onended = () => {
              URL.revokeObjectURL(url);
              resolve();
            };
            audio.onerror = () => {
              URL.revokeObjectURL(url);
              resolve();
            };
            audio.play().catch(() => resolve());
            setUsingAI(true);
          })
          .catch(() => {
            console.warn('OpenAI TTS failed, falling back to browser TTS');
            setUsingAI(false);
            resolve();
          });
        }
      });
    };

    // Play each sentence with pauses between them
    for (let i = 0; i < sentences.length; i++) {
      if (! playbackQueue.current.active) break;
      await speakSentence(sentences[i]);
      // Add natural pause between sentences (longer for clarity)
      if (i < sentences. length - 1 && playbackQueue.current. active) {
        await new Promise(r => setTimeout(r, 500));
      }
    }
  };

  const playVerseSequence = async (index) => {
    if (! activeSurahData || index >= activeSurahData.verses.length) {
      setIsPlaying(false);
      playbackQueue.current. active = false;
      return;
    }

    setIsPlaying(true);
    setCurrentVerseIndex(index);
    playbackQueue.current = { step: 0, verseIndex: index, active:  true };

    const verse = activeSurahData.verses[index];

    // 1. Arabic Recitation (If enabled)
    if (playbackOptions.recitation && playbackQueue.current.active) {
      await playAudioFile(verse.audioUrl);
    }
    
    // 2. Translation (If enabled)
    if (playbackOptions.translation && playbackQueue.current. active) {
      await new Promise(r => setTimeout(r, 700)); // Pause before translation
      await playTTS(verse.translation, voiceGender);
    }

    // 3. Tafseer (If enabled)
    if (playbackOptions.tafseer && playbackQueue.current.active) {
      await new Promise(r => setTimeout(r, 900)); // Longer pause before tafseer
      
      let tafseerText = verse.plainTafseer;
      if (tafseerMode === 'summary') {
        tafseerText = await generateSummary(index);
      } else {
        // Limit full tafseer to prevent extremely long readings
        tafseerText = tafseerText.length > 1000 
          ? tafseerText.substring(0, 1000) + ".  That concludes the key points of this tafseer." 
          : tafseerText;
      }
      await playTTS(tafseerText);
    }

    // Continue to next verse if still active
    if (playbackQueue.current.active) {
      await new Promise(r => setTimeout(r, 1000)); // Pause between verses
      playVerseSequence(index + 1);
    }
  };

  const playPodcast = async () => {
    if (!activeSurahData?. podcastUrl) {
      alert("No podcast link found for this Surah.  Try Interactive mode instead.");
      setPlaybackMode('interactive');
      return;
    }
    
    setIsPlaying(true);
    playbackQueue.current. active = true;
    audioRef.current.src = activeSurahData.podcastUrl;
    audioRef.current.onended = () => {
      setIsPlaying(false);
      playbackQueue. current.active = false;
    };
    audioRef.current.onerror = () => {
      setIsPlaying(false);
      playbackQueue.current. active = false;
      alert("Failed to load podcast audio.");
    };
    audioRef.current. play().catch(err => {
      console.error('Podcast playback error:', err);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      playbackQueue.current. active = false;
      audioRef.current.pause();
      synth.current.cancel();
      setIsPlaying(false);
    } else {
      if (playbackMode === 'podcast') {
        playPodcast();
      } else {
        playVerseSequence(currentVerseIndex);
      }
    }
  };

  // Add stop function
  const stopPlayback = () => {
    playbackQueue.current.active = false;
    audioRef.current.pause();
    synth.current.cancel();
    setIsPlaying(false);
  };

  const playSpecificVerse = (index) => {
    playbackQueue.current.active = false;
    audioRef.current.pause();
    synth.current.cancel();
    setTimeout(() => playVerseSequence(index), 100);
  };

  const skipToNextVerse = () => {
    if (playbackMode === 'interactive' && activeSurahData) {
      const nextIndex = Math.min(activeSurahData. verses.length - 1, currentVerseIndex + 1);
      playbackQueue.current.active = false;
      audioRef.current. pause();
      synth.current.cancel();
      setTimeout(() => playVerseSequence(nextIndex), 100);
    }
  };

  const skipToPrevVerse = () => {
    if (playbackMode === 'interactive' && activeSurahData) {
      const prevIndex = Math.max(0, currentVerseIndex - 1);
      playbackQueue.current.active = false;
      audioRef.current. pause();
      synth.current.cancel();
      setTimeout(() => playVerseSequence(prevIndex), 100);
    }
  };

  const togglePlaybackOption = (key) => {
    setPlaybackOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- VIEWS ---

  const Sidebar = () => (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-charcoal-900 border-r border-glass-border transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="p-6 border-b border-glass-border flex justify-between items-center">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-main" /> Tafseer OnTheGo
        </h2>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover: text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 border-b border-glass-border">
        <div className="bg-charcoal-800 rounded-lg p-2 flex items-center gap-2 border border-glass-border focus-within:border-cyan-main/50 transition-colors">
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search Surah..." 
            className="bg-transparent text-sm text-white focus:outline-none w-full placeholder: text-slate-600" 
          />
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100%-140px)]">
        {/* Helper for Surah 1 */}
        <button 
          onClick={() => { setActiveSurahId(1); setSidebarOpen(false); }}
          className={`w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-glass-border ${activeSurahId === 1 ? 'bg-cyan-main/10 border-l-4 border-l-cyan-main' : ''}`}
        >
          <div className="font-bold text-white">1.  Al-Fatiha</div>
          <div className="text-xs text-slate-500">The Opener</div>
        </button>

        {/* Juz 30 List */}
        <div className="px-4 py-2 text-xs font-bold text-cyan-main uppercase tracking-wider mt-4">Juz 30 (Amma)</div>
        {JUZ_30_SURAHS.map((surah) => (
          <button 
            key={surah.id}
            onClick={() => { setActiveSurahId(surah. id); setSidebarOpen(false); }}
            className={`w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-glass-border ${activeSurahId === surah.id ? 'bg-cyan-main/10 border-l-4 border-l-cyan-main' : ''}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-white">{surah.id}. {surah. name}</div>
                <div className="text-xs text-slate-500">{surah.english}</div>
              </div>
              {activeSurahId === surah.id && <ChevronRight className="w-4 h-4 text-cyan-main" />}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );

  const PlayerView = () => (
    <div className="h-full flex flex-col animate-in slide-in-from-right">
      {/* Header */}
      <div className="px-6 py-4 bg-charcoal-900/50 backdrop-blur-md sticky top-0 z-20 flex flex-col gap-4 border-b border-glass-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover: text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-display font-bold text-white truncate max-w-[200px]">
                {activeSurahData?.name}
              </h2>
              <p className="text-xs text-slate-500">
                {activeSurahData?.englishName} • {activeSurahData?.versesCount} verses
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            {/* Playback Settings Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(! showSettings)}
                className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-cyan-main text-charcoal-900' : 'bg-glass-surface text-slate-400 hover:text-white'}`}
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {showSettings && (
                <div className="absolute top-12 right-0 w-56 bg-charcoal-800 border border-glass-border rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Playback Options
                  </h4>
                  <div className="space-y-3">
                    <button 
                      onClick={() => togglePlaybackOption('recitation')} 
                      className="flex items-center justify-between w-full text-sm text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-cyan-main" />
                        Arabic Recitation
                      </span>
                      {playbackOptions.recitation 
                        ? <ToggleRight className="w-6 h-6 text-cyan-main" /> 
                        : <ToggleLeft className="w-6 h-6 text-slate-600" />
                      }
                    </button>
                    <button 
                      onClick={() => togglePlaybackOption('translation')} 
                      className="flex items-center justify-between w-full text-sm text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-400" />
                        Translation
                      </span>
                      {playbackOptions.translation 
                        ?  <ToggleRight className="w-6 h-6 text-cyan-main" /> 
                        : <ToggleLeft className="w-6 h-6 text-slate-600" />
                      }
                    </button>
                    <button 
                      onClick={() => togglePlaybackOption('tafseer')} 
                      className="flex items-center justify-between w-full text-sm text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        Tafseer Audio
                      </span>
                      {playbackOptions.tafseer 
                        ? <ToggleRight className="w-6 h-6 text-cyan-main" /> 
                        : <ToggleLeft className="w-6 h-6 text-slate-600" />
                      }
                    </button>
                  </div>
                  <div className="mt-4 pt-3 border-t border-glass-border">
                    <p className="text-[10px] text-slate-500 text-center">
                      Toggle what plays during interactive mode
                    </p>
                  </div>
                </div>
              )}
            </div>

            {playbackMode === 'interactive' && (
              <div className={`flex items-center gap-1. 5 px-2. 5 py-1. 5 rounded-full text-[10px] font-bold border ${usingAI ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                {usingAI ? <Sparkles className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                {usingAI ?  'AI Voice' : 'Browser'}
              </div>
            )}
          </div>
        </div>
        
        {/* Control Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          {/* Mode Toggle */}
          <div className="flex flex-col items-center gap-1 min-w-fit">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider">Mode</span>
            <button 
              onClick={() => { 
                setPlaybackMode(m => m === 'interactive' ? 'podcast' : 'interactive'); 
                setIsPlaying(false); 
                audioRef.current.pause(); 
                synth.current.cancel(); 
                playbackQueue.current. active = false;
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 whitespace-nowrap ${playbackMode === 'podcast' ? 'bg-cyan-main/10 border-cyan-main text-cyan-main' : 'bg-glass-surface border-glass-border text-slate-400 hover:border-slate-500'}`}
            >
              {playbackMode === 'podcast' ? <Radio className="w-3 h-3" /> : <Headphones className="w-3 h-3" />}
              {playbackMode === 'podcast' ?  'Deep Dive' : 'Interactive'}
            </button>
          </div>

          {playbackMode === 'interactive' && (
            <>
              {/* Voice Gender */}
              <div className="flex flex-col items-center gap-1 min-w-fit">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider">Voice</span>
                <button 
                  onClick={() => setVoiceGender(v => v === 'male' ? 'female' : 'male')} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-surface border border-glass-border text-xs font-medium text-cyan-main whitespace-nowrap hover:border-cyan-main/50 transition-colors"
                >
                  {voiceGender === 'male' ?  <User className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                  {voiceGender === 'male' ? 'Male' : 'Female'}
                </button>
              </div>
              
              {/* Tafseer Mode */}
              <div className="flex flex-col items-center gap-1 min-w-fit">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider">Tafseer</span>
                <div className="relative">
                  <select 
                    value={tafseerMode}
                    onChange={(e) => setTafseerMode(e.target.value)}
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-48">
        {playbackMode === 'podcast' ?  (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-cyan-main/20 to-blue-600/20 flex items-center justify-center animate-pulse border border-cyan-main/20">
              <Radio className="w-16 h-16 text-cyan-main" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Deep Dive Podcast</h3>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Listen to a complete AI-generated breakdown of <span className="text-cyan-main font-medium">{activeSurahData?.name}</span>.  
                Includes themes, historical context, and practical lessons. 
              </p>
            </div>
            {! activeSurahData?.podcastUrl && (
              <div className="bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                <p className="text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  No podcast audio available for Surah {activeSurahId} yet.
                </p>
              </div>
            )}
          </div>
        ) : (
          activeSurahData?. verses. map((verse, index) => {
            const isExpanded = expandedTafseer[verse.id];
            const isSummary = tafseerMode === 'summary';
            const displayedTafseer = isSummary && generatedSummaries[verse.id] 
              ? generatedSummaries[verse.id] 
              : verse.tafseer;

            return (
              <div 
                key={verse.id} 
                className={`p-6 rounded-2xl border transition-all duration-300 relative ${
                  currentVerseIndex === index 
                    ? 'bg-gradient-to-br from-charcoal-700 to-charcoal-800 border-cyan-main/40 shadow-cyan-glow' 
                    : 'glass-card border-transparent hover:border-glass-border'
                }`}
              >
                {/* Verse Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-charcoal-900 text-cyan-main text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-main/20">
                    {verse.id}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); playSpecificVerse(index); }} 
                      className="text-slate-400 hover: text-cyan-main transition-colors p-1"
                      title="Play this verse"
                    >
                      <PlayCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e. stopPropagation(); 
                        setFavorites(prev => 
                          prev. includes(verse.id) 
                            ? prev.filter(id => id !== verse.id) 
                            :  [...prev, verse. id]
                        ); 
                      }}
                      title="Add to favorites"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${favorites.includes(verse. id) ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-400'}`} />
                    </button>
                  </div>
                </div>
                
                {/* Arabic Text */}
                <p className="text-right font-quran text-2xl md:text-3xl text-white leading-loose mb-6 select-text">
                  {verse.text}
                </p>
                
                {/* Translation */}
                <div className="mb-6 p-4 bg-charcoal-900/30 rounded-xl border border-glass-border/50">
                  <p className="text-xs text-green-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText className="w-3 h-3" />
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
                      e. stopPropagation(); 
                      setExpandedTafseer(prev => ({ ...prev, [verse.id]: !prev[verse.id] })); 
                    }} 
                    className="w-full flex justify-between items-center p-4 text-xs font-bold text-amber-400 uppercase tracking-wider hover: bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {isSummary ? 'Read Summary' : 'Read Tafseer (Ibn Kathir)'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-normal normal-case">
                        {isExpanded ? 'Hide' : 'Expand'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-glass-border animate-in slide-in-from-top-2 duration-300">
                      <div className="mt-4">
                        <TafseerDisplay 
                          tafseerHTML={displayedTafseer}
                          isSummary={isSummary && generatedSummaries[verse.id]}
                          onGenerateSummary={(e) => { 
                            e?. stopPropagation(); 
                            generateSummary(index); 
                            setTafseerMode('summary'); 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Player Controls */}
      <div className="fixed bottom-[80px] left-4 right-4 glass-card rounded-2xl p-4 border-t border-glass-border shadow-2xl flex items-center gap-4 z-40 lg:left-72">
        {/* Previous */}
        <button 
          onClick={skipToPrevVerse}
          disabled={playbackMode === 'podcast'}
          className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        {/* Stop */}
        <button 
          onClick={stopPlayback}
          className="text-slate-400 hover:text-red-400 transition-colors"
          title="Stop playback"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Play/Pause */}
        <button 
          onClick={togglePlay} 
          className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-main to-blue-500 flex items-center justify-center text-charcoal-900 shadow-cyan-glow hover: scale-105 transition-transform"
        >
          {isPlaying 
            ? <Pause className="w-6 h-6 fill-current" /> 
            :  <Play className="w-6 h-6 fill-current ml-1" />
          }
        </button>
        
        {/* Next */}
        <button 
          onClick={skipToNextVerse}
          disabled={playbackMode === 'podcast'}
          className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
        
        {/* Progress Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">
            {activeSurahData?. name}
            {playbackMode === 'interactive' && activeSurahData?.verses && (
              <span className="text-slate-400 font-normal ml-2">
                Verse {currentVerseIndex + 1} of {activeSurahData. verses.length}
              </span>
            )}
          </p>
          <div className="w-full h-1. 5 bg-charcoal-700 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-main to-blue-500 transition-all duration-500 rounded-full" 
              style={{ 
                width: `${((currentVerseIndex + 1) / (activeSurahData?.verses?.length || 1)) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // --- Loading View ---
  const LoadingView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-charcoal-700 border-t-cyan-main animate-spin" />
        <BookOpen className="w-8 h-8 text-cyan-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="mt-6 text-lg font-medium text-white animate-pulse">
        Loading Surah {activeSurahId}...
      </p>
      {loadingStage && (
        <p className="mt-2 text-sm text-slate-500">{loadingStage}</p>
      )}
    </div>
  );

  // --- Error View ---
  const ErrorView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Failed to Load</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{error}</p>
      <button 
        onClick={() => setActiveSurahId(activeSurahId)}
        className="px-6 py-3 bg-cyan-main text-charcoal-900 rounded-lg font-medium hover:bg-cyan-main/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="h-screen w-full relative overflow-hidden text-slate-200 font-sans selection:bg-cyan-main selection:text-charcoal-900 bg-charcoal-800 flex">
      <BackgroundPattern />
      <Sidebar />
      
      <div className="relative z-10 h-full flex-1 lg:ml-64 flex flex-col transition-all duration-300">
        {loading ? (
          <LoadingView />
        ) : error ? (
          <ErrorView />
        ) : (
          <>
            {activeTab === 'home' && <PlayerView />} 
            {activeTab === 'player' && <PlayerView />}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
                <p className="text-slate-400">Coming soon...</p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-3xl font-bold text-cyan-main">{userStats.streak}</p>
                    <p className="text-xs text-slate-500 uppercase mt-1">Day Streak</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-3xl font-bold text-green-400">{userStats.versesListened}</p>
                    <p className="text-xs text-slate-500 uppercase mt-1">Verses Listened</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-3xl font-bold text-amber-400">{userStats. tafseerRead}</p>
                    <p className="text-xs text-slate-500 uppercase mt-1">Tafseer Read</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-3xl font-bold text-purple-400">{userStats. favorites}</p>
                    <p className="text-xs text-slate-500 uppercase mt-1">Favorite Verses</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <audio ref={audioRef} hidden />
    </div>
  );
}