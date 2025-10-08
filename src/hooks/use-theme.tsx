import { useEffect } from 'react';
import { useSettings } from '@/lib/settings-context';

export const useTheme = () => {
  const { settings } = useSettings();

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply direction to document
    root.setAttribute('dir', settings.direction);
    root.setAttribute('lang', settings.language === 'hebrew' ? 'he' : 'en');

    // Update document title based on language
    if (settings.language === 'hebrew') {
      document.title = 'LOOK AT ME - פלטפורמת השיווק החכמה';
    } else {
      document.title = 'LOOK AT ME - Smart Marketing Platform';
    }
  }, [settings.theme, settings.direction, settings.language]);

  return {
    theme: settings.theme,
    direction: settings.direction,
    language: settings.language,
  };
};
