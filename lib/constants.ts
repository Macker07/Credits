export const ACCENT = "#C6FF00";

export const ACTIVITIES = [
  { id: "sedentary",  icon: "🛋️", label: "Sedentary",   desc: "Little or no exercise" },
  { id: "light",      icon: "🚶", label: "Light",        desc: "1–3 days/week" },
  { id: "moderate",   icon: "🏃", label: "Moderate",     desc: "3–5 days/week" },
  { id: "active",     icon: "💪", label: "Active",       desc: "6–7 days/week" },
  { id: "very_active",icon: "🔥", label: "Very Active",  desc: "Hard exercise daily" },
] as const;

export const GOALS = [
  { id: "lose",     icon: "🔥", label: "Lose Weight",   desc: "Calorie deficit"    },
  { id: "maintain", icon: "⚖️", label: "Maintain",      desc: "Steady state"       },
  { id: "gain",     icon: "💪", label: "Gain Muscle",   desc: "Calorie surplus"    },
  { id: "healthy",  icon: "🥗", label: "Eat Healthier", desc: "Balanced nutrition" },
] as const;

export const GOAL_LABELS: Record<string, string> = {
  lose: "Lose Weight",
  maintain: "Maintain",
  gain: "Gain Muscle",
  healthy: "Eat Healthier",
};

export const PRESETS = [
  { name: "Banana",               calories: 89,  protein: 1.1, carbs: 23, fat: 0.3,  emoji: "🍌", grams: 118 },
  { name: "Chicken Breast (100g)",calories: 165, protein: 31,  carbs: 0,  fat: 3.6,  emoji: "🍗", grams: 100 },
  { name: "Brown Rice (1 cup)",   calories: 216, protein: 5,   carbs: 45, fat: 1.8,  emoji: "🍚", grams: 195 },
  { name: "Avocado (medium)",     calories: 240, protein: 3,   carbs: 13, fat: 22,   emoji: "🥑", grams: 150 },
  { name: "Greek Yogurt (170g)",  calories: 100, protein: 17,  carbs: 6,  fat: 0.7,  emoji: "🥛", grams: 170 },
  { name: "2 Large Eggs",         calories: 143, protein: 13,  carbs: 1,  fat: 10,   emoji: "🥚", grams: 100 },
  { name: "Oatmeal (1 cup)",      calories: 154, protein: 5,   carbs: 27, fat: 3,    emoji: "🥣", grams: 234 },
  { name: "Salmon (100g)",        calories: 208, protein: 20,  carbs: 0,  fat: 13,   emoji: "🐟", grams: 100 },
  { name: "Apple (medium)",       calories: 95,  protein: 0.5, carbs: 25, fat: 0.3,  emoji: "🍎", grams: 182 },
  { name: "Almonds (28g)",        calories: 164, protein: 6,   carbs: 6,  fat: 14,   emoji: "🥜", grams: 28  },
  { name: "Black Coffee",         calories: 5,   protein: 0.3, carbs: 0,  fat: 0,    emoji: "☕", grams: 240 },
  { name: "Orange Juice (240ml)", calories: 112, protein: 2,   carbs: 26, fat: 0.5,  emoji: "🍊", grams: 240 },
  { name: "Whole Milk (240ml)",   calories: 149, protein: 8,   carbs: 12, fat: 8,    emoji: "🥛", grams: 240 },
  { name: "Protein Shake",        calories: 120, protein: 25,  carbs: 5,  fat: 2,    emoji: "🧃", grams: 300 },
  { name: "Sweet Potato (med)",   calories: 103, protein: 2.3, carbs: 24, fat: 0.1,  emoji: "🍠", grams: 114 },
  { name: "Broccoli (1 cup)",     calories: 55,  protein: 3.7, carbs: 11, fat: 0.6,  emoji: "🥦", grams: 91  },
];
