import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { translations, type Language } from '../i18n/translations';
import { LanguageContext } from './LanguageContext';

const STORAGE_KEY = 'rebufo_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en') {
        return saved;
      }
    } catch {
      // Ignore localStorage errors (e.g. private mode)
    }
    return 'es';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore
    }
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: translations[lang],
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
