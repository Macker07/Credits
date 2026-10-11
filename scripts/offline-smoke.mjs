import { chromium } from "playwright-core";
import assert from "node:assert/strict";

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "allow" });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.getByPlaceholder("e.g. Alex").fill("Offline Test");
await page.getByRole("button", { name: "Get Started" }).click();
await page.getByLabel("Age (years)").fill("30");
await page.getByLabel("Weight (kg)").fill("75");
await page.getByLabel("Height (cm)").fill("178");
await page.getByRole("button", { name: "Next", exact: true }).click();
await page.getByRole("button", { name: /Moderate/ }).click();
await page.getByRole("button", { name: "Next", exact: true }).click();
await page.getByRole("button", { name: /Maintain/ }).click();
await page.getByRole("button", { name: /Start Tracking/ }).click();
await page.getByText("Hey, Offline Test").waitFor();

await page.evaluate(async () => { await navigator.serviceWorker.ready; });
await page.reload({ waitUntil: "networkidle" });
assert.ok(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), "service worker should control the app before offline mode");

await context.setOffline(true);
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByText("Hey, Offline Test").waitFor();
await page.getByRole("button", { name: "Log food" }).click();
await page.getByLabel("Food name").fill("Offline oats");
await page.getByLabel("calories").fill("320");
await page.getByLabel("protein").fill("14");
await page.getByLabel("carbs").fill("48");
await page.getByRole("spinbutton", { name: "fat", exact: true }).fill("8");
await page.getByRole("button", { name: "Save to diary" }).click();
await page.getByText("Offline oats").waitFor();
await page.reload({ waitUntil: "domcontentloaded" });
await page.getByText("Offline oats").waitFor();
assert.ok(await page.getByText("320").count(), "offline entry should survive a reload");

await page.locator("nav.tracker-nav").getByRole("button", { name: "Add" }).click();
await page.getByPlaceholder("Search food or brand").fill("online-only-query");
await page.getByRole("button", { name: "Online" }).click();
await page.getByText("Online food search needs an internet connection.").waitFor();

assert.deepEqual(errors, [], `offline browser errors: ${errors.join("\n")}`);
await browser.close();
console.log("Offline smoke test passed: cached launch, calorie logging, persistence, and online-only search boundary.");
