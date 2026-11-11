"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import localData from "@/data/portfolio.json";

export type Language = "es" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  data: any;
  getDataForLanguage: (lang: Language) => any;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

const getLocalFallback = (lang: Language) => {
  const dict = localData as Record<string, any>;
  if (dict[lang]) return dict[lang];
  if (dict.es) return dict.es;
  return localData;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("es");
  const [data, setData] = useState<any>(getLocalFallback("es"));
  const remoteDocRef = useRef<Record<string, any> | null>(null);

  // Initialize preferred language from localStorage synchronously on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("portfolio-lang") as Language;
    if (savedLang && (savedLang === "es" || savedLang === "en")) {
      setLanguage(savedLang);
      setData(getLocalFallback(savedLang));
    }

    // Lazy background fetch from Firestore ONLY if real Firebase API credentials exist
    const hasRealFirebase =
      Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "dummy-key-for-build";

    if (hasRealFirebase) {
      import("@/backend")
        .then(async ({ portfolioService }) => {
          const docData = await portfolioService.getRemoteContent();
          if (docData) {
            remoteDocRef.current = docData;
            const currentLang = (localStorage.getItem("portfolio-lang") as Language) || "es";
            if (docData[currentLang]) {
              setData(docData[currentLang]);
            }
          }
        })
        .catch(() => {
          // Silently fallback to bundled fast JSON
        });
    }
  }, []);

  // Instant synchronous update from remote cache or local bilingual JSON
  const getDataForLanguage = (lang: Language) => {
    if (remoteDocRef.current && remoteDocRef.current[lang]) {
      return remoteDocRef.current[lang];
    }
    return getLocalFallback(lang);
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem("portfolio-lang", lang);
    } catch (e) {}

    setData(getDataForLanguage(lang));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        data,
        getDataForLanguage,
        loading: false,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
