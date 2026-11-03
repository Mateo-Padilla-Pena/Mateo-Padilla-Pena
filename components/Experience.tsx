"use client";

import React, { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { Experience as ExperienceType } from "../types/portfolio";
import ScrollAnimation from "./ScrollAnimation";
import CvTemplate from "./cv/CvTemplate";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExperienceProps {
  experience: ExperienceType[];
}

const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  const { data, language } = useLanguage();
  const cvRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadCV = async () => {
    if (!cvRef.current) return;
    setIsGenerating(true);

    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;

      const element = cvRef.current;
      const opt = {
        margin: 0,
        filename: `Mateo_Padilla_CV_${language.toUpperCase()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt as any).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <section id="experience" className="py-24 px-6 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <ScrollAnimation direction="down" delay={0.1}>
          <h2 className="text-3xl font-bold mb-16 text-center text-gray-900">
            Mi <span className="text-blue-600">Experiencia</span>
          </h2>
        </ScrollAnimation>

        <div className="space-y-10 relative before:absolute before:inset-0 before:ml-4 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-blue-100 before:to-transparent">
          {experience.map((job, index) => (
            <ScrollAnimation
              key={index}
              direction="up"
              delay={0.2 + index * 0.1}
              duration={0.4}
            >
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-sm shrink-0 ml-0 md:mx-auto md:absolute md:left-1/2 md:-translate-x-1/2 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 z-10">
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                </div>

                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col mb-4">
                    <span className="text-blue-600 font-medium text-sm mb-1">{job.period}</span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.position}
                    </h3>
                    <p className="text-gray-600 font-medium mt-1">
                      {job.company}
                    </p>
                  </div>

                  <p className="text-gray-500 text-sm mb-4">
                    {job.location}
                  </p>

                  <p className="text-gray-600 font-light text-sm mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="space-y-2">
                    {job.achievements.map((achievement, achIndex) => (
                      <ScrollAnimation
                        key={achIndex}
                        direction="left"
                        delay={0.3 + index * 0.1 + achIndex * 0.05}
                        duration={0.3}
                        distance={10}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></div>
                          <span className="text-sm font-medium text-gray-700 leading-relaxed">
                            {achievement}
                          </span>
                        </div>
                      </ScrollAnimation>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation direction="up" delay={0.5}>
          <div className="text-center mt-16">
            <button
              onClick={handleDownloadCV}
              disabled={isGenerating}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-gray-900 rounded-xl font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              <span>{isGenerating ? "Generando PDF..." : "Descargar CV"}</span>
            </button>
          </div>
        </ScrollAnimation>
      </div>

      {/* Hidden container for PDF generation */}
      <div className="hidden">
        <CvTemplate ref={cvRef} data={data as any} />
      </div>
    </section>
  );
};

export default Experience;
