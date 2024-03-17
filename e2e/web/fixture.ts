import { Page, test as base } from "@playwright/test";

import { SudokuBoardComponent } from "./components/sudoku-board.component";
import { HomePage } from "./page/home.page";
import { PlayPage } from "./page/play.page";

// Declare the types of your fixtures.
type MyFixtures = {
  page: Page;
  resumeGame: Page;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
  page: async ({ page }, use) => {
    await page.goto("");
    await use(page);
  },
  // Loads a game from local storage and navigates to resume the game.
  resumeGame: async ({ page }, use) => {
    await page.goto("");
    await page.evaluate(() => {
      const ACTIVE_GAME =
        '[{"variant":"classic","version":"1.0.0","selectedCell":null,"puzzle":[[{"type":"value","entry":1},{"type":"value","entry":2},{"type":"given","entry":3},{"type":"value","entry":6},{"type":"given","entry":7},{"type":"value","entry":5},{"type":"value","entry":9},{"type":"given","entry":4},{"type":"value","entry":8}],[{"type":"value","entry":4},{"type":"value","entry":5},{"type":"given","entry":6},{"type":"value","entry":9},{"type":"value","entry":8},{"type":"given","entry":2},{"type":"given","entry":3},{"type":"value","entry":7},{"type":"given","entry":1}],[{"type":"value","entry":7},{"type":"given","entry":8},{"type":"given","entry":9},{"type":"value","entry":3},{"type":"value","entry":1},{"type":"value","entry":4},{"type":"value","entry":5},{"type":"value","entry":6},{"type":"value","entry":2}],[{"type":"value","entry":9},{"type":"value","entry":6},{"type":"value","entry":4},{"type":"given","entry":1},{"type":"value","entry":5},{"type":"given","entry":7},{"type":"value","entry":2},{"type":"given","entry":8},{"type":"value","entry":3}],[{"type":"given","entry":5},{"type":"given","entry":1},{"type":"given","entry":7},{"type":"value","entry":2},{"type":"value","entry":3},{"type":"value","entry":8},{"type":"value","entry":4},{"type":"value","entry":9},{"type":"given","entry":6}],[{"type":"value","entry":8},{"type":"value","entry":3},{"type":"value","entry":2},{"type":"given","entry":4},{"type":"value","entry":9},{"type":"value","entry":6},{"type":"value","entry":1},{"type":"value","entry":5},{"type":"value","entry":7}],[{"type":"given","entry":2},{"type":"given","entry":7},{"type":"given","entry":1},{"type":"value","entry":8},{"type":"value","entry":4},{"type":"given","entry":9},{"type":"value","entry":6},{"type":"value","entry":3},{"type":"given","entry":5}],[{"type":"value","entry":3},{"type":"given","entry":9},{"type":"given","entry":5},{"type":"value","entry":7},{"type":"value","entry":6},{"type":"value","entry":1},{"type":"value","entry":1},{"type":"value","entry":0},{"type":"note","entry":[4,5]}],[{"type":"value","entry":6},{"type":"value","entry":4},{"type":"value","entry":8},{"type":"value","entry":5},{"type":"given","entry":2},{"type":"value","entry":3},{"type":"value","entry":7},{"type":"value","entry":1},{"type":"value","entry":9}]],"puzzleSolution":[[1,2,3,6,7,5,9,4,8],[4,5,6,9,8,2,3,7,1],[7,8,9,3,1,4,5,6,2],[9,6,4,1,5,7,2,8,3],[5,1,7,2,3,8,4,9,6],[8,3,2,4,9,6,1,5,7],[2,7,1,8,4,9,6,3,5],[3,9,5,7,6,1,8,2,4],[6,4,8,5,2,3,7,1,9]],"statistics":{"difficulty":"easy","internalDifficulty":348,"numHintsUsed":0,"numWrongCellsPlayed":235,"score":0,"time":374},"inNoteMode":false,"actionHistory":[]}]';
      window.localStorage.setItem("active_game", ACTIVE_GAME);
    });
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playPage = new PlayPage(page);
    await playPage.page.getByText("Resume Puzzle").click();
    const sudokuBoard = new SudokuBoardComponent(page);
    await sudokuBoard.sudokuBoardIsRendered();
    await use(page);
  },
});
