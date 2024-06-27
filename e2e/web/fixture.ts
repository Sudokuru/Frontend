import { Page, test as base } from "@playwright/test";
import { HomePage } from "./page/home.page";
import { PlayPage } from "./page/play.page";
import { SudokuBoardComponent } from "./components/sudoku-board.component";
import { HeaderComponent } from "./components/header.component";
import { ContactPage } from "./page/contact.page";

import { mixinFixtures as mixinCoverage } from "@bgotink/playwright-coverage";
import { ALMOST_FINISHED_GAME } from "./data";

// Declare the types of your fixtures.
type MyFixtures = {
  page: Page;
  resumeGame: Page;
  contact: Page;
};

type MyOptions = {
  gameToResume?: string;
};

const newBase = mixinCoverage(base);

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = newBase.extend<MyFixtures & MyOptions>({
  gameToResume: [ALMOST_FINISHED_GAME, { option: true }],

  page: async ({ page }, use) => {
    await page.goto("");
    await use(page);
  },
  // Loads a game from local storage and navigates to resume the game.
  resumeGame: async ({ page, gameToResume }, use) => {
    await page.goto("");
    await page.evaluate((gameToResume) => {
      window.localStorage.setItem("active_game", gameToResume);
    }, gameToResume as string);
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playPage = new PlayPage(page);
    await playPage.page.getByText("Resume Puzzle").click();
    const sudokuBoard = new SudokuBoardComponent(page);
    await sudokuBoard.sudokuBoardIsRendered();
    await use(page);
  },
  // Navigates to the contact page.
  contact: async ({ page }, use) => {
    await page.goto("");
    const headerComponent = new HeaderComponent(page);
    await headerComponent.drawer.click();
    await headerComponent.drawerContact.click();
    const contactPage = new ContactPage(page);
    await contactPage.contactPageIsRendered();
    await use(page);
  },
});
