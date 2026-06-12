import { toneForStatus } from "@/lib/utils/format";

export function StatusBadge({ value, tone }: { value: string; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) {
  const resolved = tone ?? toneForStatus(value);
  const className = {
    neutral: "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)]",
    success: "border-emerald-400/30 bg-emerald-500/12 text-emerald-300",
    warning: "border-amber-400/35 bg-amber-500/12 text-amber-300",
    danger: "border-red-400/35 bg-red-500/12 text-red-300",
    info: "border-sky-400/30 bg-sky-500/12 text-sky-300",
  }[resolved];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black ${className}`}>{value}</span>;
}
