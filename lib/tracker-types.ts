export type MealSlot = "breakfast" | "lunch" | "dinner" | "snacks";
export type FoodSource = "preset" | "custom" | "recipe" | "openfoodfacts" | "usda" | "scan";

export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  addedSugar?: number;
  sodium?: number;
  saturatedFat?: number;
  cholesterol?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  vitaminC?: number;
  vitaminD?: number;
}

export interface Food extends Nutrients {
  id: string;
  name: string;
  brand?: string;
  emoji: string;
  servingAmount: number;
  servingUnit: string;
  servingGrams?: number;
  barcode?: string;
  source: FoodSource;
  verified?: boolean;
  favorite?: boolean;
  createdAt: string;
}

export interface DiaryEntry extends Nutrients {
  id: string;
  foodId?: string;
  name: string;
  brand?: string;
  emoji: string;
  date: string;
  meal: MealSlot;
  quantity: number;
  servingUnit: string;
  source: FoodSource;
  notes?: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  ingredients: DiaryEntry[];
  servings: number;
  cookedWeight?: number;
  notes?: string;
  createdAt: string;
}

export interface MealTemplate {
  id: string;
  name: string;
  meal: MealSlot;
  items: DiaryEntry[];
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  waist?: number;
  note?: string;
}

export interface MeasurementEntry {
  id: string;
  date: string;
  chest?: number;
  hips?: number;
  arm?: number;
  thigh?: number;
}

export interface DayTargets extends Nutrients {
  water: number;
}

export interface TrackerSettings {
  units: "metric" | "imperial";
  calorieMode: "fixed" | "adaptive";
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  targetSodium: number;
  targetWater: number;
  goalWeight?: number;
  weeklyRate: number;
  mealNames: Record<MealSlot, string>;
  visibleNutrients: string[];
  reminders: { breakfast: boolean; lunch: boolean; dinner: boolean; water: boolean; weighIn: boolean };
}

export interface TrackerData {
  version: 2;
  foods: Food[];
  entries: DiaryEntry[];
  recipes: Recipe[];
  templates: MealTemplate[];
  weights: WeightEntry[];
  measurements: MeasurementEntry[];
  water: Record<string, number>;
  notes: Record<string, string>;
  targetsByWeekday: Partial<Record<number, Partial<DayTargets>>>;
  settings: TrackerSettings;
}
