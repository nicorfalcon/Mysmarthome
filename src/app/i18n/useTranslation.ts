import { useApp } from '../context/AppContext';
import { translations, getLanguageCode, type TranslationKey } from './translations';

export function useTranslation() {
  const { preferences } = useApp();
  const langCode = getLanguageCode(preferences.language);
  
  const t = (key: TranslationKey, replacements?: Record<string, string | number>): string => {
    const langTranslations = translations[langCode] || translations.en;
    let text = langTranslations[key] || translations.en[key] || key;
    
    // Handle replacements like {name}, {count}, etc.
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(value));
      });
    }
    
    return text;
  };
  
  return { t, currentLanguage: preferences.language };
}
