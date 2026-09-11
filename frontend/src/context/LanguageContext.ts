import { createContext } from 'react';
import type { Language, TranslationKeys } from '../i18n/translations';

export interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationKeys;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
