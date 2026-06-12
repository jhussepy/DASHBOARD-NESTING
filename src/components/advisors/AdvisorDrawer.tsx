"use client";
import { useMemo, useState } from "react";
import { OnboardingData, Advisor } from "@/lib/types/onboarding";
import { generateInductionCertificate, getAdvisorAccess, getAdvisorHistory, getAdvisorIncidents, getAdvisorInduction } from "@/lib/utils/analytics";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const tabs = ["Resumen", "Accesos y contrato", "Retail", "Inducción operativa", "Formación", "Calidad", "Incidencias", "Historial", "Acción recomendada IA"];

export function AdvisorDrawer({ advisor, data, onClose }: { advisor?: Advisor; data: OnboardingData; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [copied, setCopied] = useState(false);
  const access = advisor ? getAdvisorAccess(data, advisor.id) : undefined;
  const induction = advisor ? getAdvisorInduction(data, advisor.id) : undefined;
  const incidents = advisor ? getAdvisorIncidents(data, advisor.id) : [];
  const history = advisor ? getAdvisorHistory(data, advisor.id) : [];
  const training = advisor ? data.formacion.filter((item) => item.advisorId === advisor.id) : [];
  const quality = advisor ? data.calidad.filter((item) => item.advisorId === advisor.id) : [];
  const certificate = useMemo(() => advisor ? generateInductionCertificate(data, advisor.id) : "", [advisor, data]);

  if (!advisor) return null;

  const copyCertificate = async () => {
    await navigator.clipboard?.writeText(certificate);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-3 backdrop-blur-md md:p-5" onClick={onClose}>
      <aside className="ml-auto h-full max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex h-full flex-col">
          <header className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-[var(--brand)]">Ficha 360 avanzada</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">{advisor.nombreCompleto}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{advisor.identificador} · {advisor.supervisor} · {advisor.campana}</p>
              </div>
              <button onClick={onClose} className="rounded-2xl border border-[var(--border)] px-4 py-2 font-black transition hover:bg-[var(--surface-strong)]">Cerrar</button>
            </div>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-2xl px-3 py-2 text-xs font-black transition ${activeTab === tab ? "bg-[var(--brand)] text-white shadow-[0_12px_30px_rgba(230,0,0,.25)]" : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"}`}>{tab}</button>)}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "Resumen" && <div className="grid gap-4 md:grid-cols-2"><Info title="Datos generales" rows={[["Estado", advisor.estadoGeneral], ["Ingreso", advisor.fechaIngreso], ["Turno", advisor.turno], ["Teléfono", advisor.telefono], ["Correo", advisor.correo], ["Avance", `${advisor.avance}%`]]} /><Timeline title="Timeline reciente" rows={history.slice(0, 5).map((item) => [`${item.fecha} · ${item.campoModificado}`, `${item.valorAnterior} → ${item.valorNuevo}`, item.responsable])} /></div>}

            {activeTab === "Accesos y contrato" && <Info title="Estado de accesos y contrato" badges rows={access ? [["Usuario Vodafone", access.usuarioVodafone], ["Correo interno", access.correoInterno], ["Plataforma formación", access.plataformaFormacion], ["Envío contrato", access.firmaEnvioContrato], ["Firma contrato", access.firmaContrato], ["Responsable", access.responsableGestion || "Sin asignar"], ["Bloqueo", access.estadoBloqueo]] : [["Sin datos", "Revisar Excel"]]} />}

            {activeTab === "Retail" && <div className="grid gap-4 md:grid-cols-2"><Info title="Retail operativo" badges rows={access ? [["Estado retail", access.retail], ["Fecha solicitud", access.fechaSolicitud || "Sin fecha"], ["Fecha activación", access.fechaActivacion || "Pendiente"], ["Incidencias", access.incidencias || "Sin incidencias"]] : [["Sin datos", "Revisar Excel"]]} /><Info title="Observaciones" rows={[["Detalle", access?.observaciones || advisor.observaciones || "Sin observaciones"]]} /></div>}

            {activeTab === "Inducción operativa" && <div className="space-y-4"><Info title="Checklist operativo" badges rows={induction ? [["Cancelación movilidad", induction.cancelacionMovilidadExplicada], ["Escalamiento incidencias", induction.escalamientoIncidenciasExplicado], ["Normativa asistencia", induction.normativaAsistenciaExplicada], ["Uso herramientas", induction.usoHerramientasExplicado], ["Calidad inicial", induction.calidadComercialInicialExplicada], ["Comunicación", induction.protocoloComunicacionExplicado], ["Estado general", induction.estadoGeneralInduccion], ["Confirmación", induction.confirmacionAsesor]] : [["Sin datos", "Revisar Excel"]]} /><div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-black">Constancia interna lista para copiar</h3><button onClick={copyCertificate} className="rounded-2xl bg-[var(--brand)] px-4 py-2 text-sm font-black text-white">{copied ? "Copiado" : "Copiar constancia"}</button></div><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{certificate}</p></div></div>}

            {activeTab === "Formación" && <Cards rows={training.map((item) => ({ title: item.modulo, meta: `${item.avancePorcentual}% · nota ${item.notaModulo}`, body: `${item.checklist} · ${item.resultadoFinal}` }))} />}
            {activeTab === "Calidad" && <Cards rows={quality.map((item) => ({ title: `${item.tipoLlamada} · ${item.fechaEvaluacion}`, meta: `${item.nota}/100 · refuerzo ${item.requiereRefuerzo}`, body: item.erroresDetectados || item.observaciones || "Sin errores críticos" }))} />}
            {activeTab === "Incidencias" && <Cards rows={incidents.map((item) => ({ title: item.tipoIncidencia, meta: `${item.prioridad} · ${item.estado} · ${item.responsable}`, body: `${item.descripcion} Acción: ${item.accionRecomendada}` }))} />}
            {activeTab === "Historial" && <Timeline title="Historial de cambios y evidencias" rows={history.map((item) => [`${item.fecha} · ${item.campoModificado}`, `${item.valorAnterior} → ${item.valorNuevo}`, `${item.responsable} · ${item.tipoEvidencia} · ${item.observacion}`])} />}
            {activeTab === "Acción recomendada IA" && <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6"><h3 className="text-xl font-black">Próxima acción recomendada</h3><p className="mt-3 text-lg leading-8">{incidents[0]?.accionRecomendada || advisor.proximaAccion || "Mantener seguimiento operativo según avance, accesos e inducción."}</p><p className="mt-4 text-sm text-[var(--muted)]">Prioriza bloqueos, retail pendiente, firma de contrato, movilidad no explicada, calidad menor a 70 y formación menor a 60.</p></div>}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Info({ title, rows, badges }: { title: string; rows: string[][]; badges?: boolean }) {
  return <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"><h3 className="font-black">{title}</h3><div className="mt-3 grid gap-2">{rows.map(([label, value]) => <div key={`${label}-${value}`} className="flex items-center justify-between gap-3 text-sm"><span className="text-[var(--muted)]">{label}</span>{badges ? <StatusBadge value={value} /> : <strong className="text-right">{value}</strong>}</div>)}</div></div>;
}

function Cards({ rows }: { rows: { title: string; meta: string; body: string }[] }) {
  return <div className="grid gap-3">{rows.length ? rows.map((row) => <article key={`${row.title}-${row.meta}`} className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"><h3 className="font-black">{row.title}</h3><p className="mt-1 text-sm font-bold text-[var(--brand)]">{row.meta}</p><p className="mt-2 text-sm text-[var(--muted)]">{row.body}</p></article>) : <p className="rounded-3xl bg-[var(--surface-soft)] p-5 text-sm text-[var(--muted)]">Sin registros para este apartado.</p>}</div>;
}

function Timeline({ title, rows }: { title: string; rows: string[][] }) {
  return <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"><h3 className="font-black">{title}</h3><div className="mt-4 space-y-4">{rows.length ? rows.map(([head, meta, body]) => <div key={`${head}-${meta}`} className="relative border-l-2 border-[var(--brand)]/40 pl-4"><span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[var(--brand)] shadow-[0_0_18px_rgba(230,0,0,.45)]" /><p className="font-black">{head}</p><p className="text-sm text-[var(--brand)]">{meta}</p><p className="text-sm text-[var(--muted)]">{body}</p></div>) : <p className="text-sm text-[var(--muted)]">Sin historial registrado.</p>}</div></div>;
}
