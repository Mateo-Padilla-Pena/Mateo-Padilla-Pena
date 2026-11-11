"use client";

import React from "react";
import type { PortfolioData } from "../types/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";
import localData from "@/data/portfolio.json";

import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import PeekingAvatar from "../components/PeekingAvatar";
import { FloatingCvButton } from "../components/CvDownloadModal";

const Portfolio = () => {
  const { data: rawData } = useLanguage();
  const data = (rawData as PortfolioData) || ((localData as any).es as PortfolioData);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 relative">
      <Navigation name={data.personal.name} />

      <main>
        <Hero
          name={data.personal.name}
          role={data.personal.role}
          bio={data.personal.bio}
        />

        <About
          story={data.about?.story || data.personal?.story || data.personal?.bio || ""}
          skills={data.about?.skills || { backend: [], frontend: [], services: [] }}
        />

        <Projects projects={data.projects} />

        <Experience experience={data.experience} />

        <Contact personal={data.personal} />
      </main>

      <PeekingAvatar />
      <FloatingCvButton />

      <Footer name={data.personal.name} />
    </div>
  );
};

export default Portfolio;
