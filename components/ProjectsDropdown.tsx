"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, FolderGit2, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Project } from "@/types/portfolio";

export default function ProjectsDropdown() {
  const { data, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const projects: Project[] = data?.projects || [];

  // Cerrar al hacer clic fuera o presionar Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
          isOpen
            ? "bg-accent text-primary shadow-sm ring-1 ring-border"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
        }`}
      >
        <span>{language === "es" ? "Proyectos" : "Projects"}</span>
        <ChevronDown
          className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 10, scale: 0.97, x: "-50%" }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-1/2 mt-2 w-80 sm:w-96 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl p-2.5 shadow-2xl shadow-black/10 dark:shadow-blue-950/30 z-50 origin-top"
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border/50">
              <span className="flex items-center gap-1.5 font-semibold">
                <FolderGit2 className="w-3.5 h-3.5 text-primary" />
                {language === "es" ? "Proyectos Destacados" : "Featured Projects"}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary font-semibold">
                {projects.length}
              </span>
            </div>

            {/* Lista de proyectos */}
            <div className="py-1.5 space-y-1 max-h-[360px] overflow-y-auto">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects#project-${project.id}`}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-xs font-bold shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    #{project.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      {project.tech.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-secondary text-secondary-foreground border border-border/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Botón "Ver todos los proyectos" */}
            <div className="pt-2 border-t border-border/50">
              <Link
                href="/projects"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary font-medium text-xs transition-colors group"
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  {language === "es" ? "Ver todos los proyectos" : "View all projects"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
