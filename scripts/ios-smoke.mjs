import assert from "node:assert/strict";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";

const root = join(process.cwd(), "out");
assert.ok(existsSync(join(root, "index.html")), "Run npm run build:ios:web before the iOS smoke test");

const types = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".txt": "text/plain" };
const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
  let file = normalize(join(root, pathname));
  if (!file.startsWith(root)) {
    response.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) file = join(root, "404.html");
  response.writeHead(file.endsWith("404.html") ? 404 : 200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  await page.getByPlaceholder("e.g. Alex").fill("iOS Test");
  await page.getByRole("button", { name: "Get Started" }).click();
  await page.getByLabel("Age (years)").fill("30");
  await page.getByLabel("Weight (kg)").fill("75");
  await page.getByLabel("Height (cm)").fill("178");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: /Moderate/ }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: /Maintain/ }).click();
  await page.getByRole("button", { name: /Start Tracking/ }).click();
  await page.getByText("Hey, iOS Test").waitFor();
  await context.setOffline(true);
  await page.getByRole("button", { name: "Log food" }).click();
  await page.getByLabel("Food name").fill("Native offline oats");
  await page.getByLabel("calories").fill("320");
  await page.getByLabel("protein").fill("14");
  await page.getByLabel("carbs").fill("48");
  await page.getByRole("spinbutton", { name: "fat", exact: true }).fill("8");
  await page.getByRole("button", { name: "Save to diary" }).click();
  await page.getByText("Native offline oats").waitFor();
  assert.deepEqual(errors, [], `iOS bundle browser errors: ${errors.join("\n")}`);
  console.log("iOS bundle smoke test passed: static launch, onboarding, offline entry and local persistence.");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
