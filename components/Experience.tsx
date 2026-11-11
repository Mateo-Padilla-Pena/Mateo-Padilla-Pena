"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Download,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Experience as ExperienceType } from "../types/portfolio";
import ScrollAnimation from "./ScrollAnimation";
import CvDownloadModal from "./CvDownloadModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExperienceProps {
  experience: ExperienceType[];
}

const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  const { language } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isTimelineActive, setIsTimelineActive] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const MAX_DESCRIPTION_CHARS = 175;

  const toggleDescription = (index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getTruncatedText = (text: string, maxChars: number) => {
    if (!text || text.length <= maxChars) return text;
    const sliced = text.slice(0, maxChars);
    const lastSpace = sliced.lastIndexOf(" ");
    return (lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced) + "...";
  };

  // Check scroll state for indicators (scrollability affordance hints)
  const checkScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollState();
    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);

    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [experience]);

  // Observer to trigger the timeline build animation when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTimelineActive(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Chronological timeline nodes
  const timelineMilestones = [
    { year: "2024", label: "Inicio Profesional & Boston Project LLC" },
    { year: "2025", label: "Eclisse Crypto Trivia Backend" },
    { year: "2026", label: "Arquitecturas Full Stack & Escalamiento" },
  ];

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 px-6 border-t border-border/60 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section title & controls */}
        <ScrollAnimation direction="down" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 border border-primary/20 text-primary mb-3">
                <Briefcase className="w-3 h-3" />
                <span>{language === "es" ? "Línea de Tiempo" : "Career Timeline"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {language === "es" ? "Experiencia" : "Work"}{" "}
                <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                  {language === "es" ? "Profesional" : "Experience"}
                </span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                {language === "es"
                  ? "Evolución cronológica en proyectos internacionales de alto impacto iniciada en 2024."
                  : "Chronological milestone progression in international high-impact engineering starting in 2024."}
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline-block">
                {language === "es" ? "Desliza para explorar" : "Scroll to explore"} →
              </span>
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Desplazar a la izquierda"
                className="p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Desplazar a la derecha"
                className="p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollAnimation>

        {/* Animated Horizontal Timeline Bar (que se va armando) */}
        <div className="relative mb-10 px-4 sm:px-8">
          {/* Base track line */}
          <div className="h-1 w-full bg-border/70 rounded-full relative overflow-hidden">
            {/* Animated filling line from left to right */}
            <div
              className="h-full bg-gradient-to-r from-primary via-sky-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: isTimelineActive ? "100%" : "0%",
                boxShadow: "0 0 16px rgba(56, 189, 248, 0.5)",
              }}
            />
          </div>

          {/* Milestone step nodes along the track */}
          <div className="flex justify-between items-center -mt-3.5 relative z-10">
            {timelineMilestones.map((milestone, idx) => {
              const isFilled = isTimelineActive;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center"
                  style={{
                    transitionDelay: `${idx * 250}ms`,
                  }}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-500 ${
                      isFilled
                        ? "border-primary bg-card text-primary shadow-md ring-4 ring-primary/20 scale-110"
                        : "border-border bg-background text-muted-foreground scale-90"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="mt-2 text-xs font-mono font-bold text-foreground tracking-tight">
                    {milestone.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizontal Scrollable Carousel Container */}
        <div className="relative">
          {/* Visual gradient affordance hints at container edges (per modern-web-guidance) */}
          <div
            className={`absolute left-0 top-0 bottom-6 w-12 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {experience.map((job, index) => {
              const isLongDescription =
                (job.description?.length || 0) > MAX_DESCRIPTION_CHARS;
              const isExpanded = !!expandedCards[index];
              const displayedDescription =
                isLongDescription && !isExpanded
                  ? getTruncatedText(job.description, MAX_DESCRIPTION_CHARS)
                  : job.description;

              return (
                <div
                  key={index}
                  className="w-[320px] sm:w-[400px] md:w-[450px] min-h-[470px] sm:min-h-[485px] shrink-0 snap-center rounded-2xl border border-border bg-card/85 backdrop-blur-sm p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  style={{
                    opacity: isTimelineActive ? 1 : 0,
                    transform: isTimelineActive
                      ? "translateX(0px)"
                      : `translateX(${40 * (index + 1)}px)`,
                    transition: `all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${
                      0.2 + index * 0.2
                    }s`,
                  }}
                >
                  <div className="flex flex-col flex-1">
                    {/* Period badge & stage indicator */}
                    <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Calendar className="w-3 h-3" />
                        {job.period}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase px-2 py-0.5 rounded-md bg-secondary border border-border/60">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Position & Company */}
                    <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight mb-1 min-h-[3.25rem] flex items-start line-clamp-2 shrink-0">
                      {job.position}
                    </h3>

                    <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm font-semibold text-primary shrink-0">
                      <span className="truncate">{job.company}</span>
                      <span className="text-muted-foreground shrink-0">•</span>
                      <span className="flex items-center gap-1 text-muted-foreground font-normal text-xs shrink-0">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {job.location}
                      </span>
                    </div>

                    {/* Description with increased base height & "Ver más / Ver menos" */}
                    <div className="min-h-[6.75rem] sm:min-h-[7.25rem] mb-4 flex flex-col justify-between">
                      <p className="text-muted-foreground text-xs sm:text-sm font-normal leading-relaxed">
                        {displayedDescription}
                        {isLongDescription && (
                          <button
                            type="button"
                            onClick={() => toggleDescription(index)}
                            className="ml-1.5 inline-flex items-center text-xs font-semibold text-primary hover:underline focus:outline-none cursor-pointer"
                          >
                            {isExpanded
                              ? language === "es"
                                ? "Ver menos"
                                : "Show less"
                              : language === "es"
                              ? "Ver más"
                              : "Read more"}
                          </button>
                        )}
                      </p>
                    </div>

                    {/* Scrollable Key Achievements */}
                    <div className="pt-3 border-t border-border/60 flex flex-col mt-auto">
                      <span className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 shrink-0">
                        {language === "es" ? "Logros Clave" : "Key Contributions"}
                      </span>
                      <div className="h-28 overflow-y-auto pr-2 space-y-2">
                        {job.achievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="text-xs text-foreground font-medium leading-relaxed">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer milestone indicator */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground shrink-0">
                    <span className="text-primary font-semibold">
                      {index === 0
                        ? language === "es"
                          ? "Rol Actual"
                          : "Current Role"
                        : language === "es"
                        ? "Proyecto Previo"
                        : "Previous Milestone"}
                    </span>
                    <span>{job.company}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Download CV CTA */}
        <ScrollAnimation direction="up" delay={0.4}>
          <div className="text-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground font-medium text-sm shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>
                {language === "es"
                  ? "Descargar Currículum (PDF)"
                  : "Download Resume (PDF)"}
              </span>
            </button>
          </div>
        </ScrollAnimation>
      </div>

      {/* Language Selection Modal & PDF Generator */}
      <CvDownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Experience;
