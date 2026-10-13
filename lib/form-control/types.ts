export type FormControlRecord = {
  formId: string;
  displayName: string;
  area: string;
  kind: string;
  operationalStatus: string;
  connectionStatus: string;
  locations: Array<{ route: string; mode: string; source: string }>;
  notes?: string;
};
export type FormControlRegister = {
  schemaVersion: number;
  sourceCommit: string;
  coverageNote: string;
  forms: FormControlRecord[];
};
