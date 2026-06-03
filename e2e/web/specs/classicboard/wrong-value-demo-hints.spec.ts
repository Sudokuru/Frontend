import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { test } from "../../fixture";

const wrongValueDemoCases = [
  {
    cardTestId: "WrongValueDirectConflict",
    difficulty: "wrong-value-direct-conflict",
    wrongCell: { row: 0, column: 3, value: "8" },
    firstStage:
      "The 8 in row 1, column 4 conflicts with another 8 in the same row.",
    secondStage: "Remove the user-entered 8 from row 1, column 4.",
  },
  {
    cardTestId: "WrongValueNoDirectConflict",
    difficulty: "wrong-value-no-direct-conflict",
    wrongCell: { row: 1, column: 1, value: "4" },
    firstStage:
      "The 4 in row 2, column 2 is not the right value for this cell.",
    secondStage: "Remove the user-entered 4 from row 2, column 2.",
  },
];

test.describe("wrong value demo hints", () => {
  for (const demoCase of wrongValueDemoCases) {
    test(`displays the ${demoCase.difficulty} hint all the way through`, async ({
      play,
    }) => {
      await play.getByTestId(demoCase.cardTestId).click();

      const sudokuBoard = new SudokuBoardComponent(play);
      await sudokuBoard.sudokuBoardIsRendered();
      await expect(
        play.getByText(`Difficulty: ${demoCase.difficulty}`),
      ).toBeInViewport({ ratio: 1 });
      await sudokuBoard.cellHasValue(
        demoCase.wrongCell.row,
        demoCase.wrongCell.column,
        demoCase.wrongCell.value,
      );

      await sudokuBoard.hint.click();
      await sudokuBoard.sudokuBoardContainsText("Wrong Value");
      await sudokuBoard.sudokuBoardContainsText(demoCase.firstStage);

      await sudokuBoard.hintArrowRight.click();
      await sudokuBoard.sudokuBoardContainsText(demoCase.secondStage);
      await sudokuBoard.cellIsEmpty(
        demoCase.wrongCell.row,
        demoCase.wrongCell.column,
      );

      await sudokuBoard.hintFinish.click();
      await expect(sudokuBoard.hint).toBeInViewport({ ratio: 1 });
      await sudokuBoard.cellIsEmpty(
        demoCase.wrongCell.row,
        demoCase.wrongCell.column,
      );
    });
  }
});
