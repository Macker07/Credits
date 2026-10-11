import type { Food } from "./tracker-types";

type Product = Record<string, unknown>;
type FoodResponse = { foods: Food[]; error?: string };

export function normalizeOpenFoodFactsProduct(product: Product, index: number): Food {
  const nutrients = (product.nutriments ?? {}) as Record<string, number>;
  const servingQuantity = Math.max(1, Math.min(2000, Number(product.serving_quantity) || 100));
  const factor = servingQuantity / 100;
  const safe = (value: unknown) => Math.max(0, Number(value) || 0);
  return {
    id: `off-${String(product.code || index)}`,
    name: String(product.product_name || product.generic_name || "Unknown product").slice(0, 120),
    brand: String(product.brands || "").slice(0, 120),
    emoji: "🥫",
    calories: Math.round(safe(nutrients["energy-kcal_100g"]) * factor),
    protein: Math.round(safe(nutrients.proteins_100g) * factor * 10) / 10,
    carbs: Math.round(safe(nutrients.carbohydrates_100g) * factor * 10) / 10,
    fat: Math.round(safe(nutrients.fat_100g) * factor * 10) / 10,
    fiber: Math.round(safe(nutrients.fiber_100g) * factor * 10) / 10,
    sugar: Math.round(safe(nutrients.sugars_100g) * factor * 10) / 10,
    sodium: Math.round(safe(nutrients.sodium_100g) * factor * 1000),
    saturatedFat: Math.round(safe(nutrients["saturated-fat_100g"]) * factor * 10) / 10,
    servingAmount: 1,
    servingUnit: String(product.serving_size || `${servingQuantity}g`).slice(0, 40),
    servingGrams: servingQuantity,
    barcode: String(product.code || "").slice(0, 40),
    source: "openfoodfacts",
    verified: false,
    createdAt: new Date().toISOString(),
  };
}

export async function searchFoodDatabase(input: { query?: string; barcode?: string }): Promise<FoodResponse> {
  const query = input.query?.trim();
  const barcode = input.barcode?.trim();
  const native = typeof location !== "undefined" && location.protocol === "capacitor:";
  if (!native) {
    const params = barcode ? `barcode=${encodeURIComponent(barcode)}` : `q=${encodeURIComponent(query ?? "")}`;
    const response = await fetch(`/api/foods?${params}`);
    if (!response.ok) throw new Error("Food service unavailable");
    return response.json() as Promise<FoodResponse>;
  }
  const url = barcode
    ? `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`
    : `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query ?? "")}&search_simple=1&action=process&json=1&page_size=12`;
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Food service unavailable");
  const json = await response.json() as { product?: Product; products?: Product[] };
  const products = json.product ? [json.product] : json.products ?? [];
  return { foods: products.slice(0, 12).map(normalizeOpenFoodFactsProduct).filter((food) => food.calories > 0) };
}
