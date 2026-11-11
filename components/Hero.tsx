"use client";

import React from "react";
import { ArrowRight, Mail, Github, Linkedin, MapPin } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroProps {
  name: string;
  role: string;
  bio: string;
}

const Hero: React.FC<HeroProps> = ({ name, role, bio }) => {
  const { language } = useLanguage();

  // Cálculo dinámico de años de experiencia desde 2024
  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  const yearsOfExp = Math.max(1, currentYear - startYear);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-28 pb-16 overflow-hidden">
      {/* Fondo con patrón sutil y aura tech */}
      <div className="absolute inset-0 tech-grid-pattern pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Columna textual principal */}
          <div className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1">
            <ScrollAnimation direction="up" delay={0.1}>
              {/* Saludo y Nombre */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 text-foreground">
                Hola, soy{" "}
                <span className="bg-gradient-to-r from-primary via-sky-500 to-blue-600 bg-clip-text text-transparent">
                  {name.split(" ")[0]}
                </span>
              </h1>

              <div className="inline-block text-lg sm:text-2xl font-mono text-primary font-semibold tracking-tight mb-6 px-3.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                Full Stack Developer
              </div>

              <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {bio}
              </p>

              {/* Indicador de ubicación sin UTC */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono text-muted-foreground mb-8">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Medellín, Colombia</span>
              </div>
            </ScrollAnimation>

            {/* Botones de acción */}
            <ScrollAnimation direction="up" delay={0.25}>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start items-center">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
                >
                  <span>{language === "es" ? "Explorar Proyectos" : "View Projects"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground font-medium text-sm shadow-sm transition-all duration-200"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{language === "es" ? "Contactar" : "Get in Touch"}</span>
                </a>

                {/* Enlaces sociales */}
                <div className="flex items-center gap-2 ml-0 sm:ml-2">
                  <a
                    href="https://github.com/Mateo-Padilla-Pena"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="GitHub profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/in/mateo-padilla-peña"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Tarjeta de foto/avatar con estilo shadcn y efecto hover */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <ScrollAnimation direction="left" delay={0.2} distance={40}>
              <div className="relative group">
                {/* Aura ambiental de fondo */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/30 via-sky-500/10 to-transparent blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative rounded-3xl border border-border/80 bg-card/90 p-2.5 shadow-2xl backdrop-blur-md">
                  <div className="w-64 sm:w-72 md:w-80 h-80 sm:h-96 md:h-[26rem] rounded-2xl overflow-hidden bg-muted relative">
                    <img
                      src="/portfolio-image.jpeg"
                      alt={name}
                      loading="eager"
                      decoding="sync"
                      className="w-full h-full object-cover grayscale-[8%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-50 pointer-events-none" />

                    {/* Pill flotante inferior con especialidad y años calculados */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-card/85 backdrop-blur-md border border-border/70 shadow-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-mono font-medium text-foreground">
                          Full Stack Developer
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-primary font-semibold">
                        +{yearsOfExp} {language === "es" ? "Años Exp" : "Yrs Exp"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
