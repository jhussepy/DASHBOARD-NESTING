"use client";
import { useEffect, useMemo, useState } from "react";
import { OnboardingData } from "@/lib/types/onboarding";
import { aiAnswer, buildAlerts } from "@/lib/utils/analytics";

const quickCommands = [
  "Dame el resumen de ingresos de hoy",
  "Qué asesores están bloqueados y por qué",
  "Qué asesores no tienen retail activo",
  "Quién no recibió explicación de cancelación de movilidad",
  "Genera reporte para mi superior",
  "Crea mensaje para recordar firma de contrato",
  "Genera constancia de inducción",
  "Qué asesor necesita refuerzo urgente",
  "Genera rebate para “está caro”",
  "Resume incidencias críticas",
];

export function AiCopilot({ data }: { data: OnboardingData }) {
  const [prompt, setPrompt] = useState(quickCommands[0]);
  const [answer, setAnswer] = useState("");
  const alerts = useMemo(() => buildAlerts(data), [data]);
  useEffect(() => setAnswer(aiAnswer(prompt, data)), [data, prompt]);
  return (
    <section id="copiloto-ia" className="overflow-hidden rounded-[2.4rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--surface),var(--surface-soft))] p-5 shadow-[var(--shadow)] lg:p-7">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3"><span className="rounded-2xl bg-[var(--brand)] px-4 py-2 text-sm font-black text-white shadow-[0_14px_40px_rgba(230,0,0,.34)]">Copiloto IA de Coordinación</span><span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold text-[var(--muted)]">Analiza Excel en tiempo real</span></div>
          <h2 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">IA protagonista para priorizar, reportar y desbloquear ingresos.</h2>
          <p className="mt-4 max-w-3xl text-lg text-[var(--muted)]">Genera resúmenes ejecutivos, mensajes, constancias internas, reportes para superiores, rebate comercial y análisis de riesgo usando los datos cargados desde Excel.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Mini title="Alertas detectadas" value={alerts.length} />
            <Mini title="Críticas" value={alerts.filter((item) => item.priority === "critical").length} />
            <Mini title="Acciones IA" value="10" />
          </div>
        </div>
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="min-h-32 w-full resize-none rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm outline-none ring-[var(--brand)]/30 transition focus:ring-4" />
          <button onClick={() => setAnswer(aiAnswer(prompt, data))} className="mt-3 w-full rounded-2xl bg-[var(--brand)] px-4 py-3 font-black text-white shadow-[0_18px_45px_rgba(230,0,0,.28)]">Ejecutar análisis IA</button>
          <div className="mt-3 flex flex-wrap gap-2">{quickCommands.map((command) => <button key={command} onClick={() => setPrompt(command)} className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--text)]">{command}</button>)}</div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_420px]">
        <pre className="min-h-72 whitespace-pre-wrap rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 text-sm leading-7 text-[var(--text)]">{answer}</pre>
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5"><h3 className="text-xl font-black">Acciones recomendadas</h3><div className="mt-4 space-y-3">{alerts.slice(0, 5).map((alert) => <div key={`${alert.advisorId}-${alert.title}`} className="rounded-2xl bg-[var(--surface-soft)] p-3"><p className="font-black">{alert.advisorName}</p><p className="text-sm text-[var(--muted)]">{alert.action}</p></div>)}</div></div>
      </div>
    </section>
  );
}

function Mini({ title, value }: { title: string; value: string | number }) {
  return <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4"><p className="text-3xl font-black">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">{title}</p></div>;
}
