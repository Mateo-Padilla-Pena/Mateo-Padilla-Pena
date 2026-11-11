"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CrossedAvatarProps {
  className?: string;
}

export const CrossedAvatar: React.FC<CrossedAvatarProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 130);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width * 0.471;
      const eyeCenterY = rect.top + rect.height * 0.34;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);

      // Movimiento muy sutil y controlado (máx 1.0px) para pupilas grandes y relajadas
      const distance = Math.min(1.0, Math.hypot(deltaX, deltaY) / 65);

      const rawX = Math.cos(angle) * distance;
      const rawY = Math.sin(angle) * distance;

      setPupilOffset({
        x: Math.max(-1.0, Math.min(1.0, rawX)),
        y: Math.max(-0.8, Math.min(0.7, rawY)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative select-none flex items-center justify-center ${className}`}
    >
      {/* Contenedor estrictamente 1:1 anclado para que la imagen y los ojos nunca se desfasen */}
      <div className="relative aspect-square max-h-full max-w-full w-auto h-auto flex items-center justify-center overflow-hidden">
        <img
          src="/avatar-crossed.png"
          alt="Mateo cruzado de brazos"
          className="w-full h-full object-cover pointer-events-none select-none block"
        />

        {/* Ojo Izquierdo (X: 41.80%, Y: 31.74%, W: 5.66%, H: 4.59%) */}
        <div
          className="absolute overflow-hidden rounded-full flex items-center justify-center pointer-events-none"
          style={{
            left: "41.70%",
            top: "31.70%",
            width: "5.80%",
            height: "4.70%",
            transformOrigin: "center center",
            transform: isBlinking ? "scaleY(0.08)" : "scaleY(1)",
            transition: "transform 0.12s ease-in-out",
          }}
        >
          <motion.div
            animate={{ x: pupilOffset.x, y: pupilOffset.y }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="relative rounded-full bg-[#5d3c22] w-[66%] h-[72%] shadow-inner flex items-start justify-start p-[14%]"
          >
            {/* Brillo de luz de la pupila */}
            <div className="w-[38%] h-[38%] rounded-full bg-white opacity-95" />
          </motion.div>
        </div>

        {/* Ojo Derecho (X: 52.44%, Y: 31.74%, W: 5.76%, H: 4.59%) */}
        <div
          className="absolute overflow-hidden rounded-full flex items-center justify-center pointer-events-none"
          style={{
            left: "52.40%",
            top: "31.70%",
            width: "5.80%",
            height: "4.70%",
            transformOrigin: "center center",
            transform: isBlinking ? "scaleY(0.08)" : "scaleY(1)",
            transition: "transform 0.12s ease-in-out",
          }}
        >
          <motion.div
            animate={{ x: pupilOffset.x, y: pupilOffset.y }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="relative rounded-full bg-[#5d3c22] w-[66%] h-[72%] shadow-inner flex items-start justify-start p-[14%]"
          >
            {/* Brillo de luz de la pupila */}
            <div className="w-[38%] h-[38%] rounded-full bg-white opacity-95" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CrossedAvatar;
