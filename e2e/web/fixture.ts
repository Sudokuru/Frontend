import { Page, test as base } from "@playwright/test";
import { HomePage } from "./page/home.page";
import { PlayPage } from "./page/play.page";
import { SudokuBoardComponent } from "./components/sudoku-board.component";
import { HeaderComponent } from "./components/header.component";
import { ContactPage } from "./page/contact.page";
import {
  collectV8CodeCoverageAsync,
  CollectV8CodeCoverageOptions,
} from "./v8-code-coverage";
import { ALMOST_FINISHED_GAME } from "./data";
import { ProfilePage } from "./page/profile.page";

// Declare the interfaces of your fixtures.
interface MyFixtures {
  page: Page;
  resumeGame: Page;
  contact: Page;
  play: Page;
  profile: Page;
  featurePreview: Page;
}

interface MyOptions {
  gameToResume?: any;
  profileSetting?: any;
}

// See https://playwright.dev/docs/test-fixtures and https://playwright.dev/docs/test-parameterize
interface AppFixtures {
  codeCoverageAutoTestFixture: void;
}

// Export the extended test type.
// All tests that use this export 'test' type will have the automatic fixture applied to them.
// Code from https://github.com/edumserrano/playwright-adventures/blob/main/demos/code-coverage-with-monocart-reporter/tests/_shared/app-fixtures.ts
const newBase = base.extend<AppFixtures>({
  codeCoverageAutoTestFixture: [
    async ({ browser, page }, use): Promise<void> => {
      const options: CollectV8CodeCoverageOptions = {
        browserType: browser.browserType(),
        page: page,
        use: use,
        enableJsCoverage: true,
        enableCssCoverage: true,
      };
      await collectV8CodeCoverageAsync(options);
    },
    {
      auto: true,
    },
  ],
});

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = newBase.extend<MyFixtures & MyOptions>({
  gameToResume: [ALMOST_FINISHED_GAME, { option: true }],
  profileSetting: [{}, { option: true }],

  page: async ({ page }, use) => {
    await page.goto("");
    await use(page);
  },
  // Loads a game from local storage and navigates to resume the game.
  resumeGame: async ({ page, gameToResume, profileSetting }, use) => {
    await page.evaluate((gameToResume: JSON) => {
      window.localStorage.setItem("active_game", JSON.stringify(gameToResume));
    }, gameToResume as JSON);
    if (profileSetting) {
      await page.evaluate((profileSetting: JSON) => {
        window.localStorage.setItem("profile", JSON.stringify(profileSetting));
      }, profileSetting as JSON);
    }
    await page.goto("");
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
  // Navigates to the play page.
  play: async ({ page }, use) => {
    await page.goto("");
    const headerComponent = new HeaderComponent(page);
    await headerComponent.drawer.click();
    await headerComponent.drawerPlay.click();
    const playPage = new PlayPage(page);
    await playPage.playPageIsRendered();
    await use(page);
  },
  // Navigates to the profile page.
  profile: async ({ page }, use) => {
    await page.goto("");
    const headerComponent = new HeaderComponent(page);
    await headerComponent.profile.click();
    await use(page);
  },
  // Turns on feature preview
  featurePreview: async ({ page }, use) => {
    await page.goto("");
    const headerComponent = new HeaderComponent(page);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(page);
    await profilePage.featurePreviewSwitchDisabled.click();
    await use(page);
  },
});
