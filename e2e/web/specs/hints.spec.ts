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

// todo test that board is unselected when entering hint mode

// todo test that board cannot be selected when entering hint mode

// todo test hotkeys for hint mode

// todo test all variants simplify notes - row, column, box

// todo test hidden single

test.describe("board AMEND_NOTES", () => {
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

    await amendNotesBaseTest(
      sudokuBoard,
      0,
      0,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "value", content: "0" },
      { contentType: "notes", content: "1" },
      { contentType: "notes", content: "1" }
    );
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

    await amendNotesBaseTest(
      sudokuBoard,
      0,
      5,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "27" },
      { contentType: "notes", content: "125678" },
      { contentType: "notes", content: "1568" }
    );
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

    await amendNotesBaseTest(
      sudokuBoard,
      0,
      6,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "25" },
      { contentType: "notes", content: "25689" },
      { contentType: "notes", content: "25689" }
    );
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

    await amendNotesBaseTest(
      sudokuBoard,
      0,
      8,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "124" },
      { contentType: "notes", content: "12489" },
      { contentType: "notes", content: "289" }
    );
  });
});

/**
 * This is a helper function for Amend Notes testing.
 * This tests highlighting at relevant stages, hint undo and 'redo' functionality, and cell content of the hint stages.
 * @param sudokuBoard The playwright sudoku board page object.
 * @param row This is the row (0-8) of the target cell of the hint.
 * @param column This is the column (0-8) of the target cell of the hint.
 * @param hintSelectedColor This is a function provided to determine which cells should be highlighted as causes.
 * @param notHighlightedColor This is a function provided to determine what cells should be left unshaded as groups to focus on during the hint.
 * @param initialCellState This is an object containing the cell content and cell content type for initial cell state.
 * @param stageFourCellNotes This is an object containing the cell content and cell content type for the target cell for hint stage four.
 * @param stageFiveCellNotes This is an object containing the cell content and cell content type for the target cell for hint stage five.
 */
const amendNotesBaseTest = async (
  sudokuBoard: SudokuBoardComponent,
  row: number,
  column: number,
  hintSelectedColor: (row: number, column: number) => boolean,
  notHighlightedColor: (row: number, column: number) => boolean,
  initialCellState: { contentType: "notes" | "value"; content: string },
  stageFourCellNotes: { contentType: "notes" | "value"; content: string },
  stageFiveCellNotes: { contentType: "notes" | "value"; content: string }
) => {
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
  await sudokuBoard.cellHasContent(
    row,
    column,
    initialCellState.content,
    initialCellState.contentType
  );
  await sudokuBoard.hintArrowRight.click();
  await sudokuBoard.cellHasContent(
    row,
    column,
    stageFourCellNotes.content,
    stageFourCellNotes.contentType
  );

  await sudokuBoard.hintArrowRight.click();
  await sudokuBoard.cellHasContent(
    row,
    column,
    stageFiveCellNotes.content,
    stageFiveCellNotes.contentType
  );

  await sudokuBoard.hintArrowLeft.click();
  await sudokuBoard.cellHasContent(
    row,
    column,
    stageFourCellNotes.content,
    stageFourCellNotes.contentType
  );
  await sudokuBoard.hintArrowLeft.click();
  await sudokuBoard.cellHasContent(
    row,
    column,
    initialCellState.content,
    initialCellState.contentType
  );

  await sudokuBoard.hintArrowRight.click();
  await sudokuBoard.cellHasContent(
    row,
    column,
    stageFourCellNotes.content,
    stageFourCellNotes.contentType
  );

  await sudokuBoard.hintArrowRight.click();
  await sudokuBoard.cellHasContent(
    row,
    column,
    stageFiveCellNotes.content,
    stageFiveCellNotes.contentType
  );

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

  await sudokuBoard.cellHasContent(
    row,
    column,
    stageFiveCellNotes.content,
    stageFiveCellNotes.contentType
  );

  // testing undo works at end of hint
  await sudokuBoard.undo.click();
  await sudokuBoard.cellHasContent(
    row,
    column,
    initialCellState.content,
    initialCellState.contentType
  );
};

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
    await sudokuBoard.cellHasValue(0, 0, "1");

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
