import type { Profile, MacroTargets } from "./types";

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS: Record<string, number> = {
  maintain: 0,
  gain: 300,
  healthy: 0,
};

export function calcTDEE(profile: Profile): number {
  const { gender, weight, height, age, activityLevel, goal, useManual, manualCal } = profile;

  if (useManual && manualCal > 0) return manualCal;

  if (!weight || !height || !age) return 2000;

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;

  let adjustment: number;
  if (goal === "lose") {
    adjustment = -Math.round((profile.lossRate ?? 0.5) * 1000);
  } else {
    adjustment = GOAL_ADJUSTMENTS[goal] ?? 0;
  }

  return Math.round(bmr * multiplier + adjustment);
}

export function calcMacros(calories: number): MacroTargets {
  return {
    protein: Math.round((calories * 0.3) / 4),
    carbs: Math.round((calories * 0.4) / 4),
    fat: Math.round((calories * 0.3) / 9),
  };
}

export function calcDayScore(
  totals: { cal: number; protein: number; carbs: number; fat: number },
  limit: number,
  macros: MacroTargets
): number {
  if (totals.cal === 0 || limit === 0) return 0;
  const util = totals.cal / limit;
  // Calorie adherence: 50 pts. Full marks at 75-100% of target. Drops sharply over 100%.
  const calScore =
    util <= 1
      ? Math.min(util / 0.75, 1) * 50
      : Math.max(0, 50 - (util - 1) * 250);
  const proteinScore = Math.min(totals.protein / macros.protein, 1) * 30;
  const carbScore    = Math.min(totals.carbs   / macros.carbs,   1) * 10;
  const fatScore     = Math.min(totals.fat     / macros.fat,     1) * 10;
  return Math.round(calScore + proteinScore + carbScore + fatScore);
}

export function scoreGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: "A+", color: "#ffc815" };
  if (score >= 80) return { grade: "A",  color: "#a3e635" };
  if (score >= 70) return { grade: "B",  color: "#86efac" };
  if (score >= 55) return { grade: "C",  color: "#f59e0b" };
  if (score >= 40) return { grade: "D",  color: "#fb923c" };
  return { grade: "F", color: "#f87171" };
}
