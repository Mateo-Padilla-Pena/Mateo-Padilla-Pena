"use client";

import React, { forwardRef } from "react";
import type { PortfolioData } from "../../types/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";

interface CvTemplateProps {
  data: PortfolioData;
}

const CvTemplate = forwardRef<HTMLDivElement, CvTemplateProps>(({ data }, ref) => {
  const { language } = useLanguage();

  const labels = {
    es: {
      profile: "Perfil Profesional",
      experience: "Experiencia Profesional",
      projects: "Proyectos",
      skills: "Habilidades Técnicas",
      backend: "Backend",
      frontend: "Frontend",
      database: "Bases de Datos",
      cloud: "Servicios Cloud",
      certifications: "Certificaciones",
      courses: "Cursos",
      languages: "Idiomas",
      references: "Referencias",
      native: "Nativo",
    },
    en: {
      profile: "Professional Profile",
      experience: "Professional Experience",
      projects: "Projects",
      skills: "Technical Skills",
      backend: "Backend",
      frontend: "Frontend",
      database: "Database",
      cloud: "Cloud Services",
      certifications: "Certifications",
      courses: "Courses",
      languages: "Languages",
      references: "References",
      native: "Native",
    }
  };

  const l = labels[language];

  return (
    <div
      ref={ref}
      className="bg-white text-gray-800 font-sans leading-relaxed"
      style={{ width: "210mm", minHeight: "297mm", padding: "0" }}
    >
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2">{data.personal.name}</h1>
          <p className="text-xl font-light mb-6 opacity-90">{data.personal.role}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm leading-tight mb-2">
            <span>{data.personal.linkedin}</span>
            <span className="text-white/50">|</span>
            <span>{data.personal.github}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span>{data.personal.location}</span>
            <span className="text-white/50">|</span>
            <span>{data.personal.email}</span>
            <span className="text-white/50">|</span>
            <span>{data.personal.phone}</span>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Professional Profile */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">{l.profile}</h2>
            <div className="flex-grow h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
            <p className="text-gray-700 text-sm leading-relaxed">{data.personal.bio}</p>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">{l.experience}</h2>
            <div className="flex-grow h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>

          {data.experience.map((exp, idx) => (
            <div key={idx} className="relative pl-6 pb-6 border-l-2 border-blue-500">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-0.5">{exp.position}</h3>
                  <h4 className="text-base font-medium text-gray-800">{exp.company}</h4>
                  <p className="text-xs text-gray-500 italic">{exp.location}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                  {exp.period}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">{l.projects}</h2>
            <div className="flex-grow h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>

          {data.projects.slice(0, 3).map((proj, idx) => (
            <div key={idx} className="relative pl-6 pb-6 border-l-2 border-blue-500">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-blue-600 mb-1">{proj.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-2">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {proj.tech.map((t, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Two Column Layout for Skills, Certs, Languages */}
        <div className="grid grid-cols-2 gap-8" style={{ breakInside: "avoid" }}>
          {/* Left Column */}
          <div>
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{l.skills}</h2>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-blue-600 mb-2">{l.backend}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.about.skills.backend.map((s, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">{s.name}</span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-blue-600 mb-2">{l.frontend}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.about.skills.frontend.map((s, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs border border-green-100">{s.name}</span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-blue-600 mb-2">{l.cloud}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.about.skills.services.map((s, i) => (
                    <span key={i} className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs border border-orange-100">{s.name}</span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div>
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{l.languages}</h2>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded p-3">
                  <h4 className="font-semibold text-blue-600 text-sm">Español - {l.native}</h4>
                  <div className="mt-1.5 bg-blue-500 h-1.5 rounded-full w-full"></div>
                </div>
                <div className="border border-gray-200 rounded p-3">
                  <h4 className="font-semibold text-blue-600 text-sm">English - B2</h4>
                  <div className="mt-1.5 bg-gray-200 h-1.5 rounded-full w-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{l.courses} / {l.certifications}</h2>
              <div className="space-y-2">
                <div className="bg-gray-50 border-l-2 border-blue-400 p-2 text-xs text-gray-700">
                  Rest API Intermediate (HackerRank)
                </div>
                <div className="bg-gray-50 border-l-2 border-blue-400 p-2 text-xs text-gray-700">
                  JavaScript Intermediate (HackerRank)
                </div>
                <div className="bg-gray-50 border-l-2 border-blue-400 p-2 text-xs text-gray-700">
                  Python Basic (HackerRank)
                </div>
                <div className="bg-gray-50 border-l-2 border-blue-400 p-2 text-xs text-gray-700">
                  Java - Edutin Academy
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
});

CvTemplate.displayName = "CvTemplate";

export default CvTemplate;
