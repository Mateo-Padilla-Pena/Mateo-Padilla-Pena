"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const applyTheme = (newTheme: Theme) => {
    const isDark =
      newTheme === "dark" ||
      (newTheme === "system" && getSystemTheme() === "dark");

    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      setResolvedTheme("dark");
    } else {
      root.classList.remove("dark");
      setResolvedTheme("light");
    }

    // Keep meta color-scheme in sync (per modern web guidance)
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute(
        "content",
        newTheme === "system" ? "light dark" : newTheme
      );
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme") as Theme | null;
    const initialTheme: Theme =
      saved === "light" || saved === "dark" || saved === "system"
        ? saved
        : "system";

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      const current = localStorage.getItem("portfolio-theme") as Theme | null;
      if (!current || current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "portfolio-theme") {
        const updated = (e.newValue as Theme) || "system";
        setThemeState(updated);
        applyTheme(updated);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

