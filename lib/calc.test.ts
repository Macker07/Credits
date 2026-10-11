import { describe, expect, it } from "vitest";
import { calcDayScore, calcMacros, calcTDEE, scoreGrade } from "./calc";
import type { Profile } from "./types";

const profile: Profile = { name: "Test", gender: "male", age: 30, weight: 80, height: 180, activityLevel: "moderate", goal: "maintain", useManual: false, manualCal: 0 };

describe("calorie calculations", () => {
  it("uses Mifflin-St Jeor and activity level", () => expect(calcTDEE(profile)).toBe(2759));
  it("honours a positive manual target", () => expect(calcTDEE({ ...profile, useManual: true, manualCal: 2222 })).toBe(2222));
  it("applies weight-loss rate", () => expect(calcTDEE({ ...profile, goal: "lose", lossRate: 0.5 })).toBe(2259));
  it("creates rounded 30/40/30 macro targets", () => expect(calcMacros(2000)).toEqual({ protein: 150, carbs: 200, fat: 67 }));
  it("scores empty days as zero and strong days highly", () => { const macros=calcMacros(2000); expect(calcDayScore({cal:0,protein:0,carbs:0,fat:0},2000,macros)).toBe(0); expect(calcDayScore({cal:1900,protein:150,carbs:190,fat:60},2000,macros)).toBeGreaterThan(90); });
  it("maps scores to stable grades", () => { expect(scoreGrade(90).grade).toBe("A+"); expect(scoreGrade(39).grade).toBe("F"); });
});
