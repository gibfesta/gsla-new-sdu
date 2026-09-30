import { initialWorkflowTemplates, parsePreviewStore, STORAGE_KEY, type PreviewStore } from "./facilityWorkflows";
type Snapshot = { data: PreviewStore; notice: string };
const serverSnapshot: Snapshot = { data: { version: 1, templates: initialWorkflowTemplates(), records: [] }, notice: "" };
let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();
export function serverPreviewSnapshot() { return serverSnapshot; }
export function readPreviewSnapshot(): Snapshot {
  if (snapshot) return snapshot;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    snapshot = { data: saved ? parsePreviewStore(JSON.parse(saved)) : structuredClone(serverSnapshot.data), notice: "" };
  } catch {
    snapshot = { data: structuredClone(serverSnapshot.data), notice: "Saved browser previews could not be loaded. The example templates are shown; your original browser data has not been overwritten." };
  }
  return snapshot;
}
export function savePreviewData(data: PreviewStore) {
  let notice = "";
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch { notice = "Browser storage is unavailable or full. These changes are visible for this session but will not survive a refresh. Remove large attachments or use a smaller file."; }
  snapshot = { data, notice };
  listeners.forEach(listener => listener());
}
export function subscribePreview(listener: () => void) {
  listeners.add(listener);
  const sync = (event: StorageEvent) => { if (event.key === STORAGE_KEY) { snapshot = null; listeners.forEach(item => item()); } };
  window.addEventListener("storage", sync);
  return () => { listeners.delete(listener); window.removeEventListener("storage", sync); };
}
