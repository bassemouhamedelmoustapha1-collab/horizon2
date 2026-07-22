"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { dictionaries, type Lang, type Dictionary } from "./dictionaries";

type I18nContextType = {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    try {
      localStorage.setItem("lang", next);
    } catch {}
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t: dictionaries[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
