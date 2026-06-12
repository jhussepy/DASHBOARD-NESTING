export type OperationalStatus = "no solicitado" | "solicitado" | "pendiente" | "activo" | "bloqueado" | "requiere soporte";
export type ContractDeliveryStatus = "pendiente" | "enviado" | "confirmado";
export type ContractSignatureStatus = "pendiente" | "firmado" | "rechazado" | "incidencia";
export type RetailStatus = "pendiente" | "en proceso" | "activo" | "bloqueado";
export type AdvisorStatus =
  | "Nuevo ingreso"
  | "En documentación"
  | "Pendiente de contrato"
  | "Contrato enviado"
  | "Contrato firmado"
  | "Credenciales pendientes"
  | "Retail pendiente"
  | "En formación"
  | "Listo para producción"
  | "Bloqueado"
  | "Baja / No continúa";
export type InductionStatus = "pendiente" | "explicado" | "reforzado" | "requiere nueva explicación";
export type TrainingResult = "apto" | "necesita refuerzo" | "bloqueado";

export interface ChangeLogEntry {
  date: string;
  author: string;
  action: string;
  note: string;
}

export interface Evidence {
  id: string;
  date: string;
  type: string;
  description: string;
  owner: string;
}

export interface AccessControl {
  vodafoneUser: OperationalStatus;
  corporateAccess: OperationalStatus;
  learningPlatform: "no solicitado" | "activo" | "pendiente";
  retail: RetailStatus;
  contractDelivery: ContractDeliveryStatus;
  contractSignature: ContractSignatureStatus;
  requestDate?: string;
  activationDate?: string;
  owner?: string;
  notes: string;
  incidents: string[];
  internalEvidence: Evidence[];
}

export interface InductionItem {
  id: string;
  title: string;
  status: InductionStatus;
  explainedAt?: string;
  owner?: string;
  observation: string;
  advisorConfirmation: boolean;
  internalNote: string;
}

export interface TrainingModuleProgress {
  module: string;
  checklist: string[];
  examScore: number;
  practiceScore: number;
  progress: number;
  result: TrainingResult;
}

export interface QualityEvaluation {
  advisorId: string;
  date: string;
  callType: "simulada" | "real";
  greeting: boolean;
  offerExplanation: boolean;
  conditions: boolean;
  dataProcessing: boolean;
  correctClose: boolean;
  errors: string[];
  score: number;
  needsReinforcement: boolean;
  notes: string;
}

export interface Advisor {
  id: string;
  fullName: string;
  identifier: string;
  entryDate: string;
  supervisor: string;
  shift: string;
  campaign: string;
  status: AdvisorStatus;
  phone: string;
  email: string;
  observations: string;
  tags: string[];
  progress: number;
  nextAction: string;
  access: AccessControl;
  induction: InductionItem[];
  training: TrainingModuleProgress[];
  quality: QualityEvaluation[];
  changes: ChangeLogEntry[];
}

export interface Tariff {
  id: string;
  name: string;
  price: number;
  services: string[];
  fiber: string;
  mobileLines: number;
  gb: string;
  streaming?: string;
  commitment: string;
  conditions: string;
  commercialArgument: string;
  idealProfile: string;
  frequentObjections: string[];
  recommendedRebate: string;
  status: "activa" | "pausada" | "antigua";
  segments: string[];
}

export interface ObjectionPlaybook {
  id: string;
  objection: string;
  customerType: string;
  shortAnswer: string;
  professionalAnswer: string;
  diagnosticQuestion: string;
  closingTechnique: string;
  qualityRisk: string;
  callExample: string;
}

export interface DynamicConfig {
  customFields: string[];
  customStatuses: string[];
  trainingModules: string[];
  objectionTypes: string[];
  tariffFamilies: string[];
  checklistTemplates: string[];
  incidentTypes: string[];
  enabledModules: string[];
  aiBaseTexts: string[];
}
