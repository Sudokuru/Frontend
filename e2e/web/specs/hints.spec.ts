import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { test } from "../fixture";
import {
  AMEND_NOTES_CORRECT_AND_INCORRECT_CELL_GAME,
  AMEND_NOTES_CORRECT_CELL_GAME,
  AMEND_NOTES_EMPTY_CELL_GAME,
  AMEND_NOTES_INCORRECT_CELL_GAME,
  HIDDEN_SINGLE_COLUMN_GAME,
  HIDDEN_SINGLE_ROW_GAME,
  NAKED_PAIR_BOX_GAME,
  NAKED_SINGLE_GAME,
  SIMPLIFY_NOTES_BOX_GAME,
  SIMPLIFY_NOTES_COLUMN_GAME,
  SIMPLIFY_NOTES_ROW_GAME,
} from "../data";

// todo test that board is unselected when entering hint mode

// todo test that board cannot be selected when entering hint mode

// todo test hotkeys for hint mode

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

    await sudokuBoard.hintBaseTest(
      "AMEND_NOTES",
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

    await sudokuBoard.hintBaseTest(
      "AMEND_NOTES",
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

    await sudokuBoard.hintBaseTest(
      "AMEND_NOTES",
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

    await sudokuBoard.hintBaseTest(
      "AMEND_NOTES",
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

test.describe("board SIMPLIFY_NOTES", () => {
  test.use({ gameToResume: SIMPLIFY_NOTES_ROW_GAME });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 0;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return row === 0 && column === 0;
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "SIMPLIFY_NOTES",
      0,
      5,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "1568" },
      { contentType: "notes", content: "1568" },
      { contentType: "notes", content: "568" }
    );
  });
});

test.describe("board SIMPLIFY_NOTES", () => {
  test.use({ gameToResume: SIMPLIFY_NOTES_COLUMN_GAME });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 0;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return row === 0 && column === 0;
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "SIMPLIFY_NOTES",
      2,
      0,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "147" },
      { contentType: "notes", content: "147" },
      { contentType: "notes", content: "47" }
    );
  });
});

test.describe("board SIMPLIFY_NOTES", () => {
  test.use({ gameToResume: SIMPLIFY_NOTES_BOX_GAME });
  test("with box group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row > 2 && row <= 5 && column >= 6;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return row === 4 && column === 6;
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "SIMPLIFY_NOTES",
      3,
      8,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "2349" },
      { contentType: "notes", content: "2349" },
      { contentType: "notes", content: "239" }
    );
  });
});

test.describe("board NAKED_SINGLE", () => {
  test.use({ gameToResume: NAKED_SINGLE_GAME });
  test("NAKED_SINGLE", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row <= 2 && column <= 2;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return row === 0 && column === 0;
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "NAKED_SINGLE",
      0,
      0,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "1" },
      { contentType: "notes", content: "1" },
      { contentType: "value", content: "1" }
    );
  });
});

test.describe("board NAKED_PAIR", () => {
  test.use({ gameToResume: NAKED_PAIR_BOX_GAME });
  test("with box group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row <= 2 && column > 2 && column < 6;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 1 && column === 3) || (row === 1 && column === 4);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "NAKED_PAIR",
      0,
      3,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "5689" },
      { contentType: "notes", content: "5689" },
      { contentType: "notes", content: "56" }
    );
  });
});

// todo write tests for NAKED_PAIR row and column variant

test.describe("board HIDDEN_SINGLE", () => {
  test.use({ gameToResume: HIDDEN_SINGLE_ROW_GAME });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 4;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 4 && column === 3) ||
        (row === 4 && column === 4) ||
        (row === 4 && column === 5) ||
        (row === 4 && column === 7)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_SINGLE",
      4,
      6,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "249" },
      { contentType: "notes", content: "249" },
      { contentType: "notes", content: "4" }
    );
  });
});

test.describe("board HIDDEN_SINGLE", () => {
  test.use({ gameToResume: HIDDEN_SINGLE_COLUMN_GAME });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 3;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 3) ||
        (row === 1 && column === 3) ||
        (row === 2 && column === 3) ||
        (row === 6 && column === 3) ||
        (row === 7 && column === 3) ||
        (row === 8 && column === 3)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_SINGLE",
      4,
      3,
      hintSelectedColor,
      notHighlightedColor,
      { contentType: "notes", content: "2389" },
      { contentType: "notes", content: "2389" },
      { contentType: "notes", content: "2" }
    );
  });
});

// todo write test for hidden single box variant (need to find example)
