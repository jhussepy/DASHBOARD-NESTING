import { AccessContract, Advisor, AlertItem, Incident, Induction, KpiItem, OnboardingData } from "@/lib/types/onboarding";
import { isActive, isBlocked, isPending, lower, normalize } from "./format";

const byAdvisor = <T extends { advisorId: string }>(rows: T[]) => new Map(rows.map((row) => [row.advisorId, row]));
const hoursSince = (date: string) => date ? (Date.now() - new Date(date).getTime()) / 36e5 : 0;

export function getAdvisorAccess(data: OnboardingData, advisorId: string) {
  return byAdvisor(data.accesosContrato).get(advisorId);
}

export function getAdvisorInduction(data: OnboardingData, advisorId: string) {
  return byAdvisor(data.induccion).get(advisorId);
}

export function getAdvisorIncidents(data: OnboardingData, advisorId: string) {
  return data.incidencias.filter((incident) => incident.advisorId === advisorId);
}

export function buildAlerts(data: OnboardingData): AlertItem[] {
  const accessMap = byAdvisor(data.accesosContrato);
  const inductionMap = byAdvisor(data.induccion);
  return data.asesores.flatMap((advisor) => {
    const access = accessMap.get(advisor.id);
    const induction = inductionMap.get(advisor.id);
    const incidents = getAdvisorIncidents(data, advisor.id);
    const alerts: AlertItem[] = [];

    if (!access) {
      alerts.push({ advisorId: advisor.id, advisorName: advisor.nombreCompleto, title: "Sin registro de accesos", detail: "No existe fila asociada en Accesos_Contrato.", priority: "high", action: "Crear registro de accesos y asignar responsable." });
      return alerts;
    }

    if (isPending(access.usuarioVodafone) && hoursSince(access.fechaSolicitud) > 24) {
      alerts.push({ advisorId: advisor.id, advisorName: advisor.nombreCompleto, title: "Credencial pendiente más de 24 horas", detail: `Usuario Vodafone: ${access.usuarioVodafone}.`, priority: "high", action: "Escalar activación y confirmar fecha objetivo." });
    }
    if (isPending(access.retail) && hoursSince(access.fechaSolicitud) > 48) {
      alerts.push({ advisorId: advisor.id, advisorName: advisor.nombreCompleto, title: "Retail pendiente más de 48 horas", detail: `Retail: ${access.retail}.`, priority: "critical", action: "Priorizar desbloqueo de retail antes del cierre del día." });
    }
    if (lower(access.firmaEnvioContrato).includes("enviado") && !isActive(access.firmaContrato)) {
      alerts.push({ advisorId: advisor.id, advisorName: advisor.nombreCompleto, title: "Contrato enviado sin firma", detail: `Firma del contrato: ${access.firmaContrato}.`, priority: "high", action: "Enviar recordatorio y resolver dudas contractuales." });
    }
    if (isBlocked(access.estadoBloqueo) || isBlocked(advisor.estadoGeneral)) {
      alerts.push({ advisorId: advisor.id, advisorName: advisor.nombreCompleto, title: "Asesor bloqueado", detail: access.incidencias || advisor.observaciones, priority: "critical", action: advisor.proximaAccion || "Asignar responsable y abrir seguimiento inmediato." });
    }
    if (!normalize(access.responsableGestion)) {
      alerts.push({ advisorId: advisor.id, advisorName: advisor.nombreCompleto, title: "Falta responsable de gestión", detail: "El caso no tiene propietario operativo.", priority: "medium", action: "Asignar responsable en la hoja Accesos_Contrato." });
    }
    if (induction && !isActive(induction.cancelacionMovilidadExplicada)) {
      alerts.push({ advisorId: advisor.id, advisorName: advisor.nombreCompleto, title: "Movilidad sin explicación confirmada", detail: `Estado inducción: ${induction.estadoGeneralInduccion}.`, priority: "high", action: "Generar constancia y reforzar cancelación correcta de movilidad." });
    }
    incidents.filter((incident) => incident.prioridad === "critical" || incident.prioridad === "high").forEach((incident) => {
      alerts.push({ advisorId: advisor.id, advisorName: advisor.nombreCompleto, title: incident.tipoIncidencia, detail: incident.descripcion, priority: incident.prioridad, action: incident.accionRecomendada });
    });
    return alerts;
  });
}

export function buildKpis(data: OnboardingData): KpiItem[] {
  const accessMap = byAdvisor(data.accesosContrato);
  const inductionMap = byAdvisor(data.induccion);
  const alerts = buildAlerts(data);
  const advisors = data.asesores;
  const avg = advisors.length ? Math.round(advisors.reduce((sum, advisor) => sum + advisor.avance, 0) / advisors.length) : 0;
  const accessValues = advisors.map((advisor) => accessMap.get(advisor.id)).filter(Boolean) as AccessContract[];
  const inductionValues = advisors.map((advisor) => inductionMap.get(advisor.id)).filter(Boolean) as Induction[];

  return [
    { label: "Total asesores nuevos", value: advisors.length, icon: "👥", tone: "info", helper: "Ingresos cargados desde Excel" },
    { label: "Pre-ingreso", value: advisors.filter((a) => ["nuevo ingreso", "en documentación", "pre-ingreso"].includes(lower(a.estadoGeneral))).length, icon: "🧭", tone: "neutral", helper: "Documentación inicial" },
    { label: "Credenciales pendientes", value: accessValues.filter((a) => isPending(a.usuarioVodafone)).length, icon: "⏳", tone: "warning", helper: "Usuario Vodafone no activo" },
    { label: "Credenciales activas", value: accessValues.filter((a) => isActive(a.usuarioVodafone)).length, icon: "🔐", tone: "success", helper: "Operativo validado" },
    { label: "Retail pendiente", value: accessValues.filter((a) => !isActive(a.retail)).length, icon: "🏬", tone: "warning", helper: "Requiere seguimiento" },
    { label: "Retail activo", value: accessValues.filter((a) => isActive(a.retail)).length, icon: "✅", tone: "success", helper: "Listo para operar" },
    { label: "Contrato enviado", value: accessValues.filter((a) => lower(a.firmaEnvioContrato).includes("enviado")).length, icon: "📨", tone: "info", helper: "Pendiente de firma si aplica" },
    { label: "Contrato firmado", value: accessValues.filter((a) => isActive(a.firmaContrato)).length, icon: "✍️", tone: "success", helper: "Contrato confirmado" },
    { label: "En formación", value: advisors.filter((a) => lower(a.estadoGeneral).includes("formación")).length, icon: "🎓", tone: "info", helper: "Ruta comercial activa" },
    { label: "Listos para producción", value: advisors.filter((a) => lower(a.estadoGeneral).includes("listo")).length, icon: "🚀", tone: "success", helper: "Producción inicial" },
    { label: "Bloqueados", value: advisors.filter((a) => isBlocked(a.estadoGeneral)).length + accessValues.filter((a) => isBlocked(a.estadoBloqueo)).length, icon: "⛔", tone: "danger", helper: "Impacto directo" },
    { label: "Con incidencias", value: data.incidencias.filter((i) => !["cerrada", "resuelta"].includes(lower(i.estado))).length, icon: "⚠️", tone: "danger", helper: "Abiertas o en curso" },
    { label: "Avance promedio", value: `${avg}%`, icon: "📈", tone: "info", helper: "Promedio onboarding" },
    { label: "Inducción movilidad pendiente", value: inductionValues.filter((i) => !isActive(i.cancelacionMovilidadExplicada)).length, icon: "🚌", tone: "warning", helper: "Necesita constancia" },
    { label: "Alertas críticas", value: alerts.filter((a) => a.priority === "critical").length, icon: "🔥", tone: "danger", helper: "Atención inmediata" },
  ];
}

export function aiAnswer(prompt: string, data: OnboardingData) {
  const text = lower(prompt);
  const alerts = buildAlerts(data);
  const blocked = data.asesores.filter((advisor) => isBlocked(advisor.estadoGeneral) || isBlocked(getAdvisorAccess(data, advisor.id)?.estadoBloqueo));
  const withoutRetail = data.asesores.filter((advisor) => !isActive(getAdvisorAccess(data, advisor.id)?.retail));
  const unsigned = data.asesores.filter((advisor) => !isActive(getAdvisorAccess(data, advisor.id)?.firmaContrato));
  const mobilityPending = data.asesores.filter((advisor) => !isActive(getAdvisorInduction(data, advisor.id)?.cancelacionMovilidadExplicada));
  const qualityRisk = data.calidad.filter((row) => lower(row.requiereRefuerzo) === "sí" || row.nota < 70);

  if (text.includes("bloque")) {
    return `Análisis de asesores bloqueados\n\n${blocked.map((advisor) => `• ${advisor.nombreCompleto}: ${getAdvisorAccess(data, advisor.id)?.incidencias || advisor.observaciones}. Acción: ${advisor.proximaAccion}`).join("\n") || "• No hay bloqueos activos."}\n\nPrioridad: resolver retail, responsable asignado y firma pendiente antes de ampliar formación.`;
  }
  if (text.includes("retail")) {
    return `Asesores sin retail activo\n\n${withoutRetail.map((advisor) => `• ${advisor.nombreCompleto}: ${getAdvisorAccess(data, advisor.id)?.retail || "sin dato"}. Responsable: ${getAdvisorAccess(data, advisor.id)?.responsableGestion || "sin asignar"}.`).join("\n") || "• Todos tienen retail activo."}`;
  }
  if (text.includes("movilidad") || text.includes("inducción") || text.includes("constancia")) {
    return `Constancias de inducción operativa\n\n${mobilityPending.map((advisor) => `• ${advisor.nombreCompleto}: pendiente registrar explicación de cancelación correcta de movilidad.`).join("\n") || "• Todos tienen explicación de movilidad registrada."}\n\nModelo: Se deja constancia de que el asesor recibió explicación sobre cancelación correcta de movilidad el día ____, explicada por ____. El asesor confirmó recepción de la información.`;
  }
  if (text.includes("firma") || text.includes("contrato")) {
    return `Seguimiento de firma de contrato\n\n${unsigned.map((advisor) => `• ${advisor.nombreCompleto}: firma ${getAdvisorAccess(data, advisor.id)?.firmaContrato || "sin dato"}.`).join("\n") || "• Todos los contratos figuran firmados."}\n\nMensaje sugerido: Hola, te recordamos revisar y firmar el contrato enviado. Si tienes cualquier duda, avísanos para resolverla hoy.`;
  }
  if (text.includes("refuerzo") || text.includes("calidad")) {
    return `Refuerzo urgente\n\n${qualityRisk.map((item) => `• ${data.asesores.find((a) => a.id === item.advisorId)?.nombreCompleto}: nota ${item.nota}. Errores: ${item.erroresDetectados}.`).join("\n") || "• No hay asesores con refuerzo urgente por calidad."}`;
  }
  if (text.includes("rebate") || text.includes("caro")) {
    const item = data.rebate.find((row) => lower(row.objecionCliente).includes("caro"));
    return `Rebate para “está caro”\n\n• Respuesta corta: ${item?.respuestaCorta || "Validar preocupación y comparar valor total."}\n• Pregunta de diagnóstico: ${item?.preguntaDiagnostico || "¿Qué pagas actualmente por todos tus servicios?"}\n• Técnica de cierre: ${item?.tecnicaCierre || "Comparación de valor."}\n• Riesgo de calidad: ${item?.riesgoCalidad || "No prometer descuentos no confirmados."}`;
  }
  if (text.includes("incidencias")) {
    return `Incidencias críticas\n\n${data.incidencias.filter((i) => i.prioridad === "critical" || i.prioridad === "high").map((i) => `• ${data.asesores.find((a) => a.id === i.advisorId)?.nombreCompleto}: ${i.tipoIncidencia} — ${i.accionRecomendada}`).join("\n") || "• No hay incidencias críticas abiertas."}`;
  }
  return `Resumen ejecutivo de onboarding\n\n• Asesores cargados: ${data.asesores.length}.\n• Listos para producción: ${data.asesores.filter((a) => lower(a.estadoGeneral).includes("listo")).length}.\n• Bloqueados: ${blocked.length}.\n• Sin retail activo: ${withoutRetail.length}.\n• Contratos sin firma: ${unsigned.length}.\n• Alertas críticas: ${alerts.filter((a) => a.priority === "critical").length}.\n\nAcciones recomendadas: atender bloqueos críticos, completar constancias de movilidad y reforzar calidad con nota menor a 70.`;
}
