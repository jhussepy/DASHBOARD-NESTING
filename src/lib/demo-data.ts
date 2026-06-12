// Compatibility demo data for older imports from legacy demo-data module.
// The production dashboard reads Excel through src/lib/excel/onboardingWorkbook.ts.
import { getFallbackOnboardingData } from "./excel/onboardingWorkbook";
import type { DynamicConfig, LegacyAdvisor } from "./types";

const fallback = getFallbackOnboardingData();

export const advisorsSeed: LegacyAdvisor[] = fallback.asesores.map((advisor) => ({
  ...advisor,
  fullName: advisor.nombreCompleto,
  identifier: advisor.identificador,
  entryDate: advisor.fechaIngreso,
  supervisor: advisor.supervisor,
  shift: advisor.turno,
  campaign: advisor.campana,
  status: advisor.estadoGeneral,
  phone: advisor.telefono,
  email: advisor.correo,
  observations: advisor.observaciones,
  tags: advisor.etiquetas,
  progress: advisor.avance,
  nextAction: advisor.proximaAccion,
  access: fallback.accesosContrato.find((access) => access.advisorId === advisor.id),
  induction: fallback.induccion.filter((item) => item.advisorId === advisor.id),
  training: fallback.formacion.filter((item) => item.advisorId === advisor.id),
  quality: fallback.calidad.filter((item) => item.advisorId === advisor.id),
  changes: [],
}));

export const tariffsSeed = fallback.tarifas.map((tariff) => ({
  ...tariff,
  name: tariff.nombreTarifa,
  price: tariff.precio,
  status: tariff.estadoTarifa.toLowerCase(),
  segments: tariff.segmento.split(";").map((segment) => segment.trim()).filter(Boolean),
}));

export const objectionsSeed = fallback.rebate.map((rebate) => ({
  ...rebate,
  objection: rebate.objecionCliente,
  customerType: rebate.tipoCliente,
  shortAnswer: rebate.respuestaCorta,
  professionalAnswer: rebate.respuestaProfesional,
  diagnosticQuestion: rebate.preguntaDiagnostico,
  closingTechnique: rebate.tecnicaCierre,
  qualityRisk: rebate.riesgoCalidad,
  callExample: rebate.ejemploLlamada,
}));

export const dynamicConfigSeed: DynamicConfig = {
  customFields: ["Canal de incorporación", "Nivel de experiencia", "Disponibilidad extra"],
  customStatuses: ["Validación documental", "Producción acompañada"],
  trainingModules: ["Introducción Vodafone", "Tarifas principales", "Retail y accesos", "Contrato y firma", "Calidad comercial"],
  objectionTypes: objectionsSeed.map((item) => item.objection),
  tariffFamilies: ["residencial", "autónomo", "empresa", "low cost", "valor", "fibra", "móvil"],
  checklistTemplates: ["Cancelación correcta de movilidad", "Escalamiento de incidencias", "Normativa de asistencia"],
  incidentTypes: ["Retail pendiente", "Credencial bloqueada", "Contrato sin firma", "Formación incompleta", "Calidad crítica"],
  enabledModules: ["Dashboard", "Asesores", "Accesos", "Inducción", "Tarifas", "Rebate", "Formación", "Calidad", "Incidencias", "Modo TV"],
  aiBaseTexts: ["Responder en tono profesional y accionable", "No solicitar ni registrar contraseñas", "Priorizar bloqueos por impacto operativo"],
};
