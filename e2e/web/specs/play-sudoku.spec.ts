import { resumeGame } from "../fixture";
import { expect } from "@playwright/test";
import { SudokuPage } from "../page/sudoku.page";
import { PlayPage } from "../page/play.page";

resumeGame.describe("special sudoku buttons", () => {
  resumeGame("pause button", async ({ page }) => {
    const sudokuPage = new SudokuPage(page);
    await sudokuPage.pause.click();
    const playPage = new PlayPage(page);
    await playPage.playPageIsRendered();
  });
});
