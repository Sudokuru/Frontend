import {
  HIDDEN_SINGLE_PROFILE,
  NAKED_PAIR_COLUMN_GAME,
  NAKED_PAIR_PROFILE,
  NAKED_PAIR_ROW_GAME,
} from "./../data";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { test } from "../fixture";
import {
  AMEND_NOTES_CORRECT_AND_INCORRECT_CELL_GAME,
  AMEND_NOTES_CORRECT_CELL_GAME,
  AMEND_NOTES_EMPTY_CELL_GAME,
  AMEND_NOTES_INCORRECT_CELL_GAME,
  HIDDEN_SINGLE_BOX_GAME,
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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "value", content: "0", row: 0, column: 0 }],
      [{ contentType: "notes", content: "1", row: 0, column: 0 }],
      [{ contentType: "notes", content: "1", row: 0, column: 0 }]
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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "27", row: 0, column: 5 }],
      [{ contentType: "notes", content: "125678", row: 0, column: 5 }],
      [{ contentType: "notes", content: "1568", row: 0, column: 5 }]
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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "25", row: 0, column: 6 }],
      [{ contentType: "notes", content: "25689", row: 0, column: 6 }],
      [{ contentType: "notes", content: "25689", row: 0, column: 6 }]
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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "124", row: 0, column: 8 }],
      [{ contentType: "notes", content: "12489", row: 0, column: 8 }],
      [{ contentType: "notes", content: "289", row: 0, column: 8 }]
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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "1568", row: 0, column: 5 }],
      [{ contentType: "notes", content: "1568", row: 0, column: 5 }],
      [{ contentType: "notes", content: "568", row: 0, column: 5 }]
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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "147", row: 2, column: 0 }],
      [{ contentType: "notes", content: "147", row: 2, column: 0 }],
      [{ contentType: "notes", content: "47", row: 2, column: 0 }]
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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "2349", row: 3, column: 8 }],
      [{ contentType: "notes", content: "2349", row: 3, column: 8 }],
      [{ contentType: "notes", content: "239", row: 3, column: 8 }]
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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "1", row: 0, column: 0 }],
      [{ contentType: "notes", content: "1", row: 0, column: 0 }],
      [{ contentType: "value", content: "1", row: 0, column: 0 }]
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
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "5689", row: 0, column: 3 },
        { contentType: "notes", content: "568", row: 0, column: 5 },
      ],
      [
        { contentType: "notes", content: "5689", row: 0, column: 3 },
        { contentType: "notes", content: "568", row: 0, column: 5 },
      ],
      [
        { contentType: "notes", content: "56", row: 0, column: 3 },
        { contentType: "notes", content: "56", row: 0, column: 5 },
      ]
    );
  });
});

test.describe("board NAKED_PAIR", () => {
  test.use({
    gameToResume: NAKED_PAIR_COLUMN_GAME,
    profileSetting: NAKED_PAIR_PROFILE,
  });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return (row <= 2 && column <= 2) || column === 0;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 1 && column === 0) || (row === 2 && column === 0);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "NAKED_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "45", row: 1, column: 1 },
        { contentType: "notes", content: "3469", row: 3, column: 0 },
        { contentType: "notes", content: "3468", row: 7, column: 0 },
        { contentType: "notes", content: "3468", row: 8, column: 0 },
      ],
      [
        { contentType: "notes", content: "45", row: 1, column: 1 },
        { contentType: "notes", content: "3469", row: 3, column: 0 },
        { contentType: "notes", content: "3468", row: 7, column: 0 },
        { contentType: "notes", content: "3468", row: 8, column: 0 },
      ],
      [
        { contentType: "notes", content: "5", row: 1, column: 1 },
        { contentType: "notes", content: "369", row: 3, column: 0 },
        { contentType: "notes", content: "368", row: 7, column: 0 },
        { contentType: "notes", content: "368", row: 8, column: 0 },
      ]
    );
  });
});

test.describe("board NAKED_PAIR", () => {
  test.use({
    gameToResume: NAKED_PAIR_ROW_GAME,
    profileSetting: NAKED_PAIR_PROFILE,
  });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return (row <= 2 && column <= 2) || row === 1;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 1 && column === 0) || (row === 1 && column === 1);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "NAKED_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "25", row: 0, column: 1 },
        { contentType: "notes", content: "589", row: 1, column: 3 },
        { contentType: "notes", content: "589", row: 1, column: 4 },
        { contentType: "notes", content: "579", row: 1, column: 7 },
        { contentType: "notes", content: "47", row: 2, column: 0 },
      ],
      [
        { contentType: "notes", content: "25", row: 0, column: 1 },
        { contentType: "notes", content: "589", row: 1, column: 3 },
        { contentType: "notes", content: "589", row: 1, column: 4 },
        { contentType: "notes", content: "579", row: 1, column: 7 },
        { contentType: "notes", content: "47", row: 2, column: 0 },
      ],
      [
        { contentType: "notes", content: "2", row: 0, column: 1 },
        { contentType: "notes", content: "89", row: 1, column: 3 },
        { contentType: "notes", content: "89", row: 1, column: 4 },
        { contentType: "notes", content: "79", row: 1, column: 7 },
        { contentType: "notes", content: "7", row: 2, column: 0 },
      ]
    );
  });
});

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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "249", row: 4, column: 6 }],
      [{ contentType: "notes", content: "249", row: 4, column: 6 }],
      [{ contentType: "notes", content: "4", row: 4, column: 6 }]
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
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "2389", row: 4, column: 3 }],
      [{ contentType: "notes", content: "2389", row: 4, column: 3 }],
      [{ contentType: "notes", content: "2", row: 4, column: 3 }]
    );
  });
});

test.describe("board HIDDEN_SINGLE", () => {
  test.use({
    gameToResume: HIDDEN_SINGLE_BOX_GAME,
    profileSetting: HIDDEN_SINGLE_PROFILE,
  });
  test("with box group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row < 3 && column < 3;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 1 && column === 0) ||
        (row === 1 && column === 1) ||
        (row === 2 && column === 0)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_SINGLE",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "25", row: 0, column: 1 }],
      [{ contentType: "notes", content: "25", row: 0, column: 1 }],
      [{ contentType: "notes", content: "2", row: 0, column: 1 }]
    );
  });
});
