import type { SkellySpec } from "./index";

/**
 * Minimal storage contract — `localStorage` satisfies it. Supply your own to persist
 * learned layouts somewhere else (sessionStorage, IndexedDB wrapper, a test double),
 * or pass `null` to keep everything in memory for the page's lifetime.
 */
export interface SkellyStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface LearnOptions {
  /** Stable identity for a layout across mounts, routes and reloads. */
  name?: string;
  /** Viewport widths that bucket a learned layout. Defaults to DEFAULT_BREAKPOINTS. */
  breakpoints?: number[];
  /** Where learned layouts persist. Defaults to localStorage; `null` disables persistence. */
  storage?: SkellyStorage | null;
}

interface LearnedEntry {
  at: number;
  spec: SkellySpec[];
}

const STORAGE_KEY = "skelly:learned:v2";
const MAX_ENTRIES = 120;

/** A layout is stored per viewport bucket, so a desktop measurement never replays on a phone. */
export const DEFAULT_BREAKPOINTS = [0, 480, 768, 1024, 1280, 1536];

let memory: Map<string, LearnedEntry> | null = null;
let resolvedStorage: SkellyStorage | null | undefined;

function defaultStorage(): SkellyStorage | null {
  if (typeof window === "undefined") return null;
  try {
    const ls = window.localStorage;
    // Private modes expose localStorage but throw on write.
    const probe = `${STORAGE_KEY}:probe`;
    ls.setItem(probe, "1");
    ls.removeItem(probe);
    return ls;
  } catch (e) {
    return null;
  }
}

function getStorage(options: LearnOptions = {}): SkellyStorage | null {
  if (options.storage !== undefined) return options.storage;
  if (resolvedStorage === undefined) resolvedStorage = defaultStorage();
  return resolvedStorage;
}

/**
 * Specs inlined into the server HTML as `window.__skelly_specs`. They seed the cache as a
 * committed baseline — covering the very first visit, before anything has been learned.
 */
function seedFromInlined(target: Map<string, LearnedEntry>) {
  if (typeof window === "undefined") return;
  const inlined = (window as any).__skelly_specs;
  if (!inlined || typeof inlined !== "object") return;

  Object.keys(inlined).forEach(key => {
    const spec = inlined[key];
    if (Array.isArray(spec) && !target.has(key)) {
      target.set(key, { at: 0, spec });
    }
  });
}

function load(options: LearnOptions = {}): Map<string, LearnedEntry> {
  if (memory) return memory;

  memory = new Map();
  seedFromInlined(memory);

  const storage = getStorage(options);
  if (storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const entries = parsed && parsed.entries;
        if (entries && typeof entries === "object") {
          Object.keys(entries).forEach(key => {
            const entry = entries[key];
            if (entry && Array.isArray(entry.spec)) {
              memory!.set(key, { at: entry.at || 0, spec: entry.spec });
            }
          });
        }
      }
    } catch (e) {
      // Corrupt or unreadable payload is not worth failing a render over.
    }
  }

  return memory;
}

function persist(options: LearnOptions = {}) {
  const storage = getStorage(options);
  if (!storage || !memory) return;

  // Oldest entries go first when the budget is exceeded.
  if (memory.size > MAX_ENTRIES) {
    const ordered = Array.from(memory.entries()).sort((a, b) => a[1].at - b[1].at);
    for (let i = 0; i < ordered.length - MAX_ENTRIES; i++) {
      memory.delete(ordered[i][0]);
    }
  }

  const entries: Record<string, LearnedEntry> = {};
  memory.forEach((entry, key) => {
    // A seeded baseline belongs to the server payload, not to this browser.
    if (entry.at > 0) entries[key] = entry;
  });

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, entries }));
  } catch (e) {
    // Quota exhausted — the in-memory layout still works for this page.
  }
}

/** The largest breakpoint at or below `width`. */
export function breakpointFor(width: number, breakpoints: number[] = DEFAULT_BREAKPOINTS): number {
  const sorted = breakpoints.slice().sort((a, b) => a - b);
  let chosen = sorted.length ? sorted[0] : 0;
  for (const bp of sorted) {
    if (width >= bp) chosen = bp;
  }
  return chosen;
}

function currentWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth || 0;
}

/** The storage key for a name at the current viewport bucket. */
export function learnedKey(name: string, options: LearnOptions = {}): string {
  return `${name}@${breakpointFor(currentWidth(), options.breakpoints)}`;
}

/**
 * A previously learned layout for this name at this viewport, or null. Falls back to an
 * un-bucketed entry, which is how a committed baseline is usually keyed.
 *
 * The returned array is the stored instance, so repeated calls are reference-stable and
 * safe to read from `useSyncExternalStore`.
 */
export function recallSpec(name: string, options: LearnOptions = {}): SkellySpec[] | null {
  if (!name) return null;

  const store = load(options);
  const bucketed = store.get(learnedKey(name, options));
  if (bucketed && bucketed.spec.length > 0) return bucketed.spec;

  const plain = store.get(name);
  if (plain && plain.spec.length > 0) return plain.spec;

  return null;
}

/** Record a layout for this name at the current viewport bucket. */
export function rememberSpec(name: string, spec: SkellySpec[], options: LearnOptions = {}): void {
  if (!name || !spec || spec.length === 0) return;

  const store = load(options);
  store.set(learnedKey(name, options), { at: Date.now(), spec });
  persist(options);
}

/**
 * Everything learned so far, as `{ "name@breakpoint": spec }`. Write this to disk and inline
 * it as `window.__skelly_specs` to give first-time visitors the same skeletons.
 */
export function exportLearnedSpecs(): Record<string, SkellySpec[]> {
  const store = load();
  const out: Record<string, SkellySpec[]> = {};
  store.forEach((entry, key) => {
    out[key] = entry.spec;
  });
  return out;
}

/** Merge exported layouts back in. Existing learned entries win — they are more current. */
export function importLearnedSpecs(
  specs: Record<string, SkellySpec[]>,
  options: LearnOptions & { overwrite?: boolean } = {}
): void {
  const store = load(options);
  Object.keys(specs).forEach(key => {
    if (!options.overwrite && store.has(key)) return;
    if (Array.isArray(specs[key])) store.set(key, { at: 0, spec: specs[key] });
  });
}

/** Drop every learned layout, in memory and in storage. */
export function clearLearnedSpecs(options: LearnOptions = {}): void {
  memory = null;
  const storage = getStorage(options);
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Nothing to do if the store is unavailable.
  }
}
