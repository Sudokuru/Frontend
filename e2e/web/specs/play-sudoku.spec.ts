import { resumeGame } from "../fixture";
import { expect } from "@playwright/test";
import { PlayPage } from "../page/play.page";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { NOT_SELECTED_CONFLICT_COLOR_RGB } from "../../../app/Styling/HighlightColors";

resumeGame.describe("special sudoku buttons", () => {
  resumeGame("pause button", async ({ page }) => {
    const sudokuBoard = new SudokuBoardComponent(page);
    await sudokuBoard.pause.click();
    const playPage = new PlayPage(page);
    await playPage.playPageIsRendered();
  });
});

resumeGame.describe("board highlighting", () => {
  resumeGame(
    "highlighting should render correctly when a cell is selected",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cellHasColor(7, 6, NOT_SELECTED_CONFLICT_COLOR_RGB);
      // todo: finish this test
    }
  );
});
