"use client";

import { useMemo, useState } from "react";
import type { DiaryEntry, Food, Recipe, TrackerData } from "@/lib/tracker-types";
import { dateKey, scaleNutrients, sumNutrients, uid } from "@/lib/tracker";
import { searchFoodDatabase } from "@/lib/open-food-facts";

export default function BowlEditor({ data, onClose, onSave, onSaveFood }: { data: TrackerData; onClose: () => void; onSave: (bowl: Recipe) => void; onSaveFood: (food: Food) => void }) {
  const [name, setName] = useState("");
  const [servings, setServings] = useState(1);
  const [query, setQuery] = useState("");
  const [barcode, setBarcode] = useState("");
  const [remote, setRemote] = useState<Food[]>([]);
  const [ingredients, setIngredients] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const local = useMemo(() => data.foods.filter((food) => `${food.name} ${food.brand ?? ""}`.toLowerCase().includes(query.toLowerCase())).slice(0, 12), [data.foods, query]);
  const totals = sumNutrients(ingredients);

  const add = (food: Food) => setIngredients((items) => [...items, { ...scaleNutrients(food, 1), id: uid(), foodId: food.id, name: food.name, brand: food.brand, emoji: food.emoji, date: dateKey(), meal: "snacks", quantity: 1, servingUnit: food.servingUnit, source: food.source, createdAt: new Date().toISOString() }]);
  const setQuantity = (index: number, quantity: number) => setIngredients((items) => items.map((item, itemIndex) => itemIndex === index ? { ...scaleNutrients(item, quantity / Math.max(item.quantity, 0.01)), quantity } : item));
  const lookup = async (kind: "query" | "barcode") => {
    setLoading(true); setError(""); setRemote([]);
    try {
      const json = await searchFoodDatabase(kind === "query" ? { query } : { barcode });
      setRemote(json.foods ?? []);
    } catch { setError("Online search needs an internet connection. Your saved foods still work offline."); }
    finally { setLoading(false); }
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal bowl-editor" role="dialog" aria-modal="true" aria-label="Build a bowl"><div className="modal-head"><div><span className="eyebrow">COMBINE INGREDIENTS</span><h2>Build a bowl</h2></div><button aria-label="Close" onClick={onClose}>×</button></div><div className="form-grid"><label className="full">Bowl name<input autoFocus placeholder="e.g. Overnight oats" value={name} onChange={(event) => setName(event.target.value)} /></label><label>Servings<input type="number" min="1" step="1" value={servings} onChange={(event) => setServings(Math.max(1, Number(event.target.value) || 1))} /></label></div><div className="search"><input placeholder="Search saved foods" value={query} onChange={(event) => { setQuery(event.target.value); setRemote([]); }} /><button disabled={!query || loading} onClick={() => lookup("query")}>{loading ? "…" : "Online"}</button></div><div className="search bowl-barcode"><input inputMode="numeric" placeholder="Enter ingredient barcode" value={barcode} onChange={(event) => setBarcode(event.target.value)} /><button disabled={!barcode || loading} onClick={() => lookup("barcode")}>Look up</button></div>{error && <p className="callout" role="status">{error}</p>}<div className="ingredient-picker"><span className="eyebrow">ADD FOOD</span>{local.map((food) => <button key={food.id} onClick={() => add(food)}>{food.emoji} {food.name}</button>)}</div>{remote.length > 0 && <div className="bowl-online-results"><span className="eyebrow">ONLINE RESULTS</span>{remote.map((food) => <article className="food-row" key={food.id}><button className="food-main" onClick={() => add(food)}><span className="food-emoji">{food.emoji}</span><span><b>{food.name}</b><small>{food.calories} kcal · tap to add to bowl</small></span></button><button className="save-device" onClick={() => onSaveFood(food)}>Save on device</button></article>)}</div>}<section className="bowl-summary"><div><span className="eyebrow">BOWL TOTAL</span><strong>{Math.round(totals.calories)} kcal</strong></div><div className="bowl-macros"><span>P {Math.round(totals.protein)}g</span><span>C {Math.round(totals.carbs)}g</span><span>F {Math.round(totals.fat)}g</span></div></section>{ingredients.length === 0 ? <div className="empty-state">Add oats, milk, seeds, fruit, honey, or any foods you like.</div> : ingredients.map((ingredient, index) => <article className="bowl-ingredient" key={ingredient.id}><span className="food-emoji">{ingredient.emoji}</span><div><b>{ingredient.name}</b><small>{Math.round(ingredient.calories)} kcal · P {ingredient.protein} · C {ingredient.carbs} · F {ingredient.fat}</small></div><label>Qty<input aria-label={`${ingredient.name} quantity`} type="number" min="0.01" step="0.25" value={ingredient.quantity} onChange={(event) => setQuantity(index, Math.max(0.01, Number(event.target.value) || 0.01))} /></label><button aria-label={`Remove ${ingredient.name}`} onClick={() => setIngredients((items) => items.filter((_, itemIndex) => itemIndex !== index))}>×</button></article>)}<p className="callout">Per serving: {Math.round(totals.calories / servings)} kcal · P {Math.round(totals.protein / servings)}g · C {Math.round(totals.carbs / servings)}g · F {Math.round(totals.fat / servings)}g</p><button className="wide" disabled={!name.trim() || ingredients.length === 0} onClick={() => onSave({ id: uid(), name: name.trim(), emoji: "🥣", ingredients, servings, createdAt: new Date().toISOString() })}>Save bowl</button></section></div>;
}
