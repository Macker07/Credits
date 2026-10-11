# Credits

Credits is a mobile-first, local-first nutrition tracker built with Next.js 16 and React 19. It tracks calories, macros, micronutrients, meals, recipes, hydration, weight trends and personal goals without requiring an account.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Complete onboarding, or open **More → Load interactive demo data** to explore a populated three-week journal.

## Quality checks

```bash
npm test
npm run lint
npm run build
npm run test:browser # requires a production server on localhost:3000 and Chrome on macOS
npm run build:ios:web
npm run test:ios     # validates the exported native bundle with Chrome on macOS
```

## Main features

- Date-based diary with breakfast, lunch, dinner and snack sections
- Monthly nutrition calendar showing every logged day, daily calories and macros, monthly averages, and tap-through to the full diary
- Full food entry editing, quantity scaling, duplication and undo-delete
- Recent/frequent foods, favourites and reusable meal templates
- Custom food creation and micronutrient fields
- Free packaged-food and barcode lookup through Open Food Facts
- Bowl builder with saved-food, online and barcode ingredients, adjustable quantities, combined macros, servings and expandable ingredient breakdowns
- Hydration tracking and customizable targets
- Weight, waist, body-fat and body-measurement check-ins with a seven-day moving average
- Adaptive calorie estimation after sufficient history
- 14- and 30-day adherence insights
- Configurable units, macro targets, nutrient targets and meal names
- Complete JSON backup/merge restore and CSV diary export
- Installable PWA manifest, offline application shell and notification-permission test
- Migration of the original `cr_log` food history into the versioned v2 tracker
- Native iPhone/iPad shell using Capacitor 8, with on-device data and offline logging

## Data and demo

Tracker data is stored under `credits_tracker_v2` in browser storage. JSON backups contain the entire tracker and profile. Core saved data remains usable offline; online food lookup requires a connection.

Use **More → Load interactive demo data** for 21 days of meals and hydration, weight check-ins, favourites, a recipe, a goal weight and a daily note. Export a backup first if you have data you want to keep.

## Food data

The `/api/foods` route searches Open Food Facts and supports direct barcode lookup. Built-in staples remain available offline. Search results show their source and verification state; users can always create custom foods.

Open Food Facts is community-maintained, so imported records are intentionally not labelled as medically verified. Search requests are length checked, time limited and process-rate-limited; production hosting should add edge rate limiting.

## Privacy and deployment

Credits has no account or cloud-sync system. Nutrition and body data remains in the current browser unless the user exports it. Read the in-app `/privacy` page and [SECURITY.md](SECURITY.md) before deployment.

The active production surface contains only the tracker and `/api/foods`. Older experimental components are excluded from the production repository and are not imported or available in the application. Never add browser-side AI key handling or an unauthenticated health endpoint.

GitHub Actions runs unit tests, lint, the production build and a production dependency audit. Deployment should use Node.js 22 LTS and HTTPS.

## iOS

The committed Xcode project targets iOS 16+ with bundle identifier `com.macker07.credits`. Run `npm run ios:sync`, then `npm run ios:open` to configure your Apple signing team and test it in Xcode. See [IOS_DEPLOYMENT.md](IOS_DEPLOYMENT.md) for the complete archive, TestFlight and App Store checklist.
