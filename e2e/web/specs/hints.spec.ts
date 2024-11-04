import {
  AMEND_NOTES_CORRECT_AND_INCORRECT_CELL_GAME,
  AMEND_NOTES_CORRECT_CELL_GAME,
  AMEND_NOTES_EMPTY_CELL_GAME,
  AMEND_NOTES_INCORRECT_CELL_GAME,
  HIDDEN_PAIR_BOX_GAME,
  HIDDEN_PAIR_COLUMN_GAME,
  HIDDEN_PAIR_PROFILE,
  HIDDEN_PAIR_ROW_GAME,
  HIDDEN_QUADRUPLET_BOX_GAME,
  HIDDEN_QUADRUPLET_COLUMN_GAME,
  HIDDEN_QUADRUPLET_PROFILE,
  HIDDEN_QUADRUPLET_ROW_GAME,
  HIDDEN_SINGLE_BOX_GAME,
  HIDDEN_SINGLE_COLUMN_GAME,
  HIDDEN_SINGLE_PROFILE,
  HIDDEN_SINGLE_ROW_GAME,
  HIDDEN_TRIPLET_BOX_GAME,
  HIDDEN_TRIPLET_COLUMN_GAME,
  HIDDEN_TRIPLET_PROFILE,
  HIDDEN_TRIPLET_ROW_GAME,
  OBVIOUS_PAIR_BOX_GAME,
  OBVIOUS_PAIR_COLUMN_GAME,
  OBVIOUS_PAIR_PROFILE,
  OBVIOUS_PAIR_ROW_GAME,
  OBVIOUS_QUADRUPLET_BOX_GAME,
  OBVIOUS_QUADRUPLET_COLUMN_GAME,
  OBVIOUS_QUADRUPLET_PROFILE,
  OBVIOUS_QUADRUPLET_ROW_GAME,
  OBVIOUS_SINGLE_GAME,
  OBVIOUS_TRIPLET_BOX_GAME,
  OBVIOUS_TRIPLET_COLUMN_GAME,
  OBVIOUS_TRIPLET_PROFILE,
  OBVIOUS_TRIPLET_ROW_GAME,
  POINTING_PAIR_COLUMN_GAME,
  POINTING_PAIR_PROFILE,
  POINTING_PAIR_ROW_GAME,
  POINTING_TRIPLET_COLUMN_GAME,
  POINTING_TRIPLET_PROFILE,
  POINTING_TRIPLET_ROW_GAME,
  SIMPLIFY_NOTES_BOX_GAME,
  SIMPLIFY_NOTES_COLUMN_GAME,
  SIMPLIFY_NOTES_ROW_GAME,
} from "../data";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { test } from "../fixture";
import {
  NOT_HIGHLIGHTED_COLOR_RGB,
  SELECTED_COLOR_RGB,
} from "../../../app/Styling/HighlightColors";

test.describe("hint mode operates correctly", () => {
  test.use({ gameToResume: AMEND_NOTES_EMPTY_CELL_GAME });

  test("selected cells are unselected when entering hint mode", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[0][0].click();
    await sudokuBoard.cellHasColor(0, 0, SELECTED_COLOR_RGB);
    await sudokuBoard.hint.click();
    await sudokuBoard.cellHasColor(0, 0, NOT_HIGHLIGHTED_COLOR_RGB);
  });

  test("cells cannot be selected when in hint mode", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellIsEnabled(0, 0);
    await sudokuBoard.hint.click();
    await sudokuBoard.cellIsDisabled(0, 0);
  });
});

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

test.describe("board OBVIOUS_SINGLE", () => {
  test.use({ gameToResume: OBVIOUS_SINGLE_GAME });
  test("OBVIOUS_SINGLE", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row <= 2 && column <= 2;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return row === 0 && column === 0;
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_SINGLE",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "1", row: 0, column: 0 }],
      [{ contentType: "notes", content: "1", row: 0, column: 0 }],
      [{ contentType: "value", content: "1", row: 0, column: 0 }]
    );
  });
});

test.describe("board OBVIOUS_PAIR", () => {
  test.use({
    gameToResume: OBVIOUS_PAIR_ROW_GAME,
    profileStorage: OBVIOUS_PAIR_PROFILE,
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
      "OBVIOUS_PAIR",
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

test.describe("board OBVIOUS_PAIR", () => {
  test.use({
    gameToResume: OBVIOUS_PAIR_COLUMN_GAME,
    profileStorage: OBVIOUS_PAIR_PROFILE,
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
      "OBVIOUS_PAIR",
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

test.describe("board OBVIOUS_PAIR", () => {
  test.use({ gameToResume: OBVIOUS_PAIR_BOX_GAME });
  test("with box group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row <= 2 && column > 2 && column < 6;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 1 && column === 3) || (row === 1 && column === 4);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_PAIR",
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

test.describe("board OBVIOUS_TRIPLET", () => {
  test.use({
    gameToResume: OBVIOUS_TRIPLET_ROW_GAME,
    profileStorage: OBVIOUS_TRIPLET_PROFILE,
  });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 1;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 1 && column === 1) ||
        (row === 1 && column === 3) ||
        (row === 1 && column === 4)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "579", row: 1, column: 7 }],
      [{ contentType: "notes", content: "579", row: 1, column: 7 }],
      [{ contentType: "notes", content: "7", row: 1, column: 7 }]
    );
  });
});

test.describe("board OBVIOUS_TRIPLET", () => {
  test.use({
    gameToResume: OBVIOUS_TRIPLET_COLUMN_GAME,
    profileStorage: OBVIOUS_TRIPLET_PROFILE,
  });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 4;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 1 && column === 4) ||
        (row === 4 && column === 4) ||
        (row === 7 && column === 4)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "35689", row: 5, column: 4 },
        { contentType: "notes", content: "569", row: 3, column: 4 },
      ],
      [
        { contentType: "notes", content: "35689", row: 5, column: 4 },
        { contentType: "notes", content: "569", row: 3, column: 4 },
      ],
      [
        { contentType: "notes", content: "59", row: 5, column: 4 },
        { contentType: "notes", content: "59", row: 3, column: 4 },
      ]
    );
  });
});

test.describe("board OBVIOUS_TRIPLET", () => {
  test.use({
    gameToResume: OBVIOUS_TRIPLET_BOX_GAME,
    profileStorage: OBVIOUS_TRIPLET_PROFILE,
  });
  test("with box group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row <= 2 && column <= 2;
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
      "OBVIOUS_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "25", row: 0, column: 1 }],
      [{ contentType: "notes", content: "25", row: 0, column: 1 }],
      [{ contentType: "notes", content: "2", row: 0, column: 1 }]
    );
  });
});

test.describe("board OBVIOUS_QUADRUPLET", () => {
  test.use({
    gameToResume: OBVIOUS_QUADRUPLET_ROW_GAME,
    profileStorage: OBVIOUS_QUADRUPLET_PROFILE,
  });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 2;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 2 && column === 0) ||
        (row === 2 && column === 3) ||
        (row === 2 && column === 4) ||
        (row === 2 && column === 5)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "2567", row: 2, column: 6 },
        { contentType: "notes", content: "2567", row: 2, column: 7 },
        { contentType: "notes", content: "27", row: 2, column: 8 },
      ],
      [
        { contentType: "notes", content: "2567", row: 2, column: 6 },
        { contentType: "notes", content: "2567", row: 2, column: 7 },
        { contentType: "notes", content: "27", row: 2, column: 8 },
      ],
      [
        { contentType: "notes", content: "256", row: 2, column: 6 },
        { contentType: "notes", content: "256", row: 2, column: 7 },
        { contentType: "notes", content: "2", row: 2, column: 8 },
      ]
    );
  });
});

test.describe("board OBVIOUS_QUADRUPLET", () => {
  test.use({
    gameToResume: OBVIOUS_QUADRUPLET_COLUMN_GAME,
    profileStorage: OBVIOUS_QUADRUPLET_PROFILE,
  });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 1;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 1) ||
        (row === 3 && column === 1) ||
        (row === 5 && column === 1) ||
        (row === 8 && column === 1)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "45", row: 1, column: 1 }],
      [{ contentType: "notes", content: "45", row: 1, column: 1 }],
      [{ contentType: "notes", content: "5", row: 1, column: 1 }]
    );
  });
});

test.describe("board OBVIOUS_QUADRUPLET", () => {
  test.use({
    gameToResume: OBVIOUS_QUADRUPLET_BOX_GAME,
    profileStorage: OBVIOUS_QUADRUPLET_PROFILE,
  });
  test("with box group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column <= 5 && column >= 3 && row <= 2;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 3) ||
        (row === 0 && column === 5) ||
        (row === 1 && column === 3) ||
        (row === 1 && column === 4)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "356", row: 2, column: 3 },
        { contentType: "notes", content: "1356", row: 2, column: 4 },
        { contentType: "notes", content: "13456", row: 2, column: 5 },
      ],
      [
        { contentType: "notes", content: "356", row: 2, column: 3 },
        { contentType: "notes", content: "1356", row: 2, column: 4 },
        { contentType: "notes", content: "13456", row: 2, column: 5 },
      ],
      [
        { contentType: "notes", content: "3", row: 2, column: 3 },
        { contentType: "notes", content: "13", row: 2, column: 4 },
        { contentType: "notes", content: "134", row: 2, column: 5 },
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
    profileStorage: HIDDEN_SINGLE_PROFILE,
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

test.describe("board HIDDEN_PAIR", () => {
  test.use({
    gameToResume: HIDDEN_PAIR_ROW_GAME,
    profileStorage: HIDDEN_PAIR_PROFILE,
  });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 1;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 1 && column === 1) ||
        (row === 1 && column === 3) ||
        (row === 1 && column === 4)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "579", row: 1, column: 7 }],
      [{ contentType: "notes", content: "579", row: 1, column: 7 }],
      [{ contentType: "notes", content: "7", row: 1, column: 7 }]
    );
  });
});

test.describe("board HIDDEN_PAIR", () => {
  test.use({
    gameToResume: HIDDEN_PAIR_COLUMN_GAME,
    profileStorage: HIDDEN_PAIR_PROFILE,
  });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 3;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 3) ||
        (row === 2 && column === 3) ||
        (row === 6 && column === 3) ||
        (row === 7 && column === 3) ||
        (row === 8 && column === 3)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "89", row: 1, column: 3 },
        { contentType: "notes", content: "2389", row: 4, column: 3 },
      ],
      [
        { contentType: "notes", content: "89", row: 1, column: 3 },
        { contentType: "notes", content: "2389", row: 4, column: 3 },
      ],
      [
        { contentType: "notes", content: "9", row: 1, column: 3 },
        { contentType: "notes", content: "29", row: 4, column: 3 },
      ]
    );
  });
});

test.describe("board HIDDEN_PAIR", () => {
  test.use({
    gameToResume: HIDDEN_PAIR_BOX_GAME,
    profileStorage: HIDDEN_PAIR_PROFILE,
  });
  test("with box group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row < 3 && column < 3;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 1 && column === 0) || (row === 2 && column === 0);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "45", row: 1, column: 1 }],
      [{ contentType: "notes", content: "45", row: 1, column: 1 }],
      [{ contentType: "notes", content: "5", row: 1, column: 1 }]
    );
  });
});

test.describe("board HIDDEN_TRIPLET", () => {
  test.use({
    gameToResume: HIDDEN_TRIPLET_ROW_GAME,
    profileStorage: HIDDEN_TRIPLET_PROFILE,
  });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 2;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 2 && column === 0) ||
        (row === 2 && column === 3) ||
        (row === 2 && column === 4) ||
        (row === 2 && column === 5)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "2567", row: 2, column: 6 },
        { contentType: "notes", content: "2567", row: 2, column: 7 },
        { contentType: "notes", content: "27", row: 2, column: 8 },
      ],
      [
        { contentType: "notes", content: "2567", row: 2, column: 6 },
        { contentType: "notes", content: "2567", row: 2, column: 7 },
        { contentType: "notes", content: "27", row: 2, column: 8 },
      ],
      [
        { contentType: "notes", content: "256", row: 2, column: 6 },
        { contentType: "notes", content: "256", row: 2, column: 7 },
        { contentType: "notes", content: "2", row: 2, column: 8 },
      ]
    );
  });
});

test.describe("board HIDDEN_TRIPLET", () => {
  test.use({
    gameToResume: HIDDEN_TRIPLET_COLUMN_GAME,
    profileStorage: HIDDEN_TRIPLET_PROFILE,
  });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 1;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 0 && column === 1) || (row === 1 && column === 1);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "2346", row: 3, column: 1 },
        { contentType: "notes", content: "236", row: 5, column: 1 },
      ],
      [
        { contentType: "notes", content: "2346", row: 3, column: 1 },
        { contentType: "notes", content: "236", row: 5, column: 1 },
      ],
      [
        { contentType: "notes", content: "346", row: 3, column: 1 },
        { contentType: "notes", content: "36", row: 5, column: 1 },
      ]
    );
  });
});

test.describe("board HIDDEN_TRIPLET", () => {
  test.use({
    gameToResume: HIDDEN_TRIPLET_BOX_GAME,
    profileStorage: HIDDEN_TRIPLET_PROFILE,
  });
  test("with box group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column <= 5 && column >= 3 && row <= 2;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 3) ||
        (row === 0 && column === 5) ||
        (row === 1 && column === 3) ||
        (row === 1 && column === 4)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "356", row: 2, column: 3 },
        { contentType: "notes", content: "1356", row: 2, column: 4 },
        { contentType: "notes", content: "13456", row: 2, column: 5 },
      ],
      [
        { contentType: "notes", content: "356", row: 2, column: 3 },
        { contentType: "notes", content: "1356", row: 2, column: 4 },
        { contentType: "notes", content: "13456", row: 2, column: 5 },
      ],
      [
        { contentType: "notes", content: "3", row: 2, column: 3 },
        { contentType: "notes", content: "13", row: 2, column: 4 },
        { contentType: "notes", content: "134", row: 2, column: 5 },
      ]
    );
  });
});

test.describe("board HIDDEN_QUADRUPLET", () => {
  test.use({
    gameToResume: HIDDEN_QUADRUPLET_ROW_GAME,
    profileStorage: HIDDEN_QUADRUPLET_PROFILE,
  });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 2;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 2 && column === 3) ||
        (row === 2 && column === 4) ||
        (row === 2 && column === 5)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "47", row: 2, column: 0 }],
      [{ contentType: "notes", content: "47", row: 2, column: 0 }],
      [{ contentType: "notes", content: "7", row: 2, column: 0 }]
    );
  });
});

test.describe("board HIDDEN_QUADRUPLET", () => {
  test.use({
    gameToResume: HIDDEN_QUADRUPLET_COLUMN_GAME,
    profileStorage: HIDDEN_QUADRUPLET_PROFILE,
  });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 0;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 1 && column === 0) || (row === 2 && column === 0);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "3469", row: 3, column: 0 },
        { contentType: "notes", content: "3468", row: 7, column: 0 },
        { contentType: "notes", content: "3468", row: 8, column: 0 },
      ],
      [
        { contentType: "notes", content: "3469", row: 3, column: 0 },
        { contentType: "notes", content: "3468", row: 7, column: 0 },
        { contentType: "notes", content: "3468", row: 8, column: 0 },
      ],
      [
        { contentType: "notes", content: "369", row: 3, column: 0 },
        { contentType: "notes", content: "368", row: 7, column: 0 },
        { contentType: "notes", content: "368", row: 8, column: 0 },
      ]
    );
  });
});

test.describe("board HIDDEN_QUADRUPLET", () => {
  test.use({
    gameToResume: HIDDEN_QUADRUPLET_BOX_GAME,
    profileStorage: HIDDEN_QUADRUPLET_PROFILE,
  });
  test("with box group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column >= 6 && row <= 2;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 2 && column === 6) || (row === 2 && column === 7);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "25689", row: 0, column: 6 },
        { contentType: "notes", content: "579", row: 1, column: 7 },
      ],
      [
        { contentType: "notes", content: "25689", row: 0, column: 6 },
        { contentType: "notes", content: "579", row: 1, column: 7 },
      ],
      [
        { contentType: "notes", content: "289", row: 0, column: 6 },
        { contentType: "notes", content: "79", row: 1, column: 7 },
      ]
    );
  });
});

test.describe("board POINTING_PAIR", () => {
  test.use({
    gameToResume: POINTING_PAIR_ROW_GAME,
    profileStorage: POINTING_PAIR_PROFILE,
  });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 0 || (row <= 2 && column >= 3 && column <= 5);
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 0 && column === 3) || (row === 0 && column === 5);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "POINTING_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "25689", row: 0, column: 6 }],
      [{ contentType: "notes", content: "25689", row: 0, column: 6 }],
      [{ contentType: "notes", content: "2589", row: 0, column: 6 }]
    );
  });
});

test.describe("board POINTING_PAIR", () => {
  test.use({
    gameToResume: POINTING_PAIR_COLUMN_GAME,
    profileStorage: POINTING_PAIR_PROFILE,
  });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return (
        column === 4 || (row >= 3 && row <= 5 && column >= 3 && column <= 5)
      );
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 3 && column === 4) || (row === 5 && column === 4);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "POINTING_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "89", row: 1, column: 4 }],
      [{ contentType: "notes", content: "89", row: 1, column: 4 }],
      [{ contentType: "notes", content: "8", row: 1, column: 4 }]
    );
  });
});

test.describe("board POINTING_TRIPLET", () => {
  test.use({
    gameToResume: POINTING_TRIPLET_ROW_GAME,
    profileStorage: POINTING_TRIPLET_PROFILE,
  });
  test("with row group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 0 || (row <= 2 && column <= 2);
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 0) ||
        (row === 0 && column === 1) ||
        (row === 0 && column === 2)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "POINTING_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "124569", row: 0, column: 3 },
        { contentType: "notes", content: "1234569", row: 0, column: 4 },
      ],
      [
        { contentType: "notes", content: "124569", row: 0, column: 3 },
        { contentType: "notes", content: "1234569", row: 0, column: 4 },
      ],
      [
        { contentType: "notes", content: "14569", row: 0, column: 3 },
        { contentType: "notes", content: "134569", row: 0, column: 4 },
      ]
    );
  });
});

test.describe("board POINTING_TRIPLET", () => {
  test.use({
    gameToResume: POINTING_TRIPLET_COLUMN_GAME,
    profileStorage: POINTING_TRIPLET_PROFILE,
  });
  test("with column group", async ({ resumeGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return (
        column === 4 || (row >= 3 && row <= 5 && column >= 3 && column <= 5)
      );
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 3 && column === 4) ||
        (row === 4 && column === 4) ||
        (row === 5 && column === 4)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeGame);

    await sudokuBoard.hintBaseTest(
      "POINTING_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "89", row: 1, column: 4 }],
      [{ contentType: "notes", content: "89", row: 1, column: 4 }],
      [{ contentType: "notes", content: "8", row: 1, column: 4 }]
    );
  });
});
