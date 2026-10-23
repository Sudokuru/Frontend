import { expect } from "@playwright/test";
import { test } from "../fixture";
import { HomePage } from "../page/home.page";
import { PlayModesPage } from "../page/play-modes.page";
import { PlayPage } from "../page/play.page";

test.describe("Sudoku modes", () => {
  test("shows only the available Sudoku variants", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playModesPage = new PlayModesPage(page);

    await playModesPage.playModesPageIsRendered();
    await expect(playModesPage.classic).toBeEnabled();
    await expect(playModesPage.focus).toBeDisabled();
  });

  test("opens the classic difficulty page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playModesPage = new PlayModesPage(page);
    await playModesPage.classic.click();

    const playPage = new PlayPage(page);
    await playPage.playPageIsRendered();
  });
});
