"use client";
import { useThemeMode } from "./ThemeProvider";
import { ThemeMode } from "@/lib/types/onboarding";

const options: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "light", label: "Light", icon: "☀️" },
  { value: "system", label: "Auto", icon: "💻" },
];

export function ThemeSelector() {
  const { mode, setMode } = useThemeMode();
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-1">
      <div className="grid grid-cols-3 gap-1">
        {options.map((option) => (
          <button key={option.value} onClick={() => setMode(option.value)} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${mode === option.value ? "bg-[var(--brand)] text-white shadow-[0_10px_30px_rgba(230,0,0,.28)]" : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"}`}>
            <span aria-hidden>{option.icon}</span> {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
