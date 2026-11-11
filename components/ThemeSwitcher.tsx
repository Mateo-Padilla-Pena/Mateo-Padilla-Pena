"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme, type Theme } from "@/contexts/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center h-8 w-24 rounded-full bg-secondary/50 border border-border animate-pulse" />
    );
  }

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Tema claro", icon: <Sun className="w-3.5 h-3.5" /> },
    { value: "system", label: "Tema del sistema", icon: <Laptop className="w-3.5 h-3.5" /> },
    { value: "dark", label: "Tema oscuro", icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Selector de tema"
      className="inline-flex items-center p-0.5 rounded-full bg-secondary/80 border border-border text-muted-foreground shadow-inner backdrop-blur-sm"
    >
      {options.map((opt) => {
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            onClick={() => setTheme(opt.value)}
            className={`relative p-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? "bg-card text-primary shadow-sm ring-1 ring-border"
                : "hover:text-foreground hover:bg-accent/40"
            }`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}

