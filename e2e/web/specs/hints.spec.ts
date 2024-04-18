import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { test } from "../fixture";
import { NAKED_SINGLE_GAME } from "../data";

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
    // todo validate highlighting
    await sudokuBoard.sudokuBoardContainsText(
      "The hint is located in this region"
    );
    await sudokuBoard.hintArrowRight.click();
    // todo validate highlighting

    await sudokuBoard.hintArrowRight.click();
    // todo validate highlighting
    await sudokuBoard.cellHasValue(0, 0, "1");

    await sudokuBoard.hintFinish.click();
    // todo validate highlighting

    await sudokuBoard.cellHasValue(0, 0, "1");
  });
});
