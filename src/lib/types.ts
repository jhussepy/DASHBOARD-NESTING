// Compatibility exports for older app/page.tsx variants that imported from legacy type module.
// The active application uses the canonical models in "@/lib/types/onboarding".
export * from "./types/onboarding";

export type AdvisorStatus = string;

export interface LegacyAdvisor {
  [key: string]: any;
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
