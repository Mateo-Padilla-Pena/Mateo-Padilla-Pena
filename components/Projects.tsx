"use client";

import React from "react";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "../types/portfolio";
import ScrollAnimation from "./ScrollAnimation";

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section id="projects" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation direction="down" delay={0.1}>
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
            Mis <span className="text-blue-600">Proyectos</span>
          </h2>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ScrollAnimation
              key={project.id}
              direction="up"
              delay={0.2 + index * 0.1}
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm font-light">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <ScrollAnimation
                        key={techIndex}
                        direction="left"
                        delay={0.3 + index * 0.1 + techIndex * 0.05}
                        distance={20}
                      >
                        <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700">
                          {tech}
                        </span>
                      </ScrollAnimation>
                    ))}
                  </div>

                  <ScrollAnimation
                    direction="right"
                    delay={0.4 + index * 0.1}
                    distance={20}
                  >
                    <div className="text-sm font-semibold text-gray-800 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                      {project.impact}
                    </div>
                  </ScrollAnimation>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
