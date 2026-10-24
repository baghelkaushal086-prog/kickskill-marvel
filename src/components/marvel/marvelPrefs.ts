import { useSyncExternalStore } from "react";

/** User comfort preferences for the Marvel effects, persisted in localStorage. */
export interface MarvelPrefs {
  animations: boolean; // page transitions + celebrations
  hulkCursor: boolean; // hanging Hulk cursor companion
}

const KEY = "marvel_prefs";
const DEFAULTS: MarvelPrefs = { animations: true, hulkCursor: true };

function load(): MarvelPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raw = localStorage.getItem(KEY);
    const base = reduced ? { animations: false, hulkCursor: false } : DEFAULTS;
    return raw ? { ...base, ...JSON.parse(raw) } : base;
  } catch {
    return DEFAULTS;
  }
}

let prefs = load();
const listeners = new Set<() => void>();

export function getMarvelPrefs(): MarvelPrefs {
  return prefs;
}

export function setMarvelPref<K extends keyof MarvelPrefs>(key: K, value: MarvelPrefs[K]) {
  prefs = { ...prefs, [key]: value };
  localStorage.setItem(KEY, JSON.stringify(prefs));
  listeners.forEach((l) => l());
}

export function useMarvelPrefs(): MarvelPrefs {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => prefs,
    () => DEFAULTS
  );
}
