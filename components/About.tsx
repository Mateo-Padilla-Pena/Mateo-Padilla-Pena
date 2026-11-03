"use client";

import React from "react";
import type { About as AboutType } from "../types/portfolio";
import TechLogo from "./TechLogo";
import ScrollAnimation from "./ScrollAnimation";

interface AboutProps {
  story: string;
  skills: AboutType["skills"];
}

const About: React.FC<AboutProps> = ({ story, skills }) => {
  return (
    <section id="about" className="py-24 px-6 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation direction="down" delay={0.1}>
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
            Sobre <span className="text-blue-600">Mí</span>
          </h2>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <div className="mb-20">
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto text-center font-light">
              {story}
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.3}>
          <div>
            <h3 className="text-2xl font-bold mb-10 text-center text-gray-900">
              Stack <span className="text-blue-600">Tecnológico</span>
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              <ScrollAnimation direction="left" delay={0.4}>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="text-lg font-semibold mb-6 text-gray-900 flex items-center justify-start">
                    <span className="text-xl mr-3">⚙️</span>
                    Backend
                  </h4>
                  <div className="space-y-3">
                    {skills.backend.map((skill, index) => (
                      <ScrollAnimation
                        key={index}
                        direction="left"
                        delay={0.5 + index * 0.03}
                        duration={0.3}
                      >
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                          <TechLogo
                            logo={skill.logo}
                            name={skill.name}
                            className="w-6 h-6 grayscale hover:grayscale-0 transition-all"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {skill.name}
                          </span>
                        </div>
                      </ScrollAnimation>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.4}>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="text-lg font-semibold mb-6 text-gray-900 flex items-center justify-start">
                    <span className="text-xl mr-3">🎨</span>
                    Frontend
                  </h4>
                  <div className="space-y-3">
                    {skills.frontend.map((skill, index) => (
                      <ScrollAnimation
                        key={index}
                        direction="up"
                        delay={0.5 + index * 0.03}
                        duration={0.3}
                      >
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                          <TechLogo
                            logo={skill.logo}
                            name={skill.name}
                            className="w-6 h-6 grayscale hover:grayscale-0 transition-all"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {skill.name}
                          </span>
                        </div>
                      </ScrollAnimation>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right" delay={0.4}>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="text-lg font-semibold mb-6 text-gray-900 flex items-center justify-start">
                    <span className="text-xl mr-3">☁️</span>
                    Servicios & Cloud
                  </h4>
                  <div className="space-y-3">
                    {skills.services.map((skill, index) => (
                      <ScrollAnimation
                        key={index}
                        direction="right"
                        delay={0.5 + index * 0.02}
                        duration={0.25}
                      >
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                          <TechLogo
                            logo={skill.logo}
                            name={skill.name}
                            className="w-6 h-6 grayscale hover:grayscale-0 transition-all"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {skill.name}
                          </span>
                        </div>
                      </ScrollAnimation>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default About;
