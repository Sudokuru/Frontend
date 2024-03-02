import { Page, test as base } from "@playwright/test";
import { ACTIVE_GAME } from "../../cypress/global/testIds";
import { HomePage } from "./page/home.page";
import { PlayPage } from "./page/play.page";

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

// Loads a game from local storage and navigates to resume the game.
export const resumeGame = base.extend<MyFixtures>({
  page: async ({ page }, use) => {
    await page.goto("");
    await page.evaluate(() => {
      window.localStorage.setItem("active_game", ACTIVE_GAME);
    });
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playPage = new PlayPage(page);
    await playPage.page.getByText("Resume Puzzle").click();
    await playPage.playPageIsRendered();
    await use(page);
  },
});
