import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.macker07.credits",
  appName: "Credits",
  webDir: "out",
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "Credits",
  },
  server: {
    iosScheme: "capacitor",
    cleartext: false,
  },
};

export default config;
