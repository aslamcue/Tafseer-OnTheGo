import { formatTafseerHTML, formatTafseerForTTS } from './formatters.js';
import { SURAH_PODCASTS } from '../constants/podcasts.js';

/**
 * Fetches Surah metadata and verses from AlQuran.cloud
 */
export const fetchSurahInfo = async (surahId) => {
  const surahRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`);
  if (!surahRes.ok) throw new Error(`Failed to fetch Surah (${surahRes.status})`);
  const surahData = await surahRes.json();
  return surahData.data;
};

/**
 * Fetches translations from Quran.com with CORS proxy
 */
export const fetchTranslations = async (surahId) => {
  const clearQuranUrl = `https://api.quran.com/api/v4/quran/translations/131?chapter_number=${surahId}`;
  const saheehUrl = `https://api.quran.com/api/v4/quran/translations/20?chapter_number=${surahId}`;
  
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
  } else {
    console.warn('Clear Quran fetch failed');
  }

  if (saheehRes.ok) {
    const proxyData = await saheehRes.json();
    const data = JSON.parse(proxyData.contents);
    saheehTranslations = data.translations || [];
  } else {
    console.warn('Saheeh International fetch failed');
  }

  return { clearQuranTranslations, saheehTranslations };
};

/**
 * Fetches Tafseer from Quran.com with CORS proxy
 */
export const fetchTafseer = async (surahId) => {
  const tafseerUrl = `https://api.quran.com/api/v4/tafsirs/169/by_chapter/${surahId}?per_page=300`;
  const tafseerRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(tafseerUrl)}`);
  
  let tafsirsData = { tafsirs: [] };
  if (tafseerRes.ok) {
    const proxyData = await tafseerRes.json();
    tafsirsData = JSON.parse(proxyData.contents);
  } else {
    console.warn('Tafseer fetch failed');
  }

  return tafsirsData;
};

/**
 * Cleans translation text by removing footnotes and references
 */
export const cleanTranslationText = (text) => {
  if (!text) return "Translation unavailable";
  
  return text
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '') // Remove superscript footnotes
    .replace(/\[\d+\]/g, '') // Remove [1] style references
    .replace(/\(\d+\)/g, '') // Remove (1) references
    .replace(/\{\d+\}/g, '') // Remove {1} references
    .replace(/\b\d+:\d+\b/g, '') // Remove verse references like 2:255
    .replace(/[^\w\s.,?!:;'"-]/gi, '') // Keep only safe characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

/**
 * Merges all Surah data from different sources
 */
export const mergeSurahData = (surahInfo, translations, tafsirsData, activeSurahId) => {
  const { clearQuranTranslations, saheehTranslations } = translations;
  
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
    
    // Clean translation text
    translationText = cleanTranslationText(translationText);

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

  return {
    id: activeSurahId,
    name: surahInfo.name,
    arabicName: surahInfo.name,
    englishName: surahInfo.englishName,
    versesCount: surahInfo.numberOfAyahs,
    revelationType: surahInfo.revelationType,
    verses: mergedVerses,
    podcastUrl: podcastUrl
  };
};

/**
 * Fetches complete Surah data from all sources
 */
export const fetchCompleteSurahData = async (surahId, setLoadingStage) => {
  if (!surahId) return null;
  
  try {
    setLoadingStage?.('Fetching Surah info...');
    const surahInfo = await fetchSurahInfo(surahId);
    
    setLoadingStage?.('Loading translations...');
    const translations = await fetchTranslations(surahId);
    
    setLoadingStage?.('Loading Tafseer Ibn Kathir...');
    const tafsirsData = await fetchTafseer(surahId);
    
    setLoadingStage?.('Merging data...');
    const completeSurahData = mergeSurahData(surahInfo, translations, tafsirsData, surahId);
    
    setLoadingStage?.('Complete!');
    return completeSurahData;
    
  } catch (err) {
    console.error("Fetch Error:", err);
    throw new Error(`Failed to load Quran data: ${err.message}. Please check your connection and try again.`);
  }
};
