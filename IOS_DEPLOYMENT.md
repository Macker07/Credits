# iOS release guide

Credits ships as a Capacitor 8 app with bundle identifier `com.macker07.credits`. The diary, saved foods, bowls, calendar, profile and progress data are stored on-device and work without a network. Open Food Facts search/barcode lookup—and any future AI or recommendation feature—requires a network connection.

## Prerequisites

- macOS with Xcode 26 or newer and its command-line tools selected
- Node.js 22.13+ (Node 22 LTS is recommended; run `nvm use`)
- An Apple Developer Program membership and an App Store Connect app record
- A unique bundle identifier if `com.macker07.credits` is not registered to your team

## Build and verify

```bash
npm ci
npm test
npm run lint
npm run build
npm run build:ios:web
npm run test:ios
npm run ios:sync
npm run ios:open
```

In Xcode, select the **App** target, choose your Apple development team under **Signing & Capabilities**, then run on at least one current iPhone simulator and one physical iPhone. Test first launch, background/foreground restoration, offline diary entry, bowls, calendar, JSON export/import, and an online barcode lookup.

## Archive and upload

1. In Xcode, set the release version and increment the build number.
2. Select **Any iOS Device (arm64)**, then choose **Product → Archive**.
3. Validate the archive in Organizer, then distribute it to App Store Connect.
4. Complete TestFlight testing before submitting the production version for review.

Every web-code release must run `npm run ios:sync` before archiving so the generated native `public` bundle is current.

## App Store Connect checklist

- Host the privacy policy at a public HTTPS URL. The in-app policy at `/privacy` documents current behavior but does not replace the required public URL.
- Complete App Privacy answers accurately. The current build has no accounts, analytics, advertising, tracking or cloud nutrition storage. Food/barcode search terms are sent to Open Food Facts when the user requests an online lookup.
- Provide iPhone and, because the target supports it, iPad screenshots in the sizes requested by App Store Connect.
- Supply description, keywords, support URL, category, age rating and review contact details.
- State that the app uses only standard HTTPS encryption; `ITSAppUsesNonExemptEncryption` is set to `false`.
- Do not describe nutrition estimates as medical advice. Include reviewer notes explaining that core tracking works offline and online lookup requires internet access.

## Signing and final validation

Signing credentials are intentionally not stored in Git. A release is ready for submission only after Xcode successfully builds an archive with your team, App Store validation passes, the hosted policy/support URLs exist, and TestFlight has been exercised on real hardware.
