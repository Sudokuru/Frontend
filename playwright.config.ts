import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv-safe";
import path from "path";

config();
// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
declare const process: {
  env: {
    CI: string;
  };
};

// Converting environment variable into number for easy boolean comparisons
const CI = Number(process.env.CI);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 60000,
  testDir: "./e2e/web",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!CI,
  /* Retry on CI only */
  retries: CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["html"],
    ["junit", { outputFile: "playwright-report/results.xml" }],
    [
      "@bgotink/playwright-coverage",
      /** @type {import('@bgotink/playwright-coverage').CoverageReporterOptions} */ {
        // Path to the root files should be resolved from, most likely your repository root
        sourceRoot: __dirname,
        // This comment was very helpful for getting working syntax for exclude
        // https://github.com/bgotink/playwright-coverage/issues/3#issuecomment-963923625
        exclude: [
          "**/node_modules/**",
          "**/.assets/**",
          "**/.expo/**",
          "**/app/Data/**",
        ],
        // Directory in which to write coverage reports
        resultDir: path.join(__dirname, "playwright-coverage"),
        // Configure the reports to generate.
        // The value is an array of istanbul reports, with optional configuration attached.
        reports: [
          ["html"],
          [
            "lcovonly",
            {
              file: "coverage.lcov",
            },
          ],
          // Log a coverage summary at the end of the test run
          [
            "text-summary",
            {
              file: null,
            },
          ],
        ],
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:8081",
    ignoreHTTPSErrors: true,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    video: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },

    /* Test against branded browsers. */
    {
      name: "Microsoft Edge",
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'cd .. && cd .. && npm run web',
  //   url: 'http://127.0.0.1:8081',
  //   reuseExistingServer: !CI,
  // },
});
