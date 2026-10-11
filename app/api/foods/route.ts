import { NextRequest } from "next/server";
import { normalizeOpenFoodFactsProduct } from "@/lib/open-food-facts";
const requests = new Map<string, { count: number; reset: number }>();
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim(); const barcode = request.nextUrl.searchParams.get("barcode")?.trim();
  if ((!q && !barcode) || (q?.length ?? 0) > 100 || (barcode && !/^\d{6,18}$/.test(barcode))) return Response.json({ foods: [], error: "Invalid search" }, { status: 400 });
  const key = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local"; const now = Date.now(); const bucket = requests.get(key);
  if (!bucket || bucket.reset < now) requests.set(key, { count: 1, reset: now + 60_000 }); else if (++bucket.count > 30) return Response.json({ foods: [], error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });
  const url = barcode ? `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json` : `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q!)}&search_simple=1&action=process&json=1&page_size=12`;
  try { const response = await fetch(url, { headers: { "User-Agent": "Credits-Calorie-Tracker/3.0" }, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } }); if (!response.ok) throw new Error(); const json = await response.json() as { product?: Record<string, unknown>; products?: Record<string, unknown>[] }; const products = json.product ? [json.product] : json.products ?? []; return Response.json({ foods: products.slice(0,12).map(normalizeOpenFoodFactsProduct).filter((food) => food.calories > 0) }, { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } }); } catch { return Response.json({ foods: [], error: "Food service unavailable" }, { status: 502 }); }
}
