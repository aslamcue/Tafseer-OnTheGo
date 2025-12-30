import { useState, useEffect } from 'react';
import { fetchCompleteSurahData } from '../utils/api.js';

/**
 * Custom hook for fetching and managing Surah data
 */
export const useSurahData = (surahId) => {
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!surahId) return;
      
      setLoading(true);
      setError(null);
      setLoadingStage('Initializing...');

      try {
        const data = await fetchCompleteSurahData(surahId, setLoadingStage);
        setSurahData(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingStage('');
      }
    };

    fetchData();
  }, [surahId]);

  return { surahData, loading, loadingStage, error };
};
