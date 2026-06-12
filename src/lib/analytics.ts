// Compatibility analytics for older imports from legacy analytics module.
// The active dashboard uses "@/lib/utils/analytics" with Excel-backed OnboardingData.
export * from "./utils/analytics";

export function getAlerts(advisors: Array<Record<string, any>>) {
  return advisors
    .filter((advisor) => String(advisor.status ?? advisor.estadoGeneral ?? "").toLowerCase().includes("bloque") || advisor.access?.retail === "Pendiente")
    .map((advisor) => ({
      advisor: advisor.fullName ?? advisor.nombreCompleto ?? "Asesor",
      severity: "alta",
      message: advisor.observations ?? advisor.observaciones ?? "Seguimiento pendiente",
      action: advisor.nextAction ?? advisor.proximaAccion ?? "Revisar caso",
    }));
}

export function getKpis(advisors: Array<Record<string, any>>) {
  const average = advisors.length ? Math.round(advisors.reduce((sum, advisor) => sum + Number(advisor.progress ?? advisor.avance ?? 0), 0) / advisors.length) : 0;
  return [
    { label: "Total asesores nuevos", value: advisors.length, tone: "neutral" },
    { label: "Bloqueados", value: advisors.filter((advisor) => String(advisor.status ?? advisor.estadoGeneral ?? "").toLowerCase().includes("bloque")).length, tone: "danger" },
    { label: "Avance promedio", value: `${average}%`, tone: "neutral" },
  ];
}

export function generateAiResponse(prompt: string, advisors: Array<Record<string, any>>) {
  const blocked = advisors.filter((advisor) => String(advisor.status ?? advisor.estadoGeneral ?? "").toLowerCase().includes("bloque"));
  if (prompt.toLowerCase().includes("bloque")) {
    return blocked.map((advisor) => `• ${advisor.fullName ?? advisor.nombreCompleto}: ${advisor.nextAction ?? advisor.proximaAccion ?? "Revisar caso"}`).join("\n") || "No hay asesores bloqueados.";
  }
  return `Resumen ejecutivo\n\n• Asesores cargados: ${advisors.length}.\n• Bloqueados: ${blocked.length}.\n• Fuente actual recomendada: Excel/API.`;
}
