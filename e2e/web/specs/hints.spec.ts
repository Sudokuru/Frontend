import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { test } from "../fixture";
import {
  AMEND_NOTES_CORRECT_AND_INCORRECT_CELL_GAME,
  AMEND_NOTES_CORRECT_CELL_GAME,
  AMEND_NOTES_EMPTY_CELL_GAME,
  AMEND_NOTES_INCORRECT_CELL_GAME,
  NAKED_SINGLE_GAME,
} from "../data";
import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  HINT_SELECTED_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
} from "../../../app/Styling/HighlightColors";

test.describe("board AMEND_NOTES", () => {
  // todo test that board is unselected when entering hint mode

  // todo test that board cannot be selected when entering hint mode

  // todo test hotkeys for hint mode

  // todo test all variants amend notes - empty cell, cell with incorrect values, cell with correct values, cell with incorrect and correct values

  // todo test all variants simplify notes - row, column, box

  // todo test hidden single

  test.use({ gameToResume: AMEND_NOTES_EMPTY_CELL_GAME });

  test("with empty cell and 3 groups", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return (row <= 2 && column <= 2) || row === 0 || column === 0;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 2) ||
        (row === 0 && column === 4) ||
        (row === 0 && column === 7) ||
        (row === 1 && column === 2) ||
        (row === 2 && column === 1) ||
        (row === 2 && column === 2) ||
        (row === 4 && column === 0) ||
        (row === 6 && column === 0)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.hint.click();

    await sudokuBoard.sudokuBoardContainsText("Amend Notes");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardContainsText(
      "Amend notes are when you reset a cell's notes to contain every nonconflicting number"
    );
    await sudokuBoard.hintArrowRight.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => notHighlightedColor(row, column),
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
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    // testing undo logic
    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasValue(0, 0, "0");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 0, "1");

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 0, "1");

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    await sudokuBoard.hintFinish.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);

    await sudokuBoard.cellHasNotes(0, 0, "1");

    // testing undo works at end of hint
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasValue(0, 0, "0");
  });
});

test.describe("board AMEND_NOTES", () => {
  test.use({ gameToResume: AMEND_NOTES_INCORRECT_CELL_GAME });

  test("with incorrect notes and 2 groups (rows)", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 0 || column === 5;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 2) ||
        (row === 0 && column === 4) ||
        (row === 0 && column === 7) ||
        (row === 1 && column === 5) ||
        (row === 6 && column === 5)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.hint.click();

    await sudokuBoard.sudokuBoardContainsText("Amend Notes");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardContainsText(
      "Amend notes are when you reset a cell's notes to contain every nonconflicting number"
    );
    await sudokuBoard.hintArrowRight.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => notHighlightedColor(row, column),
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
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    // testing undo logic
    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasNotes(0, 5, "27");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 5, "125678");

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 5, "1568");

    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasNotes(0, 5, "125678");
    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasNotes(0, 5, "27");

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 5, "125678");

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 5, "1568");

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    await sudokuBoard.hintFinish.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);

    await sudokuBoard.cellHasNotes(0, 5, "1568");

    // testing undo works at end of hint
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(0, 5, "27");
  });
});

test.describe("board AMEND_NOTES", () => {
  test.use({ gameToResume: AMEND_NOTES_CORRECT_CELL_GAME });

  test("with correct notes and 2 groups (row and box)", async ({
    resumeGame,
  }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return (row <= 2 && column >= 6) || row === 0;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 2) ||
        (row === 0 && column === 4) ||
        (row === 0 && column === 7) ||
        (row === 1 && column === 8)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.hint.click();

    await sudokuBoard.sudokuBoardContainsText("Amend Notes");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardContainsText(
      "Amend notes are when you reset a cell's notes to contain every nonconflicting number"
    );
    await sudokuBoard.hintArrowRight.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => notHighlightedColor(row, column),
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
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    // testing undo logic
    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasNotes(0, 6, "25");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 6, "25689");

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 6, "25689");

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    await sudokuBoard.hintFinish.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);

    await sudokuBoard.cellHasNotes(0, 6, "25689");

    // testing undo works at end of hint
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(0, 6, "25");
  });
});

test.describe("board AMEND_NOTES", () => {
  test.use({ gameToResume: AMEND_NOTES_CORRECT_AND_INCORRECT_CELL_GAME });

  test("with incorrect and correct notes and 2 groups (rows)", async ({
    resumeGame,
  }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 0 || column === 8;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 2) ||
        (row === 0 && column === 4) ||
        (row === 0 && column === 7) ||
        (row === 1 && column === 8) ||
        (row === 4 && column === 8) ||
        (row === 6 && column === 8)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.hint.click();

    await sudokuBoard.sudokuBoardContainsText("Amend Notes");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardContainsText(
      "Amend notes are when you reset a cell's notes to contain every nonconflicting number"
    );
    await sudokuBoard.hintArrowRight.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => notHighlightedColor(row, column),
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
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    // testing undo logic
    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasNotes(0, 8, "124");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 8, "12489");

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 8, "289");

    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasNotes(0, 8, "12489");
    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasNotes(0, 8, "124");

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 8, "12489");

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasNotes(0, 8, "289");

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    await sudokuBoard.hintFinish.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);

    await sudokuBoard.cellHasNotes(0, 8, "289");

    // testing undo works at end of hint
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(0, 8, "124");
  });
});

test.describe("board NAKED_SINGLE", () => {
  test.use({ gameToResume: NAKED_SINGLE_GAME });
  test("NAKED_SINGLE", async ({ resumeGame }) => {
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
    await sudokuBoard.cellHasNotes(0, 0, "1");

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

    // testing undo logic
    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasNotes(0, 0, "1");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasValue(0, 0, "1");

    await sudokuBoard.hintFinish.click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);

    await sudokuBoard.cellHasValue(0, 0, "1");

    // testing undo works at end of hint
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(0, 0, "1");
  });
});
