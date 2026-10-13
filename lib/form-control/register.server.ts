import "server-only";
import identities from "@/config/form-control/form-ids.json";
import data from "@/config/form-control/register.json";
import type { FormControlRecord, FormControlRegister } from "./types";

const formIdPattern = /^[a-z0-9][a-z0-9._:-]{0,127}$/;
function validate(): FormControlRegister {
  const register: unknown = data;
  if (!register || typeof register !== "object") throw new Error("Invalid form register");
  const value = register as Record<string, unknown>;
  if (value.schemaVersion !== 1 || typeof value.sourceCommit !== "string" ||
      typeof value.coverageNote !== "string" || !Array.isArray(value.forms)) {
    throw new Error("Invalid form register");
  }
  const seen = new Set<string>();
  const publicIds = new Set<string>();
  const assignments = new Map(identities.assignments.map(x => [x.formId, x.ownerFormId]));
  if (assignments.size !== identities.assignments.length || new Set(identities.assignments.map(x => x.ownerFormId)).size !== identities.assignments.length ||
      identities.assignments.some(x => !/^GSLA-FRM-[0-9]{3}$/.test(x.ownerFormId) || Number(x.ownerFormId.slice(-3)) < 1 || Number(x.ownerFormId.slice(-3)) > identities.highWatermark)) {
    throw new Error("Invalid permanent Form ID ledger");
  }
  for (const item of value.forms) {
    if (!item || typeof item !== "object") throw new Error("Invalid form metadata");
    const form = item as FormControlRecord;
    if (typeof form.formId !== "string" || !formIdPattern.test(form.formId) ||
        seen.has(form.formId) || publicIds.has(form.ownerFormId) || assignments.get(form.formId) !== form.ownerFormId || typeof form.displayName !== "string" ||
        typeof form.area !== "string" || typeof form.kind !== "string" ||
        typeof form.operationalStatus !== "string" || typeof form.connectionStatus !== "string" ||
        !Array.isArray(form.locations) ||
        !form.locations.every(x => x && typeof x.route === "string" &&
          (x.route === "" || (x.route.startsWith("/") && !x.route.startsWith("//"))) &&
          typeof x.mode === "string" && typeof x.source === "string")) {
      throw new Error("Invalid form metadata");
    }
    seen.add(form.formId);
    publicIds.add(form.ownerFormId);
  }
  return value as unknown as FormControlRegister;
}
export function loadFormRegister(): FormControlRegister { return validate(); }
export function findForm(id: string): FormControlRecord | undefined {
  if (!formIdPattern.test(id)) return undefined;
  return loadFormRegister().forms.find(form => form.formId === id);
}
