import type { Food, MealSlot, Nutrients, Recipe, TrackerData, TrackerSettings, WeightEntry } from "./tracker-types";
import type { LogEntry, Profile } from "./types";
import { PRESETS } from "./constants";
import { calcMacros, calcTDEE } from "./calc";

export const TRACKER_KEY = "credits_tracker_v2";
export const MEALS: MealSlot[] = ["breakfast", "lunch", "dinner", "snacks"];

export const emptyNutrients = (): Nutrients => ({ calories: 0, protein: 0, carbs: 0, fat: 0 });
export const dateKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
export const uid = () => globalThis.crypto?.randomUUID?.() ?? `${new Date().getTime()}-${Math.random().toString(36).slice(2)}`;
const KG_TO_LB = 2.2046226218;
const CM_TO_IN = 0.3937007874;
const round1 = (value: number) => Math.round(value * 10) / 10;

export function sumNutrients(items: Nutrients[]): Nutrients {
  const keys: (keyof Nutrients)[] = ["calories", "protein", "carbs", "fat", "fiber", "sugar", "addedSugar", "sodium", "saturatedFat", "cholesterol", "potassium", "calcium", "iron", "vitaminC", "vitaminD"];
  return keys.reduce<Nutrients>((total, key) => ({ ...total, [key]: items.reduce((sum, item) => sum + (item[key] ?? 0), 0) }), emptyNutrients());
}

export function scaleNutrients<T extends Nutrients>(item: T, multiplier: number): T {
  const result = { ...item };
  for (const key of Object.keys(emptyNutrients()) as (keyof Nutrients)[]) result[key] = Math.round(((item[key] ?? 0) * multiplier) * 10) / 10;
  for (const key of ["fiber", "sugar", "addedSugar", "sodium", "saturatedFat", "cholesterol", "potassium", "calcium", "iron", "vitaminC", "vitaminD"] as (keyof Nutrients)[]) {
    if (item[key] != null) result[key] = Math.round((item[key] ?? 0) * multiplier * 10) / 10;
  }
  return result;
}

export function defaultSettings(profile?: Profile | null): TrackerSettings {
  const calories = profile ? Math.max(profile.gender === "female" ? 1200 : 1500, calcTDEE(profile)) : 2100;
  const macros = calcMacros(calories);
  return { units: "metric", calorieMode: "fixed", targetCalories: calories, targetProtein: macros.protein, targetCarbs: macros.carbs, targetFat: macros.fat, targetFiber: 30, targetSodium: 2300, targetWater: 2500, weeklyRate: 0.5, mealNames: { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snacks: "Snacks" }, visibleNutrients: ["fiber", "sodium"], reminders: { breakfast: false, lunch: false, dinner: false, water: false, weighIn: false } };
}

export function initialData(profile?: Profile | null): TrackerData {
  const now = new Date().toISOString();
  const foods: Food[] = PRESETS.map((p, index) => ({ ...p, id: `preset-${index}`, servingAmount: 1, servingUnit: "serving", servingGrams: p.grams, source: "preset", verified: true, createdAt: now }));
  return { version: 2, foods, entries: [], recipes: [], templates: [], weights: [], measurements: [], water: {}, notes: {}, targetsByWeekday: {}, settings: defaultSettings(profile) };
}

export function migrateLegacy(profile: Profile | null, log: LogEntry[]): TrackerData {
  const data = initialData(profile);
  data.entries = log.map((entry) => ({ ...entry, id: String(entry.id), date: dateKey(new Date(entry.ts)), meal: (entry.mealCategory?.toLowerCase() as MealSlot) || "snacks", quantity: 1, servingUnit: "serving", source: "custom", createdAt: entry.ts }));
  return data;
}

export function loadTracker(profile?: Profile | null, legacyLog: LogEntry[] = []): TrackerData {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    if (!raw) return migrateLegacy(profile ?? null, legacyLog);
    const parsed = JSON.parse(raw) as Partial<TrackerData>;
    if (parsed.version !== 2 || !Array.isArray(parsed.entries) || !Array.isArray(parsed.foods) || !parsed.settings) throw new Error("Invalid tracker data");
    return { ...initialData(profile), ...parsed, settings: { ...defaultSettings(profile), ...parsed.settings }, version: 2 };
  } catch { return migrateLegacy(profile ?? null, legacyLog); }
}

export function saveTracker(data: TrackerData) { localStorage.setItem(TRACKER_KEY, JSON.stringify(data)); }
export function entriesForDate(data: TrackerData, date: string) { return data.entries.filter((entry) => entry.date === date); }
export function recentFoods(data: TrackerData) {
  const counts = new Map<string, { count: number; last: number }>();
  data.entries.forEach((entry, index) => counts.set(entry.foodId ?? entry.name, { count: (counts.get(entry.foodId ?? entry.name)?.count ?? 0) + 1, last: index }));
  return [...data.foods].sort((a, b) => (Number(b.favorite) - Number(a.favorite)) || ((counts.get(b.id)?.count ?? 0) - (counts.get(a.id)?.count ?? 0))).slice(0, 12);
}
export function recipeNutrition(recipe: Recipe) { return scaleNutrients(sumNutrients(recipe.ingredients), 1 / Math.max(recipe.servings, 1)); }
export function weightTrend(weights: WeightEntry[]) {
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date));
  const points = sorted.map((item, index) => ({ ...item, average: Math.round(sorted.slice(Math.max(0, index - 6), index + 1).reduce((s, x) => s + x.weight, 0) / Math.min(index + 1, 7) * 10) / 10 }));
  const change = points.length > 1 ? Math.round((points.at(-1)!.average - points[0].average) * 10) / 10 : 0;
  return { points, change };
}
export function adaptiveCalories(data: TrackerData) {
  const { points } = weightTrend(data.weights);
  if (points.length < 14) return data.settings.targetCalories;
  const first = points[0].date;
  const last = points.at(-1)!.date;
  const days = Math.max(1, Math.round((new Date(last).getTime() - new Date(first).getTime()) / 86400000));
  const weightDelta = points.at(-1)!.average - points[0].average;
  const entries = data.entries.filter((entry) => entry.date >= first && entry.date <= last);
  const loggedDays = new Set(entries.map((entry) => entry.date)).size;
  if (days < 14 || loggedDays / (days + 1) < 0.7) return data.settings.targetCalories;
  const averageIntake = entries.reduce((sum, entry) => sum + entry.calories, 0) / loggedDays;
  const kilogramsDelta = data.settings.units === "imperial" ? weightDelta / KG_TO_LB : weightDelta;
  return Math.max(1200, Math.min(5000, Math.round(averageIntake - (kilogramsDelta * 7700) / days)));
}

export function convertTrackerUnits(data: TrackerData, units: TrackerSettings["units"]): TrackerData {
  if (data.settings.units === units) return data;
  const toImperial = units === "imperial";
  const weightFactor = toImperial ? KG_TO_LB : 1 / KG_TO_LB;
  const lengthFactor = toImperial ? CM_TO_IN : 1 / CM_TO_IN;
  return {
    ...data,
    weights: data.weights.map((item) => ({ ...item, weight: round1(item.weight * weightFactor), waist: item.waist == null ? undefined : round1(item.waist * lengthFactor) })),
    measurements: data.measurements.map((item) => ({ ...item, chest: item.chest == null ? undefined : round1(item.chest * lengthFactor), hips: item.hips == null ? undefined : round1(item.hips * lengthFactor), arm: item.arm == null ? undefined : round1(item.arm * lengthFactor), thigh: item.thigh == null ? undefined : round1(item.thigh * lengthFactor) })),
    settings: { ...data.settings, units, goalWeight: data.settings.goalWeight == null ? undefined : round1(data.settings.goalWeight * weightFactor) },
  };
}

export function demoData(profile?: Profile | null): TrackerData {
  const data = initialData(profile);
  const picks: [number, MealSlot, number][] = [[5, "breakfast", 1], [1, "lunch", 1.4], [2, "lunch", 1], [7, "dinner", 1], [15, "dinner", 1.5], [0, "snacks", 1]];
  for (let daysAgo = 20; daysAgo >= 0; daysAgo--) {
    const day = new Date(); day.setDate(day.getDate() - daysAgo); const date = dateKey(day);
    for (const [foodIndex, meal, quantity] of picks.slice(0, 4 + (daysAgo % 3))) {
      const food = data.foods[foodIndex]; const nutrients = scaleNutrients(food, quantity);
      data.entries.push({ ...nutrients, id: uid(), foodId: food.id, name: food.name, emoji: food.emoji, date, meal, quantity, servingUnit: food.servingUnit, source: food.source, createdAt: day.toISOString() });
    }
    data.water[date] = 1750 + (daysAgo % 4) * 250;
    if (daysAgo % 2 === 0) data.weights.push({ id: uid(), date, weight: Math.round((78.4 - (20 - daysAgo) * 0.035 + Math.sin(daysAgo) * 0.15) * 10) / 10, waist: Math.round((87 - (20 - daysAgo) * .04) * 10) / 10 });
  }
  data.settings.goalWeight = 74;
  data.foods[1].favorite = true; data.foods[4].favorite = true;
  data.recipes.push({ id: uid(), name: "Protein power bowl", emoji: "🥗", ingredients: picks.slice(1,4).map(([i,meal,q]) => ({ ...scaleNutrients(data.foods[i],q), id: uid(), foodId: data.foods[i].id, name: data.foods[i].name, emoji: data.foods[i].emoji, date: dateKey(), meal, quantity:q, servingUnit:data.foods[i].servingUnit, source:data.foods[i].source, createdAt:new Date().toISOString() })), servings: 2, cookedWeight: 680, createdAt: new Date().toISOString() });
  data.notes[dateKey()] = "Good energy today. Meal prep made logging easy.";
  return data;
}
