"use client";
import { useSyncExternalStore } from "react";
import { WORKLOAD_KEY, parseWorkload, sampleWorkload, validTask, type WorkloadTask } from "@/lib/sharedWorkload";
const initial = { data: sampleWorkload(), notice: "" };
let snapshot: typeof initial | null = null;
let invalid = false;
const listeners = new Set<() => void>();
function read() {
  if (snapshot) return snapshot;
  try {
    const raw = localStorage.getItem(WORKLOAD_KEY);
    snapshot = { data: raw ? parseWorkload(raw) : initial.data, notice: "" };
  } catch {
    invalid = true;
    snapshot = { data: initial.data, notice: "Saved sample tasks could not be read. Original browser data is preserved; saving is disabled for this session." };
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const sync = (event: StorageEvent) => { if (event.key === WORKLOAD_KEY || event.key === null) { snapshot = null; invalid = false; listeners.forEach(fn => fn()); } };
  window.addEventListener("storage", sync);
  return () => { listeners.delete(listener); window.removeEventListener("storage", sync); };
}
export function saveWorkloadTask(task: WorkloadTask) {
  if (!validTask(task)) throw new Error("Check the task details before saving.");
  const current = read();
  if (invalid) throw new Error(current.notice);
  const tasks = current.data.tasks.some(t => t.id === task.id) ? current.data.tasks.map(t => t.id === task.id ? task : t) : [...current.data.tasks, task];
  const data = { version: 1 as const, tasks };
  parseWorkload(JSON.stringify(data));
  let notice = "";
  try { localStorage.setItem(WORKLOAD_KEY, JSON.stringify(data)); }
  catch { notice = "Browser storage is unavailable. Changes are kept for this session only."; }
  snapshot = { data, notice };
  listeners.forEach(fn => fn());
}
export function useWorkload() { return useSyncExternalStore(subscribe, read, () => initial); }
