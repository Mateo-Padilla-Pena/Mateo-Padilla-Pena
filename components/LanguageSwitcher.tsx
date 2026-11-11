"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-label="Selector de idioma"
      className="inline-flex items-center p-0.5 rounded-full bg-secondary/80 border border-border text-muted-foreground shadow-inner backdrop-blur-sm"
    >
      <button
        type="button"
        role="radio"
        aria-checked={language === "es"}
        onClick={() => setLanguage("es")}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          language === "es"
            ? "bg-card text-primary shadow-sm ring-1 ring-border"
            : "hover:text-foreground hover:bg-accent/40"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={language === "en"}
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          language === "en"
            ? "bg-card text-primary shadow-sm ring-1 ring-border"
            : "hover:text-foreground hover:bg-accent/40"
        }`}
      >
        EN
      </button>
    </div>
  );
}
