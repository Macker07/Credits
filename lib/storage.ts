import type { Profile, LogEntry, WorkoutEntry, HealthData, SavedItem, StarredItem } from "./types";

const PROFILE_KEY = "cr_profile";
const LOG_KEY = "cr_log";

export function todayKey(): string {
  return new Date().toDateString();
}

export function waterKey(): string {
  return `cr_water_${todayKey()}`;
}

// ── Profile ──────────────────────────────────────────────────────────────────
export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}

// ── Log ──────────────────────────────────────────────────────────────────────
export function loadLog(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLog(entries: LogEntry[]): void {
  localStorage.setItem(LOG_KEY, JSON.stringify(entries));
}

export function addEntry(entry: LogEntry): LogEntry[] {
  const log = loadLog();
  const updated = [entry, ...log];
  saveLog(updated);
  return updated;
}

export function removeEntry(id: number): LogEntry[] {
  const log = loadLog().filter((e) => e.id !== id);
  saveLog(log);
  return log;
}

// ── Water ────────────────────────────────────────────────────────────────────
export function loadWater(): number {
  try {
    return Number(localStorage.getItem(waterKey()) ?? 0);
  } catch {
    return 0;
  }
}

export function saveWater(ml: number): void {
  localStorage.setItem(waterKey(), String(ml));
}

// ── History helpers ───────────────────────────────────────────────────────────
export function logsForDate(date: Date, allLog: LogEntry[]): LogEntry[] {
  const key = date.toDateString();
  return allLog.filter((e) => new Date(e.ts).toDateString() === key);
}

// ── Food lookup cache ─────────────────────────────────────────────────────────
const FOOD_CACHE_KEY = "cr_food_cache";

export function getCachedFood(query: string): Record<string, unknown> | null {
  try {
    const cache = JSON.parse(localStorage.getItem(FOOD_CACHE_KEY) || "{}") as Record<string, Record<string, unknown>>;
    return cache[query.toLowerCase().trim()] ?? null;
  } catch {
    return null;
  }
}

export function setCachedFood(query: string, data: Record<string, unknown>): void {
  try {
    const cache = JSON.parse(localStorage.getItem(FOOD_CACHE_KEY) || "{}") as Record<string, unknown>;
    cache[query.toLowerCase().trim()] = data;
    localStorage.setItem(FOOD_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

// ── Suggestions cache ─────────────────────────────────────────────────────────
const SUGGESTIONS_CACHE_KEY = "cr_suggestions_cache";

export function getCachedSuggestions(logCount: number): unknown[] | null {
  try {
    const raw = localStorage.getItem(SUGGESTIONS_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as { date: string; logCount: number; data: unknown[] };
    if (cache.date !== todayKey() || cache.logCount !== logCount) return null;
    return cache.data;
  } catch {
    return null;
  }
}

export function setCachedSuggestions(logCount: number, data: unknown[]): void {
  try {
    localStorage.setItem(SUGGESTIONS_CACHE_KEY, JSON.stringify({ date: todayKey(), logCount, data }));
  } catch {}
}

// ── Workout Log ───────────────────────────────────────────────────────────────
const WORKOUT_KEY = "cr_workouts";

export function loadWorkouts(): WorkoutEntry[] {
  try {
    const raw = localStorage.getItem(WORKOUT_KEY);
    return raw ? (JSON.parse(raw) as WorkoutEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveWorkouts(entries: WorkoutEntry[]): void {
  localStorage.setItem(WORKOUT_KEY, JSON.stringify(entries));
}

export function addWorkoutEntry(entry: WorkoutEntry): WorkoutEntry[] {
  const workouts = loadWorkouts();
  const updated = [entry, ...workouts];
  saveWorkouts(updated);
  return updated;
}

export function removeWorkoutEntry(id: number): WorkoutEntry[] {
  const workouts = loadWorkouts().filter((e) => e.id !== id);
  saveWorkouts(workouts);
  return workouts;
}

// ── Apple Health / Lyfta data ─────────────────────────────────────────────────
const HEALTH_KEY = "cr_health";

export function loadHealthData(): HealthData | null {
  try {
    const raw = localStorage.getItem(HEALTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as HealthData;
    if (data.date !== todayKey()) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveHealthData(data: HealthData): void {
  localStorage.setItem(HEALTH_KEY, JSON.stringify(data));
}

// ── Saved Items ───────────────────────────────────────────────────────────────
const SAVED_ITEMS_KEY = "cr_saved_items";

export function loadSavedItems(): SavedItem[] {
  try {
    const raw = localStorage.getItem(SAVED_ITEMS_KEY);
    return raw ? (JSON.parse(raw) as SavedItem[]) : [];
  } catch {
    return [];
  }
}

export function addSavedItem(item: Omit<SavedItem, "id" | "savedAt">): SavedItem[] {
  const items = loadSavedItems();
  const newItem: SavedItem = { ...item, id: Date.now(), savedAt: new Date().toISOString() };
  const updated = [newItem, ...items];
  localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(updated));
  return updated;
}

export function removeSavedItem(id: number): SavedItem[] {
  const items = loadSavedItems().filter((i) => i.id !== id);
  localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
  return items;
}

// ── Starred Items (Quick tab) ─────────────────────────────────────────────────
const STARRED_KEY = "cr_starred";

export function loadStarredItems(): StarredItem[] {
  try {
    const raw = localStorage.getItem(STARRED_KEY);
    return raw ? (JSON.parse(raw) as StarredItem[]) : [];
  } catch {
    return [];
  }
}

export function addStarredItem(item: Omit<StarredItem, "id" | "starredAt">): StarredItem[] {
  const items = loadStarredItems();
  if (items.some((i) => i.name.toLowerCase() === item.name.toLowerCase())) return items;
  const newItem: StarredItem = { ...item, id: Date.now(), starredAt: new Date().toISOString() };
  const updated = [newItem, ...items];
  localStorage.setItem(STARRED_KEY, JSON.stringify(updated));
  return updated;
}

export function removeStarredItem(id: number): StarredItem[] {
  const items = loadStarredItems().filter((i) => i.id !== id);
  localStorage.setItem(STARRED_KEY, JSON.stringify(items));
  return items;
}

export function isStarredByName(name: string): boolean {
  return loadStarredItems().some((i) => i.name.toLowerCase() === name.toLowerCase());
}

// ── Water Goal ────────────────────────────────────────────────────────────────
const WATER_GOAL_KEY = "cr_water_goal";

export function loadWaterGoal(): number {
  try {
    return Number(localStorage.getItem(WATER_GOAL_KEY) ?? 2500);
  } catch {
    return 2500;
  }
}

export function saveWaterGoal(ml: number): void {
  localStorage.setItem(WATER_GOAL_KEY, String(ml));
}

// ── Update log entry ──────────────────────────────────────────────────────────
export function updateEntry(id: number, updates: Partial<Omit<LogEntry, "id">>): LogEntry[] {
  const log = loadLog().map((e) => (e.id === id ? { ...e, ...updates } : e));
  saveLog(log);
  return log;
}

// ── Eating advice cache ───────────────────────────────────────────────────────
const EATING_ADVICE_KEY = "cr_eating_advice";

export function getCachedEatingAdvice(): { tips: unknown[]; cachedAt: string } | null {
  try {
    const raw = localStorage.getItem(EATING_ADVICE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as { tips: unknown[]; cachedAt: string };
    const age = Date.now() - new Date(cache.cachedAt).getTime();
    if (age > 24 * 60 * 60 * 1000) return null;
    return cache;
  } catch {
    return null;
  }
}

export function setCachedEatingAdvice(tips: unknown[]): void {
  try {
    localStorage.setItem(EATING_ADVICE_KEY, JSON.stringify({ tips, cachedAt: new Date().toISOString() }));
  } catch {}
}

// ── Data export ───────────────────────────────────────────────────────────────
export function exportAllData(): void {
  const data = {
    profile: loadProfile(),
    log: loadLog(),
    workouts: loadWorkouts(),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `credits-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
