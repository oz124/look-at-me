import { useState, useEffect } from 'react';
import { useSettings } from '@/lib/settings-context';
import { Translations } from '@/lib/translations';

export const useTranslations = () => {
  const { settings, updateSettings } = useSettings();
  const [currentTranslations, setCurrentTranslations] = useState(Translations.hebrew);

  useEffect(() => {
    setCurrentTranslations(Translations[settings.language]);
  }, [settings.language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = currentTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found`);
        return key; // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const changeLanguage = (language: 'hebrew' | 'english') => {
    updateSettings({ language });
  };

  const isRTL = settings.direction === 'rtl';

  return {
    t,
    changeLanguage,
    isRTL,
    currentLanguage: settings.language,
  };
};
