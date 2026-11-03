"use client";

import React from "react";
import { Code } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";

interface HeroProps {
  name: string;
  role: string;
  bio: string;
}

const Hero: React.FC<HeroProps> = ({ name, role, bio }) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <ScrollAnimation direction="left" delay={0.3} distance={50}>
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-96 h-[35rem] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xl shadow-blue-900/5">
                <img
                  src="/portfolio-image.jpeg"
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ScrollAnimation>

          {/* Text content */}
          <div className="text-center lg:text-left">
            <ScrollAnimation direction="up" delay={0.1}>
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-gray-900">
                  {name}
                </h1>
                <p className="text-2xl md:text-3xl mb-6 font-medium text-blue-600">
                  {role}
                </p>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 text-gray-600 leading-relaxed font-light">
                  {bio}
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#projects"
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
                >
                  Ver Proyectos
                </a>
                <a
                  href="#contact"
                  className="px-8 py-3 bg-white text-gray-900 rounded-xl font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  Contactar
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
