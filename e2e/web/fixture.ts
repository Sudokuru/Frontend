import { Page, test as base } from "@playwright/test";

// Declare the types of your fixtures.
type MyFixtures = {
  page: Page;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
  page: async ({ page }, use) => {
    await page.goto("");
    await use(page);
  },
});
