export interface Profile {
  name: string;
  gender: "male" | "female";
  age: number;
  weight: number;
  height: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain" | "healthy";
  useManual: boolean;
  manualCal: number;
  lossRate?: number;
}

export interface Minerals {
  fiber?: number;
  sugar?: number;
  sodium?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  vitaminC?: number;
  vitaminD?: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  addedSugar?: number;
}

export interface MealIngredient {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
}

export interface LogEntry {
  id: number;
  ts: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
  minerals?: Minerals;
  mealIngredients?: MealIngredient[];
  mealCategory?: string;
}

export interface WorkoutEntry {
  id: number;
  ts: string;
  exercise: string;
  muscleGroup?: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface RecoveryPlan {
  recovery: string[];
  nutrition: string;
  nextSession: string;
  restDays: number;
}

export interface HealthData {
  date: string;
  steps: number;
  activeCalories: number;
  exerciseMinutes: number;
  standHours: number;
  lyftaWorkouts?: LyftaWorkout[];
  stepHistory?: Record<string, number>;
}

export interface LyftaWorkout {
  name: string;
  duration: number;
  calories: number;
  date: string;
}

export interface SavedItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
  savedAt: string;
  barcode?: string;
  baseGrams?: number;
  servingSize?: string;
}

export interface StarredItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
  baseGrams?: number;
  servingSize?: string;
  starredAt: string;
}

export type Screen = "dashboard" | "add" | "suggestions" | "history" | "workout";

export interface MacroTargets {
  protein: number;
  carbs: number;
  fat: number;
}
