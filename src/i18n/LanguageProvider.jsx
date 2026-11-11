import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./useLanguage";

const STORAGE_KEY = "zinger_lang";

export default function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "de" ? "de" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage failure
    }
  }, [lang]);

  const setLang = useCallback((nextLang) => {
    setLangState(nextLang === "de" ? "de" : "en");
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "de" ? "en" : "de"));
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      isDe: lang === "de",
      tr: (en, de) => (lang === "de" ? de : en),
    }),
    [lang, setLang, toggleLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

