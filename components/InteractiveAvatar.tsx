"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface InteractiveAvatarProps {
  className?: string;
  size?: "header" | "hero" | "peeking";
  interactive?: boolean;
}

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  className = "",
  size = "hero",
  interactive = true,
}) => {
  const faceRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Parpadeo suave cada 4.5 segundos
  useEffect(() => {
    if (!interactive) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 140);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, [interactive]);

  // Seguimiento ocular proporcional al tamaño real del contenedor
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!faceRef.current) return;

      const rect = faceRef.current.getBoundingClientRect();
      
      // Centro exacto entre los dos ojos en la ilustración 1024x1024:
      // Ojo Izquierdo: ~41.6% X, 42.0% Y
      // Ojo Derecho: ~58.8% X, 42.0% Y
      // Punto medio horizontal: 50.2% X, vertical: 42.0% Y
      const eyeCenterX = rect.left + rect.width * 0.502;
      const eyeCenterY = rect.top + rect.height * 0.420;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const dist = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      // Recorrido máximo proporcional al ancho y alto del contenedor
      // En 1024px: ancho cuenca ~95px, pupila ~58px -> margen disponible ~18px (~1.75%)
      const maxTravelX = rect.width * 0.017;
      const maxTravelY = rect.height * 0.013;

      // Intensidad suave con atenuación a distancia
      const intensity = Math.min(1, dist / 280);

      const targetX = Math.cos(angle) * maxTravelX * intensity;
      const targetY = Math.sin(angle) * maxTravelY * intensity;

      setPupilOffset({
        x: targetX,
        y: targetY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  // Si es tamaño header (32px), usamos la imagen directa optimizada
  if (size === "header") {
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
        <img
          src="/avatar.jpg"
          alt="Avatar Mateo"
          className="w-full h-full rounded-lg object-cover border border-primary/25 shadow-xs"
        />
      </div>
    );
  }

  return (
    <div className={`relative select-none flex items-center justify-center w-full h-full ${className}`}>
      {/* Contenedor cuadrado estricto 1:1 medido para calibración de ojos */}
      <div
        ref={faceRef}
        className="relative aspect-square w-full max-w-full max-h-full overflow-hidden flex items-center justify-center"
      >
        {/* Imagen base con cuencas oculares blancas limpias */}
        <img
          src="/avatar-base.png"
          alt="Avatar Mateo"
          className="w-full h-full object-cover pointer-events-none select-none"
        />

        {/* Ojo Izquierdo (espectador: cuenca X: ~37.2% a 46.5%, Y: ~38.5% a 45.4%) */}
        <div
          className="absolute overflow-hidden rounded-[45%] flex items-center justify-center pointer-events-none"
          style={{
            left: "37.2%",
            top: "38.5%",
            width: "9.3%",
            height: "6.9%",
            transformOrigin: "center center",
            transform: isBlinking ? "scaleY(0.08)" : "scaleY(1)",
            transition: "transform 0.12s ease-in-out",
          }}
        >
          <motion.div
            animate={{ x: pupilOffset.x, y: pupilOffset.y }}
            transition={{ type: "spring", stiffness: 190, damping: 22, mass: 0.5 }}
            className="relative rounded-full bg-[#422817] w-[62%] h-[68%] shadow-inner flex items-start justify-start p-[15%]"
          >
            {/* Brillo de luz de la pupila */}
            <div className="w-[36%] h-[36%] rounded-full bg-white opacity-95" />
          </motion.div>
        </div>

        {/* Ojo Derecho (espectador: cuenca X: ~54.5% a 63.8%, Y: ~38.5% a 45.4%) */}
        <div
          className="absolute overflow-hidden rounded-[45%] flex items-center justify-center pointer-events-none"
          style={{
            left: "54.5%",
            top: "38.5%",
            width: "9.3%",
            height: "6.9%",
            transformOrigin: "center center",
            transform: isBlinking ? "scaleY(0.08)" : "scaleY(1)",
            transition: "transform 0.12s ease-in-out",
          }}
        >
          <motion.div
            animate={{ x: pupilOffset.x, y: pupilOffset.y }}
            transition={{ type: "spring", stiffness: 190, damping: 22, mass: 0.5 }}
            className="relative rounded-full bg-[#422817] w-[62%] h-[68%] shadow-inner flex items-start justify-start p-[15%]"
          >
            {/* Brillo de luz de la pupila */}
            <div className="w-[36%] h-[36%] rounded-full bg-white opacity-95" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveAvatar;
