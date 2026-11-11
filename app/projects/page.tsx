"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Search,
  FolderGit2,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  X,
  Server,
  Layout,
  Database,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CrossedAvatar from "@/components/CrossedAvatar";
import { FloatingCvButton } from "@/components/CvDownloadModal";
import { useLanguage } from "@/contexts/LanguageContext";
import localData from "@/data/portfolio.json";
import type { PortfolioData, Project } from "@/types/portfolio";

export default function ProjectsPage() {
  const { data: rawData, language } = useLanguage();
  const data = (rawData as PortfolioData) || ((localData as any).es as PortfolioData);
  const projects: Project[] = data?.projects || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [showTechFilters, setShowTechFilters] = useState<boolean>(false);

  // Extracción dinámica de sectores únicos (sin emojis)
  const allSectors = useMemo(() => {
    const sectorSet = new Set<string>();
    projects.forEach((p) => {
      if (p.sector) sectorSet.add(p.sector);
    });
    return Array.from(sectorSet);
  }, [projects]);

  // Categorías de tecnologías curadas
  const techCategories = useMemo(() => {
    const backendTechs = [
      "NestJS",
      "TypeScript",
      "AWS Lambda",
      "Meta Business API",
      "REST APIs",
      "Redis",
      "World App SDK",
      "Python",
      "Node.js",
    ];
    const frontendTechs = [
      "React",
      "Vue.js 3",
      "Vue.js",
      "Vuetify 3",
      "Vuetify",
      "Tailwind CSS",
      "HTML5",
      "CSS",
    ];
    const databaseTechs = [
      "PostgreSQL",
      "DynamoDB",
      "Firebase Auth",
      "Railway",
      "Google Cloud",
      "Cloud SQL",
      "Cloud Firestore",
      "BigQuery",
      "SQL",
    ];

    const presentInProjects = (list: string[]) => {
      const allProjectTechs = projects.flatMap((p) => p.tech);
      return list.filter((item) =>
        allProjectTechs.some((pt) => pt.toLowerCase() === item.toLowerCase())
      );
    };

    return [
      {
        id: "backend",
        label: language === "es" ? "Backend & APIs" : "Backend & APIs",
        icon: <Server className="w-3.5 h-3.5 text-primary" />,
        technologies: presentInProjects(backendTechs),
      },
      {
        id: "frontend",
        label: language === "es" ? "Frontend & UI" : "Frontend & UI",
        icon: <Layout className="w-3.5 h-3.5 text-sky-500" />,
        technologies: presentInProjects(frontendTechs),
      },
      {
        id: "database",
        label: language === "es" ? "Bases de Datos & Cloud" : "Databases & Cloud",
        icon: <Database className="w-3.5 h-3.5 text-blue-500" />,
        technologies: presentInProjects(databaseTechs),
      },
    ];
  }, [projects, language]);

  // Filtrado reactivo de proyectos por búsqueda, sector y tecnología
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.impact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.sector && project.sector.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSector =
        selectedSector === "all" ||
        (project.sector && project.sector.toLowerCase() === selectedSector.toLowerCase());

      const matchesTech =
        selectedTech === "all" ||
        project.tech.some((t) => t.toLowerCase() === selectedTech.toLowerCase());

      return matchesSearch && matchesSector && matchesTech;
    });
  }, [projects, searchQuery, selectedSector, selectedTech]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedSector !== "all" || selectedTech !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSector("all");
    setSelectedTech("all");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 relative">
      <Navigation name={data.personal.name} />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Enlace de regreso */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>
              {language === "es"
                ? "Volver al inicio del portafolio"
                : "Back to Portfolio Home"}
            </span>
          </Link>
        </div>

        {/* Encabezado de la sección de proyectos con Avatar a la derecha */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-8">
          <div className="text-center sm:text-left flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 border border-primary/20 text-primary mb-4">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>
                {language === "es"
                  ? `Catálogo de Proyectos (${projects.length})`
                  : `Projects Showcase (${projects.length})`}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {language === "es" ? "Explora mis" : "Explore my"}{" "}
              <span className="bg-gradient-to-r from-primary via-sky-500 to-blue-600 bg-clip-text text-transparent">
                {language === "es" ? "Proyectos de Software" : "Software Projects"}
              </span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
              {language === "es"
                ? "Explora por sector industrial o filtra por stack tecnológico para analizar arquitectura, métricas de impacto y soluciones técnicas."
                : "Explore by industry sector or filter by tech stack to inspect architecture specifications, impact achievements, and implementations."}
            </p>
          </div>

          {/* Avatar en pose cruzada de brazos saliendo de abajo hacia arriba */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-36 sm:w-44 md:w-52 shrink-0 relative flex items-end justify-center hidden sm:flex drop-shadow-xl"
          >
            <CrossedAvatar className="w-full" />
          </motion.div>
        </div>

        {/* Filtros Principales (Diseño Moderno shadcn/ui) */}
        <div className="space-y-4 mb-10">
          {/* Barra Superior: Buscador + Botón Filtros de Stack + Contador */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Input de Búsqueda */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "es"
                    ? "Buscar por nombre, tecnología, sector o impacto..."
                    : "Search by title, technology, sector, or impact..."
                }
                className="flex h-10 w-full rounded-lg border border-input bg-card/60 pl-9 pr-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm"
                  aria-label="Borrar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Acciones: Botón Filtros de Stack y Contador */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
              {/* Botón que despliega el Card de Filtros por Stack */}
              <button
                type="button"
                onClick={() => setShowTechFilters((prev) => !prev)}
                className={`inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border text-xs font-medium transition-all cursor-pointer shadow-xs ${
                  showTechFilters || selectedTech !== "all"
                    ? "bg-primary/10 border-primary/40 text-primary font-semibold ring-1 ring-primary/20"
                    : "bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  {language === "es" ? "Filtros por Stack" : "Tech Stack Filters"}
                </span>
                {selectedTech !== "all" && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
                {showTechFilters ? (
                  <ChevronUp className="w-3.5 h-3.5 opacity-70" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                )}
              </button>

              {/* Contador de resultados */}
              <div className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-border/70 bg-muted/40 text-xs font-mono text-muted-foreground">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>
                  {filteredProjects.length}{" "}
                  {language === "es" ? "proyectos" : "projects"}
                </span>
              </div>

              {/* Botón Restablecer rápido */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 border border-destructive/25 transition-colors cursor-pointer"
                  title={language === "es" ? "Restablecer filtros" : "Reset filters"}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {language === "es" ? "Restablecer" : "Reset"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Filtros de Sector / Industria (100% Limpios, sin emojis, estilo Tabs shadcn) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-mono font-medium text-muted-foreground shrink-0 mr-1">
              {language === "es" ? "Sector:" : "Sector:"}
            </span>

            <div className="inline-flex items-center p-1 rounded-lg bg-muted/60 border border-border/60 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSector("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  selectedSector === "all"
                    ? "bg-background text-foreground shadow-xs font-semibold text-primary border border-border/70"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <span>{language === "es" ? "Todos los sectores" : "All sectors"}</span>
                <span className="ml-1.5 text-[10px] font-mono opacity-70">
                  ({projects.length})
                </span>
              </button>

              {allSectors.map((sector) => {
                const isActive = selectedSector.toLowerCase() === sector.toLowerCase();
                const count = projects.filter(
                  (p) => p.sector && p.sector.toLowerCase() === sector.toLowerCase()
                ).length;
                return (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => setSelectedSector(isActive ? "all" : sector)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-background text-foreground shadow-xs font-semibold text-primary border border-border/70"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    <span>{sector}</span>
                    <span className="ml-1.5 text-[10px] font-mono opacity-70">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Desplegable: Stack Tecnológico por Categoría */}
          <AnimatePresence>
            {showTechFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <div>
                      <h3 className="text-xs font-semibold text-foreground tracking-tight">
                        {language === "es"
                          ? "Stack Tecnológico por Categoría"
                          : "Tech Stack by Category"}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {language === "es"
                          ? "Haz clic en una tecnología para filtrar proyectos específicos"
                          : "Click a technology to filter matching projects"}
                      </p>
                    </div>

                    {selectedTech !== "all" && (
                      <button
                        type="button"
                        onClick={() => setSelectedTech("all")}
                        className="text-xs font-mono text-primary hover:underline cursor-pointer"
                      >
                        {language === "es"
                          ? "Quitar filtro de tecnología"
                          : "Clear tech filter"}
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    {techCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="rounded-lg border border-border/70 bg-muted/20 p-3 space-y-2.5"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            {cat.icon}
                            {cat.label}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                            {cat.technologies.length}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {cat.technologies.map((tech) => {
                            const isActive = selectedTech.toLowerCase() === tech.toLowerCase();
                            const count = projects.filter((p) =>
                              p.tech.some((t) => t.toLowerCase() === tech.toLowerCase())
                            ).length;
                            return (
                              <button
                                key={tech}
                                type="button"
                                onClick={() => setSelectedTech(isActive ? "all" : tech)}
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-mono transition-all cursor-pointer border ${
                                  isActive
                                    ? "border-primary/50 bg-primary/10 text-primary font-bold shadow-2xs ring-1 ring-primary/30"
                                    : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                              >
                                <span>{tech}</span>
                                <span className="text-[10px] opacity-70">({count})</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Barra de Filtros Activos (Chips removibles estilo shadcn) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono text-muted-foreground">
                {language === "es" ? "Filtros activos:" : "Active filters:"}
              </span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-md bg-muted text-foreground border border-border">
                  <span>&quot;{searchQuery}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:text-destructive cursor-pointer"
                    aria-label="Quitar búsqueda"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSector !== "all" && (
                <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/25 font-semibold">
                  <span>{selectedSector}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSector("all")}
                    className="hover:text-destructive cursor-pointer"
                    aria-label="Quitar filtro de sector"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedTech !== "all" && (
                <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/25 font-semibold">
                  <span>{selectedTech}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTech("all")}
                    className="hover:text-destructive cursor-pointer"
                    aria-label="Quitar filtro de tecnología"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-mono text-muted-foreground hover:text-destructive underline cursor-pointer ml-1"
              >
                {language === "es" ? "Limpiar todo" : "Clear all"}
              </button>
            </div>
          )}
        </div>

        {/* Cuadrícula de Proyectos */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card/40">
            <FolderGit2 className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold text-foreground mb-1">
              {language === "es"
                ? "No se encontraron proyectos con estos filtros"
                : "No projects match the selected criteria"}
            </h3>
            <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
              {language === "es"
                ? "Prueba cambiando de sector, seleccionando otra tecnología o limpiando los filtros activos."
                : "Try switching sectors, selecting another tech stack, or resetting filters."}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === "es" ? "Limpiar todos los filtros" : "Clear all filters"}</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                id={`project-${project.id}`}
                className="scroll-mt-32 rounded-xl border border-border bg-card text-card-foreground shadow-xs hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group overflow-hidden"
              >
                {/* Previsualización de Imagen con relación de aspecto */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border/60">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent opacity-60" />

                  {/* Badge de Sector limpio sobre la imagen (sin emojis) */}
                  {project.sector && (
                    <div className="absolute top-3 left-3 flex items-center px-2.5 py-1 rounded-md bg-card/90 backdrop-blur-md text-[11px] font-mono font-medium text-foreground border border-border/70 shadow-xs">
                      <span>{project.sector}</span>
                    </div>
                  )}

                  <span className="absolute top-3 right-3 text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-card/90 backdrop-blur-md text-foreground border border-border/70 shadow-xs">
                    #{project.id}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  {/* Título */}
                  <h2 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors tracking-tight">
                    {project.title}
                  </h2>

                  {/* Descripción detallada */}
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 font-normal flex-grow">
                    {project.description}
                  </p>

                  {/* Destacado de Impacto */}
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 mb-4 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-foreground leading-snug">
                      {project.impact}
                    </p>
                  </div>

                  {/* Pills de stack tecnológico que activan el filtro */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50 mb-4">
                    {project.tech.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedTech(t);
                          setShowTechFilters(true);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono border transition-colors cursor-pointer ${
                          selectedTech.toLowerCase() === t.toLowerCase()
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                            : "bg-secondary/70 hover:bg-accent text-secondary-foreground border-border/60"
                        }`}
                        title={language === "es" ? `Filtrar por ${t}` : `Filter by ${t}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Enlaces externos */}
                  <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                    <a
                      href="https://github.com/Mateo-Padilla-Pena"
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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors ml-auto"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <FloatingCvButton />

      <Footer name={data.personal.name} />
    </div>
  );
}
