"use client";
import { useSyncExternalStore } from "react";
import type { Dispatch, SetStateAction } from "react";

type Entry = { value: unknown; notice: string };
const cache = new Map<string, Entry>();
const listeners = new Map<string, Set<() => void>>();
const serverEntries = new Map<string, Entry>();
const defaults = new Map<string, unknown>();
const prefix = "gsla-original-venue-design-v1:";
const errorSnapshot = { value: "", notice: "" };
function read(key: string): Entry {
 const existing = cache.get(key); if (existing) return existing;
 let entry: Entry = { value: defaults.get(key), notice: "" };
 try {
  const raw = window.localStorage.getItem(key);
  if (raw) {
   const parsed = JSON.parse(raw);
   const fallback = defaults.get(key);
   if (!parsed || parsed.version !== 1 || (Array.isArray(fallback) ? !Array.isArray(parsed.value) : typeof parsed.value !== typeof fallback || parsed.value === null)) throw new Error("Invalid preview data");
   entry = { value: parsed.value, notice: "" };
  }
 } catch { entry.notice = "Saved preview data could not be loaded. Example entries are shown. Your original browser data has not been overwritten."; }
 cache.set(key, entry); return entry;
}
function subscribe(key: string, listener: () => void) {
 const items = listeners.get(key) || new Set<() => void>(); items.add(listener); listeners.set(key, items);
 const sync = (event: StorageEvent) => { if (event.key === key || event.key === null) { cache.delete(key); items.forEach(item => item()); } };
 window.addEventListener("storage", sync);
 return () => { items.delete(listener); window.removeEventListener("storage", sync); };
}
export function useVenueDesignState<T>(scope: string, field: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
 const key = prefix + scope + ":" + field;
 if (!defaults.has(key)) { defaults.set(key, initial); serverEntries.set(key, { value: initial, notice: "" }); }
 const snapshot = useSyncExternalStore(listener => subscribe(key, listener), () => read(key), () => serverEntries.get(key)!);
 const setValue: Dispatch<SetStateAction<T>> = update => {
  const current = read(key).value as T;
  const value = typeof update === "function" ? (update as (previous: T) => T)(current) : update;
  let notice = "";
  try { window.localStorage.setItem(key, JSON.stringify({ version: 1, value })); }
  catch { notice = "Browser storage is unavailable or full. Your changes are visible this session but will not survive refresh. Try smaller attachments."; }
  cache.set(key, { value, notice }); listeners.get(key)?.forEach(listener => listener());
 };
 return [snapshot.value as T, setValue];
}
export function useVenueDesignNotice(scope: string) {
 return useSyncExternalStore(listener => {
  const keys = [...defaults.keys()].filter(key => key.startsWith(prefix + scope + ":"));
  const unsubscribes = keys.map(key => subscribe(key, listener)); return () => unsubscribes.forEach(unsubscribe => unsubscribe());
 }, () => [...cache.entries()].filter(([key]) => key.startsWith(prefix + scope + ":")).map(([, value]) => value.notice).filter(Boolean).join(" "), () => errorSnapshot.notice);
}
