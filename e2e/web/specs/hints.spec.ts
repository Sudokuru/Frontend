import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { test } from "../fixture";
import { NAKED_SINGLE_GAME } from "../data";
import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  HINT_SELECTED_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
} from "../../../app/Styling/HighlightColors";

test.describe("board hints", () => {
  test.use({ gameToResume: NAKED_SINGLE_GAME });
  test("NAKED_SINGLE functions", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.hint.click();

    await sudokuBoard.sudokuBoardContainsText("Naked Single");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardContainsText(
      "Naked singles are when you only have one number left as a possibility in a cell"
    );
    await sudokuBoard.hintArrowRight.click();

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (row <= 2 && column <= 2) {
          await sudokuBoard.cellHasColor(
            row,
            column,
            NOT_HIGHLIGHTED_COLOR_RGB
          );
        } else {
          await sudokuBoard.cellHasColor(
            row,
            column,
            HINT_NOT_HIGHLIGHTED_COLOR_RGB
          );
        }
      }
    }

    await sudokuBoard.sudokuBoardContainsText(
      "The hint is located in this region"
    );
    await sudokuBoard.hintArrowRight.click();

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (row === 0 && column === 0) {
          await sudokuBoard.cellHasColor(row, column, HINT_SELECTED_COLOR_RGB);
        } else if (row <= 2 && column <= 2) {
          await sudokuBoard.cellHasColor(
            row,
            column,
            NOT_HIGHLIGHTED_COLOR_RGB
          );
        } else {
          await sudokuBoard.cellHasColor(
            row,
            column,
            HINT_NOT_HIGHLIGHTED_COLOR_RGB
          );
        }
      }
    }

    await sudokuBoard.hintArrowRight.click();

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (row === 0 && column === 0) {
          await sudokuBoard.cellHasColor(row, column, HINT_SELECTED_COLOR_RGB);
        } else if (row <= 2 && column <= 2) {
          await sudokuBoard.cellHasColor(
            row,
            column,
            NOT_HIGHLIGHTED_COLOR_RGB
          );
        } else {
          await sudokuBoard.cellHasColor(
            row,
            column,
            HINT_NOT_HIGHLIGHTED_COLOR_RGB
          );
        }
      }
    }

    await sudokuBoard.cellHasValue(0, 0, "1");
    await sudokuBoard.hintFinish.click();

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        await sudokuBoard.cellHasColor(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
      }
    }

    await sudokuBoard.cellHasValue(0, 0, "1");
  });
});
