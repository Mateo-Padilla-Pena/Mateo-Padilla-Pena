"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

interface MobileHeaderProps {
  name: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ name }) => {
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (mobileMenuOpen && !target.closest("header")) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="text-blue-600 font-bold text-lg tracking-wider">
            {name}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              className={`p-2 rounded-full transition-all duration-200 ${
                mobileMenuOpen
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg overflow-hidden animate-slide-in">
          <div className="p-4">
            <div className="flex flex-col space-y-2">
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-sm font-medium px-4 py-3 rounded-xl hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "es" ? "Sobre Mí" : "About Me"}
              </a>
              <a
                href="#projects"
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-sm font-medium px-4 py-3 rounded-xl hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "es" ? "Proyectos" : "Projects"}
              </a>
              <a
                href="#experience"
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-sm font-medium px-4 py-3 rounded-xl hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "es" ? "Experiencia" : "Experience"}
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 text-sm font-medium px-4 py-3 rounded-xl hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "es" ? "Contacto" : "Contact"}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
