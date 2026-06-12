"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeMode } from "@/lib/types/onboarding";

interface ThemeContextValue { mode: ThemeMode; setMode: (mode: ThemeMode) => void; resolved: "dark" | "light"; }
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("vodafone-command-theme") as ThemeMode | null;
    if (saved) setModeState(saved);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next = mode === "system" ? (query.matches ? "dark" : "light") : mode;
      setResolved(next);
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [mode]);

  const value = useMemo(() => ({ mode, resolved, setMode: (next: ThemeMode) => { localStorage.setItem("vodafone-command-theme", next); setModeState(next); } }), [mode, resolved]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeMode must be used inside ThemeProvider");
  return context;
}
