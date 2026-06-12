import { AlertItem } from "@/lib/types/onboarding";
import { StatusBadge } from "./StatusBadge";

export function AlertsPanel({ alerts, onOpen }: { alerts: AlertItem[]; onOpen: (advisorId: string) => void }) {
  return (
    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between"><h3 className="text-xl font-black">Alertas críticas</h3><span className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-black text-white">{alerts.length}</span></div>
      <div className="mt-5 grid gap-3">
        {alerts.slice(0, 8).map((alert, index) => (
          <button key={`${alert.advisorId}-${alert.title}-${index}`} onClick={() => onOpen(alert.advisorId)} className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--brand)]/50">
            <div className="flex flex-wrap items-center gap-2"><StatusBadge value={alert.priority} tone={alert.priority === "critical" ? "danger" : alert.priority === "high" ? "warning" : "info"} /><strong>{alert.advisorName}</strong></div>
            <p className="mt-2 text-sm font-bold">{alert.title}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{alert.detail}</p>
            <p className="mt-2 text-sm text-[var(--brand)]">Acción: {alert.action}</p>
          </button>
        ))}
        {!alerts.length && <p className="rounded-3xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted)]">Sin alertas abiertas desde Excel.</p>}
      </div>
    </div>
  );
}
