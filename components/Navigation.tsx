"use client";

import React, { useState, useEffect } from "react";
import MobileHeader from "./MobileHeader";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavigationProps {
  name: string;
}

const Navigation: React.FC<NavigationProps> = ({ name }) => {
  const { language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    setTimeout(() => setIsVisible(true), 500);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MobileHeader name={name} />

      <nav
        className="hidden md:block fixed top-6 left-1/2 z-50"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateX(-50%) translateY(${
            isVisible ? "0px" : "-20px"
          })`,
          transition: "all 0.6s ease-out",
        }}
      >
        <div
          className={`relative transition-all duration-300 ${
            isScrolled && !isHovered ? "scale-90" : "scale-100"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-full px-6 py-3 shadow-2xl shadow-black/20 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-6">
              {[
                { href: "#about", text: language === "es" ? "Sobre Mí" : "About Me" },
                { href: "#projects", text: language === "es" ? "Proyectos" : "Projects" },
                { href: "#experience", text: language === "es" ? "Experiencia" : "Experience" },
                { href: "#contact", text: language === "es" ? "Contacto" : "Contact" },
              ].map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-cyan-400 transition-all duration-200 text-sm font-medium px-3 py-1 rounded-full hover:bg-slate-800/50 hover:scale-110"
                  style={{
                    animationDelay: `${0.6 + i * 0.1}s`,
                    animation: isVisible
                      ? "fadeInUp 0.5s ease-out forwards"
                      : "none",
                  }}
                >
                  {link.text}
                </a>
              ))}
              <div className="ml-4 pl-4 border-l border-slate-700/50">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;
