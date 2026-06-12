export type ThemeMode = "dark" | "light" | "system";
export type Priority = "critical" | "high" | "medium" | "low";

export interface Advisor {
  id: string;
  nombreCompleto: string;
  identificador: string;
  fechaIngreso: string;
  supervisor: string;
  turno: string;
  campana: string;
  estadoGeneral: string;
  telefono: string;
  correo: string;
  observaciones: string;
  etiquetas: string[];
  avance: number;
  proximaAccion: string;
}

export interface AccessContract {
  advisorId: string;
  usuarioVodafone: string;
  correoInterno: string;
  plataformaFormacion: string;
  retail: string;
  firmaEnvioContrato: string;
  firmaContrato: string;
  fechaSolicitud: string;
  fechaActivacion: string;
  responsableGestion: string;
  incidencias: string;
  estadoBloqueo: string;
  observaciones: string;
}

export interface Induction {
  advisorId: string;
  cancelacionMovilidadExplicada: string;
  fechaExplicacion: string;
  responsableExplico: string;
  confirmacionAsesor: string;
  escalamientoIncidenciasExplicado: string;
  normativaAsistenciaExplicada: string;
  usoHerramientasExplicado: string;
  calidadComercialInicialExplicada: string;
  protocoloComunicacionExplicado: string;
  estadoGeneralInduccion: string;
  observacionesEvidencia: string;
  constanciaInterna: string;
}

export interface Tariff {
  id: string;
  nombreTarifa: string;
  precio: number;
  serviciosIncluidos: string;
  fibra: string;
  lineasMoviles: number;
  gb: string;
  streaming: string;
  permanencia: string;
  condiciones: string;
  argumentoComercial: string;
  perfilClienteIdeal: string;
  objecionesFrecuentes: string;
  rebateRecomendado: string;
  estadoTarifa: string;
  segmento: string;
}

export interface Rebate {
  id: string;
  objecionCliente: string;
  tipoCliente: string;
  respuestaCorta: string;
  respuestaProfesional: string;
  preguntaDiagnostico: string;
  tecnicaCierre: string;
  riesgoCalidad: string;
  ejemploLlamada: string;
}

export interface Training {
  advisorId: string;
  modulo: string;
  checklist: string;
  examenRapido: number;
  practicaComercial: number;
  simulacionLlamada: number;
  avancePorcentual: number;
  notaModulo: number;
  resultadoFinal: string;
}

export interface Quality {
  advisorId: string;
  fechaEvaluacion: string;
  tipoLlamada: string;
  cumpleSaludo: string;
  cumpleOferta: string;
  cumpleCondiciones: string;
  cumpleTratamientoDatos: string;
  cumpleCierreCorrecto: string;
  erroresDetectados: string;
  nota: number;
  requiereRefuerzo: string;
  observaciones: string;
}

export interface Incident {
  id: string;
  advisorId: string;
  fecha: string;
  tipoIncidencia: string;
  prioridad: Priority;
  estado: string;
  descripcion: string;
  responsable: string;
  accionRecomendada: string;
}

export interface CatalogItem {
  catalogo: string;
  valor: string;
  activo: string;
}

export interface DashboardExcelRow {
  indicador: string;
  valor: string | number;
  objetivo: string | number;
  observacion: string;
}

export interface OnboardingData {
  asesores: Advisor[];
  accesosContrato: AccessContract[];
  induccion: Induction[];
  tarifas: Tariff[];
  rebate: Rebate[];
  formacion: Training[];
  calidad: Quality[];
  incidencias: Incident[];
  catalogos: CatalogItem[];
  dashboardExcel: DashboardExcelRow[];
  updatedAt: string;
}

export interface AlertItem {
  advisorId: string;
  advisorName: string;
  title: string;
  detail: string;
  priority: Priority;
  action: string;
}

export interface KpiItem {
  label: string;
  value: string | number;
  icon: string;
  tone: "neutral" | "success" | "warning" | "danger" | "info";
  helper: string;
}
