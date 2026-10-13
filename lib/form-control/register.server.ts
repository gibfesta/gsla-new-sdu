import "server-only";
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
  for (const item of value.forms) {
    if (!item || typeof item !== "object") throw new Error("Invalid form metadata");
    const form = item as FormControlRecord;
    if (typeof form.formId !== "string" || !formIdPattern.test(form.formId) ||
        seen.has(form.formId) || typeof form.displayName !== "string" ||
        typeof form.area !== "string" || typeof form.kind !== "string" ||
        typeof form.operationalStatus !== "string" || typeof form.connectionStatus !== "string" ||
        !Array.isArray(form.locations) ||
        !form.locations.every(x => x && typeof x.route === "string" &&
          (x.route === "" || (x.route.startsWith("/") && !x.route.startsWith("//"))) &&
          typeof x.mode === "string" && typeof x.source === "string")) {
      throw new Error("Invalid form metadata");
    }
    seen.add(form.formId);
  }
  return value as unknown as FormControlRegister;
}
export function loadFormRegister(): FormControlRegister { return validate(); }
export function findForm(id: string): FormControlRecord | undefined {
  if (!formIdPattern.test(id)) return undefined;
  return loadFormRegister().forms.find(form => form.formId === id);
}
