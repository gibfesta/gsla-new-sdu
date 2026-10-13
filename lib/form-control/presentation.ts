import type { FormControlRecord, FormLocation } from "./types";
export const connectionLabels: Record<string, string> = { UI_ONLY: "Screen only", BROWSER_LOCAL: "Saved in this browser", SERVER_SERVICE: "Server / service connected", DATABASE_PERSISTED: "Saved in database", MIXED: "Different connections", UNKNOWN: "Not checked" };
export const lifecycleLabels: Record<string, string> = { IN_USE: "In use", ON_HOLD: "On hold", DEPRECATED: "Deprecated", PLANNED: "Planned", NEEDS_REVIEW: "Needs review", REMOVED: "Removed / tombstoned" };
export const readinessLabels: Record<string, string> = { READY: "Ready for intended use", WORK_REQUIRED: "Work required", NOT_ASSESSED: "Not assessed" };
// Only exact, known, static app page paths can become navigation links.
// No interpolation of dynamic records, query strings, protocols or encoded paths.
export function safeOpenRoute(route: string, allowedRoutes: readonly string[]): string | null {
  if (!/^\/[a-zA-Z0-9/_&.-]*$/.test(route) || route.startsWith("//") || route.includes("..") || /[%\\?#\[\]\u0000-\u0020]/.test(route)) return null;
  return allowedRoutes.includes(route) ? route : null;
}
export function openReason(location: FormLocation) {
  if (!location.route) return "No importing route — component only";
  if (location.route.includes("[")) return "Choose a record in the department first";
  return "Route unavailable or not allowlisted";
}
export function evidenceLabel(form: FormControlRecord) {
  return form.evidenceState === "REMOVED" ? "Removed / tombstoned" : form.evidenceState === "STALE" ? "Inventory needs review" : form.verification || "Not verified";
}
export function assessSourceEvidence(sources: string[], reviewed: Record<string,string>, current: Record<string,string>) {
  if (sources.length && sources.every(source => !(source in current))) return "REMOVED";
  if (sources.some(source => !(source in current) || reviewed[source] !== current[source])) return "STALE";
  return "CURRENT";
}
export type LocalCandidate = { key: string; nativeId: string; title: string; version: number | null; fieldCount: number; fields: Array<{label:string;type:string;required:boolean}>; comparison: string };
export function extractLocalCandidates(raw: string | null, key: string, sourceIds: readonly string[]): LocalCandidate[] {
  if (!raw) return [];
  if (raw.length > 5_000_000) throw new Error("Local catalogue is too large for safe metadata inspection.");
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object") throw new Error("Unrecognised local catalogue.");
  const store = parsed as Record<string, unknown>;
  if (store.version !== 1) throw new Error("Unrecognised local catalogue version.");
  const definitions = store.forms ?? store.templates;
  if (!Array.isArray(definitions) || definitions.length > 500) throw new Error("Unrecognised local definitions.");
  return definitions.map((value, index) => {
    if (!value || typeof value !== "object") throw new Error("Malformed local definition.");
    const item = value as Record<string, unknown>;
    if (typeof item.id !== "string" || !/^[a-zA-Z0-9._:-]{1,128}$/.test(item.id) || typeof item.title !== "string" || item.title.length > 200 || !Array.isArray(item.fields) || item.fields.length > 200) throw new Error("Malformed local definition metadata.");
    const fields = item.fields.map(value => {
      if (!value || typeof value !== "object") throw new Error("Malformed field metadata.");
      const field = value as Record<string, unknown>;
      if (typeof field.label !== "string" || field.label.length > 200 || typeof field.type !== "string" || !["checkbox","text","textarea","select","date","time","photos","file"].includes(field.type)) throw new Error("Malformed field metadata.");
      return {label: field.label, type: field.type, required: field.required === true};
    });
    // Never return answers, files/data URLs, instructions, owner, assignments or free-text notes.
    return {key: key + ":" + index, nativeId:item.id, title:item.title, version:Number.isSafeInteger(item.version) ? item.version as number : null, fieldCount:fields.length, fields, comparison:sourceIds.includes(item.id) ? "Source ID found — local version/edits still require review" : "Custom ID — not yet reconciled"};
  });
}
