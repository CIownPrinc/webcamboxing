import { defineConfig } from "@playwright/test";

import { APP_CONFIG } from "./src/config/app.config";

const baseUrl = `http://${APP_CONFIG.e2e.host}:${APP_CONFIG.e2e.port}`;

export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: baseUrl,
  },
  webServer: {
    command: `pnpm exec vite dev --host ${APP_CONFIG.e2e.host} --port ${APP_CONFIG.e2e.port}`,
    url: baseUrl,
    reuseExistingServer: false,
    timeout: APP_CONFIG.e2e.startupTimeoutMilliseconds,
  },
});
