import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv-safe";
const { platform } = require("node:process");

config();
// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
declare const process: {
  env: {
    CI: string;
    WORKERS: string;
    CODE_COVERAGE: string;
  };
};

// Converting environment variable into number for easy boolean comparisons
const CI = process.env.CI === "true";
const WORKERS = Number(process.env.WORKERS);
export const CODE_COVERAGE = process.env.CODE_COVERAGE === "true";

// determines how many playwright parallel workers there should be
const workerValue = (CI: boolean, WORKERS: number) => {
  if (WORKERS) {
    return WORKERS;
  } else if (CI) {
    return 1;
  } else {
    return undefined;
  }
};

// Determine platform-specfic single-select key.
// Mac cannot use control key as that is right-click.
export const getSingleMultiSelectKey = () => {
  if (platform === "darwin") {
    return "Meta";
  } else {
    return "Control";
  }
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 120000,
  testDir: ".",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!CI,
  /* Retry on CI only */
  retries: CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: workerValue(CI, WORKERS),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["html"],
    ["junit", { outputFile: "playwright-report/results.xml" }],
    [
      "monocart-reporter",
      {
        name: "Sudokuru Report",
        outputFile: "./test-results/report.html",
        // options: https://github.com/cenfun/monocart-coverage-reports/blob/main/lib/index.d.ts
        coverage: {
          entryFilter: () => true,
          // exclude the generated javascript files that are storing puzzle data
          sourceFilter: (sourcePath: string) =>
            sourcePath.search(/app\/(?!.*_puzzles).+/) !== -1,
          reports: [
            "v8",
            "v8-json",
            "console-summary",
            "html",
            "codecov",
            "codacy",
          ],
        },
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
