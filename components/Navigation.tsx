"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileHeader from "./MobileHeader";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import ProjectsDropdown from "./ProjectsDropdown";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavigationProps {
  name: string;
}

const Navigation: React.FC<NavigationProps> = ({ name }) => {
  const { language } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getAnchor = (hash: string) => {
    return isHomePage ? hash : `/${hash}`;
  };

  return (
    <>
      <MobileHeader name={name} />

      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-card/80 dark:bg-card/70 backdrop-blur-xl border-b border-border/15 dark:border-white/[0.06] shadow-sm shadow-black/[0.02] dark:shadow-blue-950/20 py-3"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Brand aligned to content left edge */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-foreground font-semibold text-sm tracking-tight group"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-primary/25 shadow-xs group-hover:scale-110 group-hover:border-primary/60 transition-all duration-300">
              <img
                src="/avatar.jpg"
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm leading-tight">
                {name}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground leading-tight">
                Full Stack Developer
              </span>
            </div>
          </Link>

          {/* Centered navigation links */}
          <nav className="flex items-center p-1 rounded-full border border-border/70 bg-card/60 backdrop-blur-md shadow-sm">
            <Link
              href={getAnchor("#about")}
              className="text-xs font-medium px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
            >
              {language === "es" ? "Sobre mí" : "About"}
            </Link>

            {/* Interactive Projects Dropdown */}
            <ProjectsDropdown />

            <Link
              href={getAnchor("#experience")}
              className="text-xs font-medium px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
            >
              {language === "es" ? "Experiencia" : "Experience"}
            </Link>

            <Link
              href={getAnchor("#contact")}
              className="text-xs font-medium px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
            >
              {language === "es" ? "Contacto" : "Contact"}
            </Link>
          </nav>

          {/* Language and Theme controls aligned to content right edge */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};

export default Navigation;
