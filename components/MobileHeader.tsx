"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight, FolderGit2 } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Project } from "@/types/portfolio";

interface MobileHeaderProps {
  name: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ name }) => {
  const { data, language } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectsAccordionOpen, setProjectsAccordionOpen] = useState(false);

  const projects: Project[] = data?.projects || [];

  const getAnchor = (hash: string) => {
    return isHomePage ? hash : `/${hash}`;
  };

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
      <div className="bg-card/85 dark:bg-card/75 backdrop-blur-xl border-b border-border/15 dark:border-white/[0.06] px-5 py-3 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground font-semibold text-sm tracking-tight"
          >
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-primary/25 shadow-xs shrink-0">
              <img
                src="/avatar.jpg"
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="truncate max-w-[160px]">{name}</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <button
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="p-2 rounded-lg border border-border bg-card/60 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-2xl border-b border-border shadow-xl p-4 animate-slide-in">
          <nav className="flex flex-col space-y-1">
            <Link
              href={getAnchor("#about")}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{language === "es" ? "Sobre mí" : "About"}</span>
              <span className="text-primary font-mono text-xs">→</span>
            </Link>

            {/* Projects accordion */}
            <div>
              <button
                type="button"
                onClick={() => setProjectsAccordionOpen(!projectsAccordionOpen)}
                className="w-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-primary" />
                  {language === "es" ? "Proyectos" : "Projects"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    projectsAccordionOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {projectsAccordionOpen && (
                <div className="pl-4 pr-2 py-2 space-y-1 bg-secondary/30 rounded-xl my-1 border border-border/40">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects#project-${project.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs text-foreground hover:bg-accent transition-colors"
                    >
                      <span className="truncate max-w-[200px]">{project.title}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">#{project.id}</span>
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-border/40">
                    <Link
                      href="/projects"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 transition-colors"
                    >
                      <span>{language === "es" ? "Ver todos los proyectos" : "View all projects"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={getAnchor("#experience")}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{language === "es" ? "Experiencia" : "Experience"}</span>
              <span className="text-primary font-mono text-xs">→</span>
            </Link>

            <Link
              href={getAnchor("#contact")}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{language === "es" ? "Contacto" : "Contact"}</span>
              <span className="text-primary font-mono text-xs">→</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
