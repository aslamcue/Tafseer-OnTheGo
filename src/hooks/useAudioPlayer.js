import { useState, useRef, useCallback } from 'react';
import { API_KEY } from '../constants/translations.js';
import { generateTafseerSummary } from '../utils/formatters.js';

/**
 * Cleans text for TTS reading
 */
const cleanTextForTTS = (text) => {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/gm, '') // Remove HTML tags
    .replace(/\[\d+\]/g, '') // Remove [1] references
    .replace(/\(\d+\)/g, '') // Remove (1) references
    .replace(/\{\d+\}/g, '') // Remove {1} references
    .replace(/\b\d+:\d+\b/g, '') // Remove verse references like 2:255
    .replace(/[^\w\s.,?!:;'"-]/gi, '') // Keep only safe characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

/**
 * Custom hook for audio player functionality
 */
export const useAudioPlayer = (surahData) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [voiceGender, setVoiceGender] = useState('male');
  const [playbackMode, setPlaybackMode] = useState('interactive');
  const [usingAI, setUsingAI] = useState(false);
  const [tafseerMode, setTafseerMode] = useState('full');
  const [playbackOptions, setPlaybackOptions] = useState({
    recitation: true,
    translation: true,
    tafseer: true
  });
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [generatedSummaries, setGeneratedSummaries] = useState({});

  const audioRef = useRef(new Audio());
  const synth = useRef(window.speechSynthesis);
  const playbackQueue = useRef({ step: 0, verseIndex: 0, active: false });

  // Set volume on audio element
  const handleVolumeChange = useCallback((newVolume) => {
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  }, []);

  // Set playback speed
  const handleSpeedChange = useCallback((newSpeed) => {
    setPlaybackSpeed(newSpeed);
    audioRef.current.playbackRate = newSpeed;
  }, []);

  // Generate summary helper
  const generateSummary = async (verseIndex) => {
    if (!surahData?.verses?.[verseIndex]) return "";
    const verse = surahData.verses[verseIndex];
    if (generatedSummaries[verse.id]) return generatedSummaries[verse.id];
    
    const summary = generateTafseerSummary(verse.tafseer);
    setGeneratedSummaries(prev => ({ ...prev, [verse.id]: summary }));
    return summary;
  };

  // Play audio file
  const playAudioFile = (url) => {
    return new Promise((resolve) => {
      if (!url) {
        console.warn("Audio URL is missing or invalid.");
        resolve();
        return;
      }

      audioRef.current.src = url;
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.onended = resolve;
      audioRef.current.onerror = () => {
        console.error("Audio file failed to load:", url);
        resolve();
      };

      audioRef.current
        .play()
        .catch((err) => {
          console.error("Audio playback error:", err);
          resolve();
        });
    });
  };

  // Play TTS
  const playTTS = async (text, forcedGender = null) => {
    const cleanText = cleanTextForTTS(text);
    if (!cleanText || cleanText.length < 5) return;
    
    // Split into sentences for natural pauses
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

    const speakSentence = (sentence) => {
      return new Promise((resolve) => {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence || trimmedSentence.length < 3) {
          resolve();
          return;
        }

        let currentGender = forcedGender || voiceGender;

        if (!API_KEY || API_KEY === "YOUR_OPENAI_KEY_HERE") {
          // Use browser's Web Speech API
          setUsingAI(false);
          synth.current.cancel();
          
          const voices = synth.current.getVoices();
          const keywords = currentGender === 'male' 
            ? ['Male', 'Guy', 'David', 'Daniel', 'James'] 
            : ['Female', 'Aria', 'Zira', 'Samantha', 'Karen'];
          
          let bestVoice = voices.find(v => 
            v.lang.includes('en') && 
            v.name.includes('Natural') && 
            keywords.some(k => v.name.includes(k))
          );
          if (!bestVoice) {
            bestVoice = voices.find(v => v.lang.includes('en-US'));
          }
          if (!bestVoice) {
            bestVoice = voices.find(v => v.lang.includes('en'));
          }

          const utterance = new SpeechSynthesisUtterance(trimmedSentence);
          if (bestVoice) utterance.voice = bestVoice;
          utterance.rate = 0.85 * playbackSpeed;
          utterance.pitch = currentGender === 'male' ? 0.9 : 1.1;
          utterance.volume = volume;
          utterance.onend = resolve;
          utterance.onerror = () => resolve();
          synth.current.speak(utterance);
        } else {
          // Use OpenAI TTS
          const modelVoice = currentGender === 'male' ? 'onyx' : 'shimmer';
          fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: { 
              "Authorization": `Bearer ${API_KEY}`, 
              "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
              model: "tts-1", 
              input: trimmedSentence, 
              voice: modelVoice,
              speed: 0.9 * playbackSpeed
            }),
          })
          .then(res => {
            if (!res.ok) throw new Error('OpenAI TTS failed');
            return res.blob();
          })
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.volume = volume;
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
      if (!playbackQueue.current.active) break;
      await speakSentence(sentences[i]);
      if (i < sentences.length - 1 && playbackQueue.current.active) {
        await new Promise(r => setTimeout(r, 500));
      }
    }
  };

  // Play verse sequence
  const playVerseSequence = async (index) => {
    if (!surahData || index >= surahData.verses.length) {
      setIsPlaying(false);
      playbackQueue.current.active = false;
      return;
    }

    setIsPlaying(true);
    setCurrentVerseIndex(index);
    playbackQueue.current = { step: 0, verseIndex: index, active: true };

    const verse = surahData.verses[index];

    // 1. Arabic Recitation (If enabled)
    if (playbackOptions.recitation && playbackQueue.current.active) {
      await playAudioFile(verse.audioUrl);
    }
    
    // 2. Translation (If enabled)
    if (playbackOptions.translation && playbackQueue.current.active) {
      await new Promise(r => setTimeout(r, 700));
      await playTTS(verse.translation, voiceGender);
    }

    // 3. Tafseer (If enabled)
    if (playbackOptions.tafseer && playbackQueue.current.active) {
      await new Promise(r => setTimeout(r, 900));
      
      let tafseerText = verse.plainTafseer;
      if (tafseerMode === 'summary') {
        tafseerText = await generateSummary(index);
      } else {
        tafseerText = tafseerText.length > 1000 
          ? tafseerText.substring(0, 1000) + ". That concludes the key points of this tafseer." 
          : tafseerText;
      }
      await playTTS(tafseerText);
    }

    // Continue to next verse if still active
    if (playbackQueue.current.active) {
      await new Promise(r => setTimeout(r, 1000));
      playVerseSequence(index + 1);
    }
  };

  // Play podcast
  const playPodcast = async () => {
    if (!surahData?.podcastUrl) {
      console.warn("No podcast link found for this Surah.");
      setPlaybackMode('interactive');
      return;
    }
    
    setIsPlaying(true);
    playbackQueue.current.active = true;
    audioRef.current.src = surahData.podcastUrl;
    audioRef.current.volume = volume;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.onended = () => {
      setIsPlaying(false);
      playbackQueue.current.active = false;
    };
    audioRef.current.onerror = () => {
      setIsPlaying(false);
      playbackQueue.current.active = false;
      console.error("Failed to load podcast audio.");
    };
    audioRef.current.play().catch(err => {
      console.error('Podcast playback error:', err);
      setIsPlaying(false);
    });
  };

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      playbackQueue.current.active = false;
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
  }, [isPlaying, playbackMode, currentVerseIndex, surahData]);

  // Stop playback
  const stopPlayback = useCallback(() => {
    playbackQueue.current.active = false;
    audioRef.current.pause();
    synth.current.cancel();
    setIsPlaying(false);
  }, []);

  // Play specific verse
  const playSpecificVerse = useCallback((index) => {
    playbackQueue.current.active = false;
    audioRef.current.pause();
    synth.current.cancel();
    setTimeout(() => playVerseSequence(index), 100);
  }, [surahData]);

  // Skip to next verse
  const skipToNextVerse = useCallback(() => {
    if (playbackMode === 'interactive' && surahData) {
      const nextIndex = Math.min(surahData.verses.length - 1, currentVerseIndex + 1);
      playbackQueue.current.active = false;
      audioRef.current.pause();
      synth.current.cancel();
      setTimeout(() => playVerseSequence(nextIndex), 100);
    }
  }, [playbackMode, surahData, currentVerseIndex]);

  // Skip to previous verse
  const skipToPrevVerse = useCallback(() => {
    if (playbackMode === 'interactive' && surahData) {
      const prevIndex = Math.max(0, currentVerseIndex - 1);
      playbackQueue.current.active = false;
      audioRef.current.pause();
      synth.current.cancel();
      setTimeout(() => playVerseSequence(prevIndex), 100);
    }
  }, [playbackMode, surahData, currentVerseIndex]);

  // Toggle playback options
  const togglePlaybackOption = useCallback((key) => {
    setPlaybackOptions(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Change playback mode
  const changePlaybackMode = useCallback((mode) => {
    setPlaybackMode(mode);
    stopPlayback();
    setCurrentVerseIndex(0);
  }, []);

  // Mute/unmute
  const toggleMute = useCallback(() => {
    const newVolume = volume === 0 ? 1 : 0;
    handleVolumeChange(newVolume);
  }, [volume, handleVolumeChange]);

  return {
    // State
    isPlaying,
    currentVerseIndex,
    voiceGender,
    playbackMode,
    usingAI,
    tafseerMode,
    playbackOptions,
    volume,
    playbackSpeed,
    generatedSummaries,
    
    // Setters
    setVoiceGender,
    setPlaybackMode: changePlaybackMode,
    setTafseerMode,
    setCurrentVerseIndex,
    
    // Actions
    togglePlay,
    stopPlayback,
    playSpecificVerse,
    skipToNextVerse,
    skipToPrevVerse,
    togglePlaybackOption,
    handleVolumeChange,
    handleSpeedChange,
    toggleMute,
    
    // Refs
    audioRef,
  };
};
