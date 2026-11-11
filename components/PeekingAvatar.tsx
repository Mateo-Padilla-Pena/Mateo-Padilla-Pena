"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const PeekingAvatar: React.FC = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parpadeo suave cada 4.5s
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 130);
    }, 4400);

    return () => clearInterval(blinkInterval);
  }, []);

  // Seguimiento al cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width * 0.52;
      const eyeCenterY = rect.top + rect.height * 0.32;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);

      // Movimiento contenido y suave
      const distance = Math.min(2.5, Math.hypot(deltaX, deltaY) / 45);

      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Detectar scroll para asomarse al salir del Hero, y ocultarse cuando entra la sección Contacto
  useEffect(() => {
    const handleScroll = () => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        const isContactVisible = rect.top < window.innerHeight * 0.75;
        setIsVisible(window.scrollY > 350 && !isContactVisible);
      } else {
        setIsVisible(window.scrollY > 350);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          initial={{ x: -140, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -140, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={handleClick}
          className="hidden md:flex fixed bottom-6 left-0 z-40 items-center cursor-pointer select-none"
          title={language === "es" ? "¡Haz clic para contactarme!" : "Click to get in touch!"}
        >
          {/* Contenedor transparente del avatar 100% visible apoyado sobre el borde izquierdo */}
          <div className="relative w-44 h-44 flex items-center justify-start filter drop-shadow-2xl">
            <div className="relative w-full h-full">
              <img
                src="/avatar-peeking.png"
                alt="Mateo apoyado en el borde"
                className="w-full h-full object-contain pointer-events-none select-none"
              />

              {/* Ojo 1 (Izquierdo / superior con cabeza inclinada: X 41.4% a 49.2%, Y 25.2% a 33.0%) */}
              <div
                className="absolute overflow-hidden rounded-full flex items-center justify-center pointer-events-none"
                style={{
                  left: "41.6%",
                  top: "25.4%",
                  width: "7.6%",
                  height: "7.6%",
                  transformOrigin: "center center",
                  transform: isBlinking ? "scaleY(0.08)" : "scaleY(1)",
                  transition: "transform 0.12s ease-in-out",
                }}
              >
                <motion.div
                  animate={{ x: pupilOffset.x, y: pupilOffset.y }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  className="relative rounded-full bg-[#5d3c22] w-[64%] h-[66%] shadow-inner flex items-start justify-start p-[14%]"
                >
                  <div className="w-[36%] h-[36%] rounded-full bg-white opacity-95" />
                </motion.div>
              </div>

              {/* Ojo 2 (Derecho / inferior con cabeza inclinada: X 53.7% a 61.9%, Y 33.8% a 41.0%) */}
              <div
                className="absolute overflow-hidden rounded-full flex items-center justify-center pointer-events-none"
                style={{
                  left: "53.9%",
                  top: "34.0%",
                  width: "8.0%",
                  height: "7.0%",
                  transformOrigin: "center center",
                  transform: isBlinking ? "scaleY(0.08)" : "scaleY(1)",
                  transition: "transform 0.12s ease-in-out",
                }}
              >
                <motion.div
                  animate={{ x: pupilOffset.x, y: pupilOffset.y }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  className="relative rounded-full bg-[#5d3c22] w-[64%] h-[66%] shadow-inner flex items-start justify-start p-[14%]"
                >
                  <div className="w-[36%] h-[36%] rounded-full bg-white opacity-95" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PeekingAvatar;
