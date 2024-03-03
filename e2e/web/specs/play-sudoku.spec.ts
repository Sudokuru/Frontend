import { resumeGame } from "../fixture";
import { expect } from "@playwright/test";
import { PlayPage } from "../page/play.page";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import {
  NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_SELECTED_CONFLICT_COLOR_RGB,
  PEER_SELECTED_COLOR_RGB,
  SELECTED_COLOR_RGB,
} from "../../../app/Styling/HighlightColors";

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
      await sudokuBoard.cellHasColor(7, 7, NOT_HIGHLIGHTED_COLOR_RGB);
      await sudokuBoard.cell[7][7].click();
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (row === 7 && column === 6) {
            sudokuBoard.cellHasColor(
              row,
              column,
              NOT_SELECTED_CONFLICT_COLOR_RGB
            );
          } else if (row === 7 && column === 7) {
            sudokuBoard.cellHasColor(row, column, SELECTED_COLOR_RGB);
          } else if (row === 7) {
            sudokuBoard.cellHasColor(row, column, PEER_SELECTED_COLOR_RGB);
          } else if (column === 7 && row !== 7) {
            sudokuBoard.cellHasColor(row, column, PEER_SELECTED_COLOR_RGB);
          } else if (row > 5 && column > 5) {
            sudokuBoard.cellHasColor(row, column, PEER_SELECTED_COLOR_RGB);
          } else {
            sudokuBoard.cellHasColor(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
          }
        }
      }
    }
  );
});
