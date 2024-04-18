import { activeGame } from "./../../../app/Api/Puzzle.Types";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { test } from "../fixture";
import { NAKED_SINGLE_GAME } from "../data";

test.describe("board hints", () => {
  // test.use({activeGame: NAKED_SINGLE_GAME});
  test("NAKED_SINGLE functions", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.hint.click();

    await sudokuBoard.sudokuBoardHasText("Naked Single");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardHasText(
      "Naked singles are when you only have one number left as a possibility in a cell"
    );
    await sudokuBoard.hintArrowRight.click();
    // todo validate highlighting
    await sudokuBoard.sudokuBoardHasText("The hint is located in this region");
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
