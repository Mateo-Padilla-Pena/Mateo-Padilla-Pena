"use client";

import React from "react";
import { Server, Layout, Cloud, Terminal, Cpu } from "lucide-react";
import type { About as AboutType } from "../types/portfolio";
import TechLogo from "./TechLogo";
import ScrollAnimation from "./ScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import CrossedAvatar from "./CrossedAvatar";

interface AboutProps {
  story: string;
  skills: AboutType["skills"];
}

const About: React.FC<AboutProps> = ({ story, skills }) => {
  const { language } = useLanguage();

  const categories = [
    {
      title: "Backend & APIs",
      icon: <Server className="w-4 h-4 text-primary" />,
      items: skills.backend,
      tag: "Core Focus",
    },
    {
      title: "Frontend & UI",
      icon: <Layout className="w-4 h-4 text-sky-500" />,
      items: skills.frontend,
      tag: "Modern Web",
    },
    {
      title: "Cloud & Services",
      icon: <Cloud className="w-4 h-4 text-blue-500" />,
      items: skills.services,
      tag: "Infrastructure",
    },
  ];

  return (
    <section id="about" className="py-24 px-6 border-t border-border/60 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <ScrollAnimation direction="down" delay={0.1}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 border border-primary/20 text-primary mb-3">
              <Terminal className="w-3 h-3" />
              <span>{language === "es" ? "Perfil & Especialidad" : "Profile & Tech Stack"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {language === "es" ? "Sobre" : "About"}{" "}
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                {language === "es" ? "Mí" : "Me"}
              </span>
            </h2>
          </div>
        </ScrollAnimation>

        {/* Narrative story card con Avatar al lado */}
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="max-w-4xl mx-auto mb-16 grid md:grid-cols-12 gap-8 items-center">
            {/* Story Card */}
            <div className="md:col-span-8 rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 sm:p-8 shadow-sm relative overflow-hidden h-full flex items-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
                {story}
              </p>
            </div>

            {/* Avatar interactivo al lado de Sobre Mí */}
            <div className="md:col-span-4 flex items-center justify-center">
              <div className="w-52 sm:w-60 md:w-full max-w-[260px] aspect-square flex items-center justify-center filter drop-shadow-2xl select-none">
                <CrossedAvatar className="w-full h-full" />
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Tech Stack Cards */}
        <ScrollAnimation direction="up" delay={0.3}>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {language === "es" ? "Stack Tecnológico" : "Technology Stack"}
              </h3>
            </div>
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline-block">
              {language === "es" ? "Herramientas de producción" : "Production toolchain"}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, catIndex) => (
              <ScrollAnimation
                key={category.title}
                direction="up"
                delay={0.35 + catIndex * 0.1}
              >
                <div className="h-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                  {/* Category header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-secondary border border-border/80">
                        {category.icon}
                      </div>
                      <h4 className="font-semibold text-foreground text-sm tracking-tight">
                        {category.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">
                      {category.tag}
                    </span>
                  </div>

                  {/* Skills list */}
                  <div className="space-y-2 flex-grow">
                    {category.items.map((skill, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border/50 hover:bg-accent/40 hover:border-primary/30 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <TechLogo
                            logo={skill.logo || "code"}
                            name={skill.name}
                            className="w-5 h-5 transition-transform group-hover:scale-110"
                          />
                          <span className="text-xs sm:text-sm font-medium text-foreground">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default About;
