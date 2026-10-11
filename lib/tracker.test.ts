import { describe, expect, it } from "vitest";
import { adaptiveCalories, convertTrackerUnits, dateKey, demoData, initialData, recipeNutrition, scaleNutrients, sumNutrients, weightTrend } from "./tracker";

describe("tracker domain", () => {
  it("formats local dates without a UTC rollover", () => expect(dateKey(new Date(2026, 7, 18, 23, 30))).toBe("2026-08-18"));
  it("scales all known nutrition values", () => expect(scaleNutrients({ calories: 100, protein: 5, carbs: 10, fat: 2, fiber: 3 }, 1.5)).toEqual({ calories: 150, protein: 7.5, carbs: 15, fat: 3, fiber: 4.5 }));
  it("totals macros and micronutrients", () => expect(sumNutrients([{ calories:100,protein:10,carbs:5,fat:2,fiber:3 },{ calories:50,protein:5,carbs:4,fat:1 }])).toMatchObject({ calories:150,protein:15,carbs:9,fat:3,fiber:3 }));
  it("calculates nutrition per recipe serving", () => { const data=demoData(); expect(recipeNutrition(data.recipes[0]).calories).toBeGreaterThan(0); });
  it("creates a seven-day moving trend", () => { const trend=weightTrend(demoData().weights); expect(trend.points.length).toBeGreaterThan(7); expect(trend.points.at(-1)?.average).toBeTypeOf("number"); });
  it("keeps adaptive targets safe when history is insufficient", () => { const data=initialData(); expect(adaptiveCalories(data)).toBe(data.settings.targetCalories); });
  it("ships a complete interactive demo", () => { const data=demoData(); expect(data.entries.length).toBeGreaterThan(100); expect(data.recipes).toHaveLength(1); expect(data.weights.length).toBeGreaterThan(7); });
  it("converts tracker measurements without merely relabeling them", () => { const data=demoData(); data.settings.goalWeight=70; const imperial=convertTrackerUnits(data,"imperial"); expect(imperial.settings.goalWeight).toBeCloseTo(154.3,1); expect(imperial.weights[0].weight).toBeGreaterThan(150); expect(convertTrackerUnits(imperial,"metric").weights[0].weight).toBeCloseTo(data.weights[0].weight,1); });
  it("does not adapt calories from sparse logging", () => { const data=demoData(); data.entries=data.entries.filter((_,index)=>index%6===0); expect(adaptiveCalories(data)).toBe(data.settings.targetCalories); });
});
