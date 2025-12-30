import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 */
export const useKeyboardShortcuts = (handlers) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const { key, code } = event;

      // Space: Play/Pause
      if (key === ' ' || code === 'Space') {
        event.preventDefault();
        handlers.onTogglePlay?.();
      }
      // Arrow Left: Previous
      else if (key === 'ArrowLeft') {
        event.preventDefault();
        handlers.onPrevious?.();
      }
      // Arrow Right: Next
      else if (key === 'ArrowRight') {
        event.preventDefault();
        handlers.onNext?.();
      }
      // M: Mute/Unmute
      else if (key === 'm' || key === 'M') {
        event.preventDefault();
        handlers.onMute?.();
      }
      // F: Toggle Favorite
      else if (key === 'f' || key === 'F') {
        event.preventDefault();
        handlers.onToggleFavorite?.();
      }
      // Escape: Close modals/panels
      else if (key === 'Escape') {
        event.preventDefault();
        handlers.onEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handlers]);
};
