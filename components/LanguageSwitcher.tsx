"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
      <button
        onClick={() => setLanguage("es")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          language === "es"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          language === "en"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        EN
      </button>
    </div>
  );
}
