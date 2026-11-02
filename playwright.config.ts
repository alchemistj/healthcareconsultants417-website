import { defineConfig } from "playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 18641);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "/tmp/hc417-playwright-output",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: [["list"]],
  use: {
    baseURL,
  },
  projects: [
    {
      name: "desktop-1440",
      use: { browserName: "chromium", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "phone-390",
      use: { browserName: "chromium", viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: `${baseURL}/_dev/`,
    env: { ...process.env, PORT: String(port) },
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
