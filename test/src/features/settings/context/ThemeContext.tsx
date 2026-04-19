"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "mono" | "sepia" | "forest" | "slate";

export const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: "mono",   label: "Mono",   color: "#0a0a0a" },
  { id: "sepia",  label: "Sepia",  color: "#5c4a2a" },
  { id: "forest", label: "Forest", color: "#2d6a2d" },
  { id: "slate",  label: "Slate",  color: "#1e2433" },
];

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "mono", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("mono");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && THEMES.find((t) => t.id === stored)) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
