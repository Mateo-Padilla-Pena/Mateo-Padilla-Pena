"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Github, FolderGit2, CheckCircle2, ArrowRight, Layers } from "lucide-react";
import type { Project } from "../types/portfolio";
import ScrollAnimation from "./ScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const { language } = useLanguage();

  return (
    <section id="projects" className="py-24 px-6 border-t border-border/60 relative">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado de la sección de proyectos */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-16">
          <ScrollAnimation direction="down" delay={0.1} className="text-center md:text-left flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 border border-primary/20 text-primary mb-3">
              <FolderGit2 className="w-3 h-3" />
              <span>{language === "es" ? "Trabajo Destacado" : "Featured Work"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {language === "es" ? "Proyectos" : "Featured"}{" "}
              <span className="bg-gradient-to-r from-primary via-sky-500 to-blue-600 bg-clip-text text-transparent">
                {language === "es" ? "Principales" : "Projects"}
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
              {language === "es"
                ? "Sistemas reales desarrollados para resolver problemáticas de negocio con arquitecturas escalables y alto impacto."
                : "Production systems architected to solve real business challenges with high performance and scalability."}
            </p>
          </ScrollAnimation>
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ScrollAnimation
              key={project.id}
              direction="up"
              delay={0.2 + index * 0.1}
            >
              <div className="h-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                {/* Image preview with aspect ratio */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border/60">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-60" />

                  {/* Clean sector pill badge over image */}
                  {project.sector && (
                    <div className="absolute top-3 left-3 flex items-center px-2.5 py-1 rounded-md bg-card/90 backdrop-blur-md text-[11px] font-mono font-medium text-foreground border border-border/70 shadow-xs">
                      <span>{project.sector}</span>
                    </div>
                  )}

                  <span className="absolute top-3 right-3 text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-card/90 backdrop-blur-md text-foreground border border-border/70 shadow-sm">
                    #{project.id}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-5 font-normal flex-grow">
                    {project.description}
                  </p>

                  {/* Impact callout */}
                  <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 mb-5 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-foreground leading-snug">
                      {project.impact}
                    </p>
                  </div>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                    {project.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-secondary text-secondary-foreground border border-border/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links (if configured) */}
                  <div className="flex items-center gap-3 pt-4 mt-4 border-t border-border/40">
                    <a
                      href={project.code && project.code !== "#" ? project.code : "https://github.com/Mateo-Padilla-Pena"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>{language === "es" ? "Código" : "Source"}</span>
                    </a>
                    {project.demo && project.demo !== "#" && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors ml-auto"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* View all projects CTA */}
        <ScrollAnimation direction="up" delay={0.4}>
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground font-medium text-sm shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 group"
            >
              <Layers className="w-4 h-4 text-primary" />
              <span>
                {language === "es"
                  ? `Ver todos los proyectos (${projects.length})`
                  : `View all projects (${projects.length})`}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default Projects;
