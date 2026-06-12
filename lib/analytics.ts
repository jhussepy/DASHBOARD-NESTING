import { Advisor } from "./types";

const hoursSince = (iso?: string) => {
  if (!iso) return 0;
  return (Date.now() - new Date(iso).getTime()) / 36e5;
};

export function getAlerts(advisors: Advisor[]) {
  return advisors.flatMap((advisor) => {
    const alerts: { advisor: string; severity: "crítica" | "alta" | "media"; message: string; action: string }[] = [];
    if (["solicitado", "pendiente"].includes(advisor.access.vodafoneUser) && hoursSince(advisor.access.requestDate) > 24) {
      alerts.push({ advisor: advisor.fullName, severity: "alta", message: "Credencial pendiente más de 24 horas", action: "Escalar activación y confirmar responsable." });
    }
    if (["pendiente", "en proceso"].includes(advisor.access.retail) && hoursSince(advisor.access.requestDate) > 48) {
      alerts.push({ advisor: advisor.fullName, severity: "crítica", message: "Retail pendiente más de 48 horas", action: "Priorizar desbloqueo de retail hoy." });
    }
    if (advisor.access.contractDelivery === "enviado" && advisor.access.contractSignature !== "firmado") {
      alerts.push({ advisor: advisor.fullName, severity: "alta", message: "Contrato enviado pero no firmado", action: "Enviar recordatorio y validar dudas." });
    }
    if (advisor.status === "Bloqueado" || advisor.access.vodafoneUser === "bloqueado" || advisor.access.retail === "bloqueado") {
      alerts.push({ advisor: advisor.fullName, severity: "crítica", message: "Asesor bloqueado por falta de acceso", action: advisor.nextAction });
    }
    if (!advisor.access.owner) {
      alerts.push({ advisor: advisor.fullName, severity: "media", message: "Falta responsable asignado", action: "Asignar propietario de gestión." });
    }
    if (advisor.quality.some((item) => item.needsReinforcement || item.score < 70)) {
      alerts.push({ advisor: advisor.fullName, severity: "alta", message: "Riesgo de calidad comercial inicial", action: "Programar refuerzo y nueva simulación." });
    }
    return alerts;
  });
}

export function getKpis(advisors: Advisor[]) {
  const average = Math.round(advisors.reduce((sum, advisor) => sum + advisor.progress, 0) / advisors.length);
  const alerts = getAlerts(advisors);
  return [
    { label: "Total asesores nuevos", value: advisors.length, tone: "neutral" },
    { label: "Pre-ingreso", value: advisors.filter((a) => ["Nuevo ingreso", "En documentación"].includes(a.status)).length, tone: "neutral" },
    { label: "Credenciales pendientes", value: advisors.filter((a) => ["solicitado", "pendiente"].includes(a.access.vodafoneUser)).length, tone: "warning" },
    { label: "Credenciales activas", value: advisors.filter((a) => a.access.vodafoneUser === "activo").length, tone: "success" },
    { label: "Retail pendiente", value: advisors.filter((a) => ["pendiente", "en proceso"].includes(a.access.retail)).length, tone: "warning" },
    { label: "Retail activo", value: advisors.filter((a) => a.access.retail === "activo").length, tone: "success" },
    { label: "Contrato enviado", value: advisors.filter((a) => a.access.contractDelivery === "enviado").length, tone: "warning" },
    { label: "Contrato firmado", value: advisors.filter((a) => a.access.contractSignature === "firmado").length, tone: "success" },
    { label: "En formación", value: advisors.filter((a) => a.status === "En formación").length, tone: "neutral" },
    { label: "Listos producción", value: advisors.filter((a) => a.status === "Listo para producción").length, tone: "success" },
    { label: "Bloqueados", value: advisors.filter((a) => a.status === "Bloqueado").length, tone: "danger" },
    { label: "Con incidencias", value: advisors.filter((a) => a.access.incidents.length > 0 || a.quality.some((q) => q.needsReinforcement)).length, tone: "danger" },
    { label: "Avance promedio", value: `${average}%`, tone: "neutral" },
    { label: "Alertas críticas", value: alerts.filter((a) => a.severity === "crítica").length, tone: "danger" },
  ];
}

export function generateAiResponse(prompt: string, advisors: Advisor[]) {
  const normalized = prompt.toLowerCase();
  const blocked = advisors.filter((a) => a.status === "Bloqueado" || a.access.retail === "bloqueado" || a.access.vodafoneUser === "bloqueado");
  const retailPending = advisors.filter((a) => a.access.retail !== "activo");
  const unsigned = advisors.filter((a) => a.access.contractSignature !== "firmado");
  const mobilityPending = advisors.filter((a) => a.induction.some((item) => item.title.includes("cancelación correcta") && item.status !== "explicado" && item.status !== "reforzado"));
  const alerts = getAlerts(advisors);

  if (normalized.includes("bloque")) {
    return `Análisis de bloqueos\n\n${blocked.length ? blocked.map((a) => `• ${a.fullName}: ${a.observations} Acción: ${a.nextAction}`).join("\n") : "• No hay asesores bloqueados en este momento."}\n\nPrioridad: resolver retail, responsable asignado y firma pendiente antes de ampliar formación.`;
  }
  if (normalized.includes("retail")) {
    return `Asesores sin retail activo\n\n${retailPending.map((a) => `• ${a.fullName}: retail ${a.access.retail}. Responsable: ${a.access.owner ?? "sin asignar"}.`).join("\n")}\n\nRecomendación: ordenar por antigüedad de solicitud y escalar casos con más de 48 horas.`;
  }
  if (normalized.includes("firma") || normalized.includes("contrato")) {
    return `Seguimiento de contrato\n\n${unsigned.map((a) => `• ${a.fullName}: envío ${a.access.contractDelivery}, firma ${a.access.contractSignature}.`).join("\n") || "• Todos los contratos están firmados."}\n\nMensaje sugerido: Hola, te recordamos revisar y firmar el contrato enviado. Si tienes dudas sobre condiciones, avísanos para resolverlas hoy.`;
  }
  if (normalized.includes("cancelación") || normalized.includes("movilidad")) {
    return `Inducción de cancelación de movilidad\n\n${mobilityPending.map((a) => `• ${a.fullName}: requiere constancia o refuerzo del punto de cancelación correcta.`).join("\n") || "• Todos tienen explicación registrada."}\n\nConstancia modelo: El asesor recibió inducción sobre cancelación correcta de movilidad el día ____, explicada por ____. Se deja constancia en el sistema.`;
  }
  if (normalized.includes("reporte") || normalized.includes("resumen")) {
    return `Resumen ejecutivo\n\n• Ingresos activos: ${advisors.length}.\n• Listos para producción: ${advisors.filter((a) => a.status === "Listo para producción").length}.\n• Bloqueados: ${blocked.length}.\n• Retail pendiente: ${retailPending.length}.\n• Contratos pendientes de firma: ${unsigned.length}.\n• Alertas críticas: ${alerts.filter((a) => a.severity === "crítica").length}.\n\nAcción recomendada: atender primero alertas críticas, después formación con nota menor a 70 y finalmente evidencias internas pendientes.`;
  }
  return `Respuesta IA accionable\n\n• Prioridad 1: ${alerts[0]?.advisor ?? "equipo sin bloqueo crítico"} - ${alerts[0]?.message ?? "mantener seguimiento"}.\n• Prioridad 2: revisar asesores con avance menor al 60%.\n• Prioridad 3: completar evidencias de inducción y calidad.\n\nPuedes pedirme: resumen diario, asesores bloqueados, retail pendiente, contrato sin firma, rebate o constancia interna.`;
}
