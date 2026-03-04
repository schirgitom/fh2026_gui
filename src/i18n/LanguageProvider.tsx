import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { de } from '@/i18n/locales/de';
import { en } from '@/i18n/locales/en';
import { Language, TranslationMap, TranslationParams } from '@/i18n/types';

interface I18nContextValue {
  language: Language;
  setLanguage: (next: Language) => void;
  locale: string;
  t: (key: string, params?: TranslationParams) => string;
}

const STORAGE_KEY = 'app-language';

const translations: Record<Language, TranslationMap> = {
  de,
  en
};

const resolveLanguage = (): Language => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'de' || stored === 'en') {
    return stored;
  }

  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
};

const format = (template: string, params?: TranslationParams) => {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(.*?)\}\}/g, (_, rawKey: string) => {
    const key = rawKey.trim();
    const value = params[key];
    return value === undefined ? '' : String(value);
  });
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(resolveLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      locale: language === 'de' ? 'de-DE' : 'en-US',
      t: (key, params) => {
        const dictionary = translations[language];
        const fallback = translations.en[key] ?? key;
        const template = dictionary[key] ?? fallback;
        return format(template, params);
      }
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }

  return context;
};
