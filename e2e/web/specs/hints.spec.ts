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

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row <= 2 && column <= 2,
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    await sudokuBoard.sudokuBoardContainsText(
      "The hint is located in this region"
    );
    await sudokuBoard.hintArrowRight.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 0 && column === 0,
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => row <= 2 && column <= 2,
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    await sudokuBoard.hintArrowRight.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row <= 2 && column <= 2,
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    await sudokuBoard.cellHasValue(0, 0, "1");
    await sudokuBoard.hintFinish.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);

    await sudokuBoard.cellHasValue(0, 0, "1");
  });
});
