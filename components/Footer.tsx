"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FooterProps {
  name: string;
}

const Footer: React.FC<FooterProps> = ({ name }) => {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 py-10 px-6 bg-card/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            © {year} {name}. {language === "es" ? "Todos los derechos reservados." : "All rights reserved."}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
