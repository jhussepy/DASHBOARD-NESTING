"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Advisor, OnboardingData } from "@/lib/types/onboarding";
import { buildAlerts, buildKpis } from "@/lib/utils/analytics";
import { Shell } from "@/components/layout/Shell";
import { KpiGrid } from "./KpiGrid";
import { ProgressBars } from "./ProgressBars";
import { AlertsPanel } from "./AlertsPanel";
import { AiCopilot } from "@/components/ai/AiCopilot";
import { DataTable } from "@/components/tables/DataTable";
import { AdvisorDrawer } from "@/components/advisors/AdvisorDrawer";
import { TvMode } from "./TvMode";
import { StatusBadge } from "./StatusBadge";

export function CommandCenter({ initialData }: { initialData: OnboardingData }) {
  const [data, setData] = useState(initialData);
  const [syncing, setSyncing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState<0 | 30 | 60>(0);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | undefined>();
  const kpis = useMemo(() => buildKpis(data), [data]);
  const alerts = useMemo(() => buildAlerts(data), [data]);

  const sync = useCallback(async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/onboarding", { cache: "no-store" });
      if (!response.ok) throw new Error("No se pudo sincronizar Excel");
      setData(await response.json());
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(sync, autoRefresh * 1000);
    return () => window.clearInterval(id);
  }, [autoRefresh, sync]);

  const openAdvisorById = (advisorId: string) => setSelectedAdvisor(data.asesores.find((advisor) => advisor.id === advisorId));
  const printReport = (title: string, body: string) => {
    const popup = window.open("", "_blank", "width=900,height=700");
    popup?.document.write(`<html><head><title>${title}</title><style>body{font-family:Arial;padding:32px;line-height:1.5}h1{color:#e60000}</style></head><body><h1>${title}</h1><pre style="white-space:pre-wrap">${body}</pre></body></html>`);
    popup?.document.close();
    popup?.print();
  };
  const exportCsv = (filename: string, rows: Array<Record<string, unknown>>) => {
    const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
    const csv = [keys.join(","), ...rows.map((row) => keys.map((key) => `"${String(row[key] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Shell updatedAt={data.updatedAt} onSync={sync} syncing={syncing}>
      <div className="space-y-8">
        <header className="overflow-hidden rounded-[2.4rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--surface),var(--surface-soft))] p-7 shadow-[var(--shadow)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <span className="rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-white shadow-[0_14px_40px_rgba(230,0,0,.28)]">Command center corporativo</span>
              <h1 className="mt-5 max-w-5xl text-5xl font-black tracking-[-.06em] md:text-7xl">Vodafone Onboarding Command Center</h1>
              <p className="mt-4 max-w-4xl text-lg leading-8 text-[var(--muted)]">Sistema premium de coordinación para ingresos, accesos operativos, retail, contrato, inducción, formación, calidad, incidencias y producción inicial. Fuente editable: Excel local.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <HeroStat label="Asesores" value={data.asesores.length} />
              <HeroStat label="Alertas" value={alerts.length} />
              <div className="rounded-3xl bg-[var(--brand)] p-5 text-white"><p className="text-4xl font-black">IA</p><p className="mt-1 text-sm font-bold text-white/80">Protagonista</p></div>
            </div>
          </div>
        </header>

        {data.source === "fallback" && (
          <div className="rounded-[2rem] border border-amber-400/40 bg-amber-500/15 p-5 shadow-[var(--shadow)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[.18em] text-amber-500">Datos fallback activos</p>
                <h2 className="mt-1 text-2xl font-black">Excel local no encontrado</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{data.warning ?? "Excel no encontrado. Ejecuta npm run create:workbook."}</p>
              </div>
              <button onClick={sync} className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-black text-white">Sincronizar Excel</button>
            </div>
          </div>
        )}

        <AiCopilot data={data} />

        <section id="control" className="space-y-5">
          <SectionTitle title="Dashboard general" subtitle="KPIs sincronizados desde Excel, semáforos, ranking y panel de alertas críticas." />
          <div className="flex flex-wrap items-center gap-3 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
            <button onClick={sync} className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-black text-white">Sincronizar Excel</button>
            <select value={autoRefresh} onChange={(event) => setAutoRefresh(Number(event.target.value) as 0 | 30 | 60)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-bold outline-none">
              <option value={0}>Auto-refresh desactivado</option><option value={30}>Auto-refresh cada 30 segundos</option><option value={60}>Auto-refresh cada 60 segundos</option>
            </select>
            <span className="text-sm text-[var(--muted)]">Al modificar y guardar el Excel, pulsa sincronizar para actualizar KPIs, tablas, ranking, alertas e IA.</span>
          </div>
          {syncing && <div className="grid gap-3 md:grid-cols-3"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div>}
          <KpiGrid items={kpis} />
          <div className="grid gap-5 xl:grid-cols-[1fr_1fr]"><ProgressBars advisors={data.asesores} /><AlertsPanel alerts={alerts} onOpen={openAdvisorById} /></div>
        </section>

        <section id="exportaciones" className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black">Exportaciones operativas</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Genera reportes listos para imprimir o compartir sin guardar información sensible.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => printReport("Reporte diario Vodafone", `Asesores: ${data.asesores.length}\nBloqueados: ${data.asesores.filter((a) => a.estadoGeneral.toLowerCase().includes("bloque")).length}\nIncidencias abiertas: ${data.incidencias.length}\nActualizado: ${new Date(data.updatedAt).toLocaleString("es-ES")}`)} className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-black text-white">Exportar reporte diario PDF</button>
              <button onClick={() => exportCsv("asesores_bloqueados.csv", data.asesores.filter((advisor) => advisor.estadoGeneral.toLowerCase().includes("bloque")) as unknown as Array<Record<string, unknown>>)} className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-black">Exportar bloqueados Excel</button>
              <button onClick={() => printReport("Inducción pendiente", data.induccion.filter((item) => item.cancelacionMovilidadExplicada.toLowerCase() !== "explicado").map((item) => `${data.asesores.find((advisor) => advisor.id === item.advisorId)?.nombreCompleto ?? item.advisorId}: ${item.estadoGeneralInduccion}`).join("\n") || "Sin inducciones pendientes.")} className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-black">Exportar inducción PDF</button>
            </div>
          </div>
        </section>

        <div id="asesores"><DataTable title="Asesores" subtitle="Buscador, ordenamiento, vista compacta/detallada y ficha 360." rows={data.asesores as unknown as Record<string, unknown>[]} columns={[
          { key: "nombre", header: "Asesor", value: (row) => <div><strong>{String(row.nombreCompleto)}</strong><p className="text-xs text-[var(--muted)]">{String(row.identificador)} · {String(row.correo)}</p></div>, sortValue: (row) => String(row.nombreCompleto) },
          { key: "fecha", header: "Ingreso", value: (row) => String(row.fechaIngreso) },
          { key: "supervisor", header: "Supervisor", value: (row) => String(row.supervisor) },
          { key: "estado", header: "Estado", value: (row) => String(row.estadoGeneral), badge: true },
          { key: "avance", header: "Avance", value: (row) => `${String(row.avance)}%`, sortValue: (row) => Number(row.avance) },
          { key: "accion", header: "Próxima acción", value: (row) => String(row.proximaAccion), compact: true },
        ]} onOpen={(row) => setSelectedAdvisor(row as unknown as Advisor)} /></div>

        <div id="accesos"><DataTable title="Accesos y contrato" subtitle="Usuario Vodafone, correo interno, plataforma, retail, firma, bloqueo e incidencias." rows={data.accesosContrato as unknown as Record<string, unknown>[]} columns={[
          { key: "advisorId", header: "Asesor", value: (row) => data.asesores.find((a) => a.id === row.advisorId)?.nombreCompleto ?? String(row.advisorId) },
          { key: "usuario", header: "Usuario Vodafone", value: (row) => String(row.usuarioVodafone), badge: true },
          { key: "correo", header: "Correo interno", value: (row) => String(row.correoInterno), badge: true },
          { key: "formacion", header: "Plataforma", value: (row) => String(row.plataformaFormacion), badge: true },
          { key: "retail", header: "Retail", value: (row) => String(row.retail), badge: true },
          { key: "envio", header: "Envío contrato", value: (row) => String(row.firmaEnvioContrato), badge: true },
          { key: "firma", header: "Firma contrato", value: (row) => String(row.firmaContrato), badge: true },
          { key: "responsable", header: "Responsable", value: (row) => String(row.responsableGestion || "Sin asignar") },
          { key: "bloqueo", header: "Bloqueo", value: (row) => String(row.estadoBloqueo), badge: true },
        ]} onOpen={(row) => openAdvisorById(String(row.advisorId))} /></div>

        <div id="inducción"><DataTable title="Inducción Operativa y Evidencias" subtitle="Movilidad, escalamiento, asistencia, herramientas, calidad, comunicación y constancia interna." rows={data.induccion as unknown as Record<string, unknown>[]} columns={[
          { key: "advisorId", header: "Asesor", value: (row) => data.asesores.find((a) => a.id === row.advisorId)?.nombreCompleto ?? String(row.advisorId) },
          { key: "movilidad", header: "Movilidad", value: (row) => String(row.cancelacionMovilidadExplicada), badge: true },
          { key: "fecha", header: "Fecha explicación", value: (row) => String(row.fechaExplicacion || "Pendiente") },
          { key: "responsable", header: "Responsable", value: (row) => String(row.responsableExplico || "Pendiente") },
          { key: "confirmacion", header: "Confirmación", value: (row) => String(row.confirmacionAsesor), badge: true },
          { key: "escalamiento", header: "Escalamiento", value: (row) => String(row.escalamientoIncidenciasExplicado), badge: true },
          { key: "estado", header: "Estado general", value: (row) => String(row.estadoGeneralInduccion), badge: true },
          { key: "constancia", header: "Constancia", value: (row) => String(row.constanciaInterna || "IA puede generarla"), compact: true },
        ]} onOpen={(row) => openAdvisorById(String(row.advisorId))} /></div>

        <div id="tarifas"><DataTable title="Tarifas" subtitle="Biblioteca dinámica con búsqueda, segmentos y argumentario comercial." rows={data.tarifas as unknown as Record<string, unknown>[]} columns={[
          { key: "nombre", header: "Tarifa", value: (row) => <strong>{String(row.nombreTarifa)}</strong> },
          { key: "precio", header: "Precio", value: (row) => `${String(row.precio)}€`, sortValue: (row) => Number(row.precio) },
          { key: "fibra", header: "Fibra", value: (row) => String(row.fibra) },
          { key: "gb", header: "GB", value: (row) => String(row.gb) },
          { key: "estado", header: "Estado", value: (row) => String(row.estadoTarifa), badge: true },
          { key: "argumento", header: "Argumento", value: (row) => String(row.argumentoComercial), compact: true },
          { key: "rebate", header: "Rebate", value: (row) => String(row.rebateRecomendado), compact: true },
        ]} /></div>

        <div id="rebate"><DataTable title="Rebate" subtitle="Objeciones, respuestas, diagnóstico, cierre, riesgo de calidad y ejemplos." rows={data.rebate as unknown as Record<string, unknown>[]} columns={[
          { key: "objecion", header: "Objeción", value: (row) => <strong>{String(row.objecionCliente)}</strong> },
          { key: "tipo", header: "Tipo cliente", value: (row) => String(row.tipoCliente) },
          { key: "corta", header: "Respuesta corta", value: (row) => String(row.respuestaCorta) },
          { key: "pregunta", header: "Pregunta", value: (row) => String(row.preguntaDiagnostico), compact: true },
          { key: "cierre", header: "Cierre", value: (row) => String(row.tecnicaCierre), compact: true },
          { key: "riesgo", header: "Riesgo", value: (row) => String(row.riesgoCalidad), compact: true },
        ]} /></div>

        <div id="formación"><DataTable title="Formación" subtitle="Módulos, checklist, prácticas, simulaciones, avance, nota y resultado final." rows={data.formacion as unknown as Record<string, unknown>[]} columns={[
          { key: "advisor", header: "Asesor", value: (row) => data.asesores.find((a) => a.id === row.advisorId)?.nombreCompleto ?? String(row.advisorId) },
          { key: "modulo", header: "Módulo", value: (row) => String(row.modulo) },
          { key: "avance", header: "Avance", value: (row) => `${String(row.avancePorcentual)}%`, sortValue: (row) => Number(row.avancePorcentual) },
          { key: "nota", header: "Nota", value: (row) => String(row.notaModulo), sortValue: (row) => Number(row.notaModulo) },
          { key: "resultado", header: "Resultado", value: (row) => String(row.resultadoFinal), badge: true },
          { key: "checklist", header: "Checklist", value: (row) => String(row.checklist), compact: true },
        ]} onOpen={(row) => openAdvisorById(String(row.advisorId))} /></div>

        <div id="calidad"><DataTable title="Calidad" subtitle="Control inicial de saludo, oferta, condiciones, datos, cierre, errores y refuerzo." rows={data.calidad as unknown as Record<string, unknown>[]} columns={[
          { key: "advisor", header: "Asesor", value: (row) => data.asesores.find((a) => a.id === row.advisorId)?.nombreCompleto ?? String(row.advisorId) },
          { key: "fecha", header: "Fecha", value: (row) => String(row.fechaEvaluacion) },
          { key: "tipo", header: "Tipo", value: (row) => String(row.tipoLlamada) },
          { key: "nota", header: "Nota", value: (row) => String(row.nota), sortValue: (row) => Number(row.nota) },
          { key: "refuerzo", header: "Refuerzo", value: (row) => String(row.requiereRefuerzo), badge: true },
          { key: "errores", header: "Errores", value: (row) => String(row.erroresDetectados || "Sin errores críticos"), compact: true },
        ]} onOpen={(row) => openAdvisorById(String(row.advisorId))} /></div>

        <div id="incidencias"><DataTable title="Incidencias" subtitle="Prioridad, estado, responsable y acción recomendada." rows={data.incidencias as unknown as Record<string, unknown>[]} columns={[
          { key: "advisor", header: "Asesor", value: (row) => data.asesores.find((a) => a.id === row.advisorId)?.nombreCompleto ?? String(row.advisorId) },
          { key: "tipo", header: "Tipo", value: (row) => String(row.tipoIncidencia) },
          { key: "prioridad", header: "Prioridad", value: (row) => String(row.prioridad), badge: true },
          { key: "estado", header: "Estado", value: (row) => String(row.estado), badge: true },
          { key: "responsable", header: "Responsable", value: (row) => String(row.responsable) },
          { key: "accion", header: "Acción", value: (row) => String(row.accionRecomendada), compact: true },
        ]} onOpen={(row) => openAdvisorById(String(row.advisorId))} /></div>

        <TvMode data={data} />
      </div>
      <AdvisorDrawer advisor={selectedAdvisor} data={data} onClose={() => setSelectedAdvisor(undefined)} />
    </Shell>
  );
}

function HeroStat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"><p className="text-4xl font-black">{value}</p><p className="mt-1 text-sm font-bold text-[var(--muted)]">{label}</p></div>;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <div><h2 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h2><p className="mt-2 text-[var(--muted)]">{subtitle}</p></div>;
}
