"use client";
import { OnboardingData, Advisor } from "@/lib/types/onboarding";
import { getAdvisorAccess, getAdvisorIncidents, getAdvisorInduction } from "@/lib/utils/analytics";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export function AdvisorDrawer({ advisor, data, onClose }: { advisor?: Advisor; data: OnboardingData; onClose: () => void }) {
  if (!advisor) return null;
  const access = getAdvisorAccess(data, advisor.id);
  const induction = getAdvisorInduction(data, advisor.id);
  const incidents = getAdvisorIncidents(data, advisor.id);
  const training = data.formacion.filter((item) => item.advisorId === advisor.id);
  const quality = data.calidad.filter((item) => item.advisorId === advisor.id);
  return (
    <div className="fixed inset-0 z-50 bg-black/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <aside className="ml-auto h-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.24em] text-[var(--brand)]">Ficha 360 del asesor</p><h2 className="mt-2 text-3xl font-black">{advisor.nombreCompleto}</h2><p className="mt-1 text-[var(--muted)]">{advisor.identificador} · {advisor.supervisor} · {advisor.campana}</p></div><button onClick={onClose} className="rounded-2xl border border-[var(--border)] px-4 py-2 font-black">Cerrar</button></div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Info title="Datos generales" rows={[['Estado', advisor.estadoGeneral], ['Turno', advisor.turno], ['Ingreso', advisor.fechaIngreso], ['Correo', advisor.correo], ['Teléfono', advisor.telefono], ['Avance', `${advisor.avance}%`]]} />
          <Info title="Accesos y contrato" rows={access ? [['Usuario Vodafone', access.usuarioVodafone], ['Correo interno', access.correoInterno], ['Retail', access.retail], ['Envío contrato', access.firmaEnvioContrato], ['Firma contrato', access.firmaContrato], ['Bloqueo', access.estadoBloqueo]] : [['Sin datos', 'Revisar Excel']]} badges />
          <Info title="Inducción" rows={induction ? [['Movilidad', induction.cancelacionMovilidadExplicada], ['Fecha', induction.fechaExplicacion], ['Responsable', induction.responsableExplico], ['Confirmación', induction.confirmacionAsesor], ['Estado', induction.estadoGeneralInduccion]] : [['Sin datos', 'Revisar Excel']]} badges />
          <Info title="Próxima acción IA" rows={[[advisor.proximaAccion, incidents[0]?.accionRecomendada || 'Mantener seguimiento según avance y calidad.']]} />
        </div>
        <div className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"><h3 className="font-black">Formación</h3>{training.map((item) => <p key={item.modulo} className="mt-2 text-sm text-[var(--muted)]">• {item.modulo}: {item.avancePorcentual}% · nota {item.notaModulo} · {item.resultadoFinal}</p>)}</div>
        <div className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"><h3 className="font-black">Calidad e incidencias</h3>{quality.map((item) => <p key={item.fechaEvaluacion} className="mt-2 text-sm text-[var(--muted)]">• Calidad {item.fechaEvaluacion}: {item.nota}/100 · errores: {item.erroresDetectados || 'sin errores críticos'}</p>)}{incidents.map((item) => <p key={item.id} className="mt-2 text-sm text-[var(--muted)]">• Incidencia {item.tipoIncidencia}: {item.descripcion}</p>)}</div>
      </aside>
    </div>
  );
}

function Info({ title, rows, badges }: { title: string; rows: string[][]; badges?: boolean }) {
  return <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"><h3 className="font-black">{title}</h3><div className="mt-3 grid gap-2">{rows.map(([label, value]) => <div key={`${label}-${value}`} className="flex items-center justify-between gap-3 text-sm"><span className="text-[var(--muted)]">{label}</span>{badges ? <StatusBadge value={value} /> : <strong className="text-right">{value}</strong>}</div>)}</div></div>;
}
