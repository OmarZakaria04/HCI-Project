import { useLanguage } from "./useLanguage";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang, tr } = useLanguage();

  return (
    <div
      className={`lang-switcher ${className}`.trim()}
      role="group"
      aria-label={tr("Language selection", "Sprachauswahl")}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        aria-label="English"
        className={`lang-switcher-btn ${lang === "en" ? "is-active" : ""}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("de")}
        aria-pressed={lang === "de"}
        aria-label="Deutsch"
        className={`lang-switcher-btn ${lang === "de" ? "is-active" : ""}`}
      >
        DE
      </button>
    </div>
  );
}

