import {
  HIDDEN_PAIR_DRILL_BOX_GAME,
  HIDDEN_PAIR_DRILL_COLUMN_GAME,
  HIDDEN_PAIR_DRILL_ROW_GAME,
  HIDDEN_QUADRUPLET_DRILL_BOX_GAME,
  HIDDEN_QUADRUPLET_DRILL_COLUMN_GAME,
  HIDDEN_QUADRUPLET_DRILL_ROW_GAME,
  HIDDEN_SINGLE_DRILL_BOX_GAME,
  HIDDEN_SINGLE_DRILL_COLUMN_GAME,
  HIDDEN_SINGLE_DRILL_ROW_GAME,
  HIDDEN_TRIPLET_DRILL_BOX_GAME,
  HIDDEN_TRIPLET_DRILL_COLUMN_GAME,
  HIDDEN_TRIPLET_DRILL_ROW_GAME,
  OBVIOUS_PAIR_DRILL_BOX_GAME,
  OBVIOUS_PAIR_DRILL_COLUMN_GAME,
  OBVIOUS_PAIR_DRILL_ROW_GAME,
  OBVIOUS_QUADRUPLET_DRILL_BOX_GAME,
  OBVIOUS_QUADRUPLET_DRILL_COLUMN_GAME,
  OBVIOUS_QUADRUPLET_DRILL_ROW_GAME,
  OBVIOUS_SINGLE_DRILL_GAME,
  OBVIOUS_TRIPLET_DRILL_BOX_GAME,
  OBVIOUS_TRIPLET_DRILL_COLUMN_GAME,
  OBVIOUS_TRIPLET_DRILL_ROW_GAME,
  POINTING_PAIR_CORRECT_DRILL_GAME,
  POINTING_PAIR_DRILL_COLUMN_GAME,
  POINTING_PAIR_DRILL_ROW_GAME,
  POINTING_TRIPLET_DRILL_COLUMN_GAME,
  POINTING_TRIPLET_DRILL_ROW_GAME,
} from "../../data";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { test } from "../../fixture";
import {
  NOT_HIGHLIGHTED_COLOR_RGB,
  SELECTED_IDENTICAL_VALUE_COLOR_RGB,
} from "../../../../sudokuru/app/Styling/HighlightColors";

test.describe("hint mode operates correctly", () => {
  test.use({ drillGametoResume: POINTING_PAIR_CORRECT_DRILL_GAME });

  test("selected cells are unselected when entering hint mode", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[0][0].click();
    await sudokuBoard.cellHasColor(0, 0, SELECTED_IDENTICAL_VALUE_COLOR_RGB);
    await sudokuBoard.hint.click();
    await sudokuBoard.cellHasColor(0, 0, NOT_HIGHLIGHTED_COLOR_RGB);
  });

  test("cells cannot be selected when in hint mode", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cellIsEnabled(0, 0);
    await sudokuBoard.hint.click();
    await sudokuBoard.cellIsDisabled(0, 0);
  });
});

test.describe("board OBVIOUS_SINGLE", () => {
  test.use({ drillGametoResume: OBVIOUS_SINGLE_DRILL_GAME });
  test("OBVIOUS_SINGLE", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row > 5 && column > 5;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return row === 8 && column === 7;
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_SINGLE",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "9", row: 8, column: 7 }],
      [{ contentType: "notes", content: "9", row: 8, column: 7 }],
      [{ contentType: "value", content: "9", row: 8, column: 7 }],
      true,
    );
  });
});

test.describe("board OBVIOUS_PAIR", () => {
  test.use({
    drillGametoResume: OBVIOUS_PAIR_DRILL_ROW_GAME,
  });
  test("with row group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 5;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 5 && column === 0) || (row === 5 && column === 7);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "78", row: 5, column: 6 },
        { contentType: "notes", content: "245", row: 5, column: 4 },
      ],
      [
        { contentType: "notes", content: "78", row: 5, column: 6 },
        { contentType: "notes", content: "245", row: 5, column: 4 },
      ],
      [
        { contentType: "notes", content: "8", row: 5, column: 6 },
        { contentType: "notes", content: "45", row: 5, column: 4 },
      ],
      true,
    );
  });
});

test.describe("board OBVIOUS_PAIR", () => {
  test.use({
    drillGametoResume: OBVIOUS_PAIR_DRILL_COLUMN_GAME,
  });
  test("with column group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 5;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 8 && column === 5) || (row === 6 && column === 5);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "37", row: 3, column: 5 }],
      [{ contentType: "notes", content: "37", row: 3, column: 5 }],
      [{ contentType: "notes", content: "7", row: 3, column: 5 }],
      true,
    );
  });
});

test.describe("board OBVIOUS_PAIR", () => {
  test.use({ drillGametoResume: OBVIOUS_PAIR_DRILL_BOX_GAME });
  test("with box group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row > 5 && column > 5;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 6 && column === 8) || (row === 7 && column === 8);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "45", row: 6, column: 7 }],
      [{ contentType: "notes", content: "45", row: 6, column: 7 }],
      [{ contentType: "notes", content: "4", row: 6, column: 7 }],
      true,
    );
  });
});

test.describe("board OBVIOUS_TRIPLET", () => {
  test.use({
    drillGametoResume: OBVIOUS_TRIPLET_DRILL_ROW_GAME,
  });
  test("with row group", async ({ resumeDrillGame }) => {
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

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "579", row: 1, column: 7 }],
      [{ contentType: "notes", content: "579", row: 1, column: 7 }],
      [{ contentType: "notes", content: "7", row: 1, column: 7 }],
    );
  });
});

test.describe("board OBVIOUS_TRIPLET", () => {
  test.use({
    drillGametoResume: OBVIOUS_TRIPLET_DRILL_COLUMN_GAME,
  });
  test("with column group", async ({ resumeDrillGame }) => {
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

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

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
      ],
    );
  });
});

test.describe("board OBVIOUS_TRIPLET", () => {
  test.use({
    drillGametoResume: OBVIOUS_TRIPLET_DRILL_BOX_GAME,
  });
  test("with box group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row > 2 && column > 2 && row < 6 && column < 6;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 3 && column === 4) ||
        (row === 4 && column === 4) ||
        (row === 5 && column === 5)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "23468", row: 3, column: 5 }],
      [{ contentType: "notes", content: "23468", row: 3, column: 5 }],
      [{ contentType: "notes", content: "68", row: 3, column: 5 }],
    );
  });
});

test.describe("board OBVIOUS_QUADRUPLET", () => {
  test.use({
    drillGametoResume: OBVIOUS_QUADRUPLET_DRILL_ROW_GAME,
  });
  test("with row group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 7;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 7 && column === 0) ||
        (row === 7 && column === 1) ||
        (row === 7 && column === 2) ||
        (row === 7 && column === 3)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "249", row: 7, column: 4 },
        { contentType: "notes", content: "157", row: 7, column: 6 },
      ],
      [
        { contentType: "notes", content: "249", row: 7, column: 4 },
        { contentType: "notes", content: "157", row: 7, column: 6 },
      ],
      [
        { contentType: "notes", content: "9", row: 7, column: 4 },
        { contentType: "notes", content: "1", row: 7, column: 6 },
      ],
    );
  });
});

test.describe("board OBVIOUS_QUADRUPLET", () => {
  test.use({
    drillGametoResume: OBVIOUS_QUADRUPLET_DRILL_COLUMN_GAME,
  });
  test("with column group", async ({ resumeDrillGame }) => {
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

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "OBVIOUS_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "45", row: 1, column: 1 }],
      [{ contentType: "notes", content: "45", row: 1, column: 1 }],
      [{ contentType: "notes", content: "5", row: 1, column: 1 }],
    );
  });
});

test.describe("board OBVIOUS_QUADRUPLET", () => {
  test.use({
    drillGametoResume: OBVIOUS_QUADRUPLET_DRILL_BOX_GAME,
  });
  test("with box group", async ({ resumeDrillGame }) => {
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

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

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
      ],
    );
  });
});

test.describe("board HIDDEN_SINGLE", () => {
  test.use({ drillGametoResume: HIDDEN_SINGLE_DRILL_ROW_GAME });
  test("with row group", async ({ resumeDrillGame }) => {
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

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_SINGLE",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "249", row: 4, column: 6 }],
      [{ contentType: "notes", content: "249", row: 4, column: 6 }],
      [{ contentType: "notes", content: "4", row: 4, column: 6 }],
    );
  });
});

test.describe("board HIDDEN_SINGLE", () => {
  test.use({ drillGametoResume: HIDDEN_SINGLE_DRILL_COLUMN_GAME });
  test("with column group", async ({ resumeDrillGame }) => {
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

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_SINGLE",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "2389", row: 4, column: 3 }],
      [{ contentType: "notes", content: "2389", row: 4, column: 3 }],
      [{ contentType: "notes", content: "2", row: 4, column: 3 }],
    );
  });
});

test.describe("board HIDDEN_SINGLE", () => {
  test.use({
    drillGametoResume: HIDDEN_SINGLE_DRILL_BOX_GAME,
  });
  test("with box group", async ({ resumeDrillGame }) => {
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

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_SINGLE",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "25", row: 0, column: 1 }],
      [{ contentType: "notes", content: "25", row: 0, column: 1 }],
      [{ contentType: "notes", content: "2", row: 0, column: 1 }],
    );
  });
});

test.describe("board HIDDEN_PAIR", () => {
  test.use({
    drillGametoResume: HIDDEN_PAIR_DRILL_ROW_GAME,
  });
  test("with row group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 6;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 6 && column === 0) ||
        (row === 6 && column === 1) ||
        (row === 6 && column === 3) ||
        (row === 6 && column === 4) ||
        (row === 6 && column === 5)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "145678", row: 6, column: 7 },
        { contentType: "notes", content: "14578", row: 6, column: 8 },
      ],
      [
        { contentType: "notes", content: "145678", row: 6, column: 7 },
        { contentType: "notes", content: "14578", row: 6, column: 8 },
      ],
      [
        { contentType: "notes", content: "78", row: 6, column: 7 },
        { contentType: "notes", content: "78", row: 6, column: 8 },
      ],
    );
  });
});

test.describe("board HIDDEN_PAIR", () => {
  test.use({
    drillGametoResume: HIDDEN_PAIR_DRILL_COLUMN_GAME,
  });
  test("with column group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 1;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 6 && column === 1) || (row === 8 && column === 1);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "1568", row: 1, column: 1 },
        { contentType: "notes", content: "158", row: 2, column: 1 },
      ],
      [
        { contentType: "notes", content: "1568", row: 1, column: 1 },
        { contentType: "notes", content: "158", row: 2, column: 1 },
      ],
      [
        { contentType: "notes", content: "58", row: 1, column: 1 },
        { contentType: "notes", content: "58", row: 2, column: 1 },
      ],
    );
  });
});

test.describe("board HIDDEN_PAIR", () => {
  test.use({
    drillGametoResume: HIDDEN_PAIR_DRILL_BOX_GAME,
  });
  test("with box group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row > 2 && row < 6 && column > 5;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return row === 4 && column === 8;
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "389", row: 4, column: 7 }],
      [{ contentType: "notes", content: "389", row: 4, column: 7 }],
      [{ contentType: "notes", content: "89", row: 4, column: 7 }],
    );
  });
});

test.describe("board HIDDEN_TRIPLET", () => {
  test.use({
    drillGametoResume: HIDDEN_TRIPLET_DRILL_ROW_GAME,
  });
  test("with row group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 7;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return row === 7 && column === 6;
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "59", row: 7, column: 0 }],
      [{ contentType: "notes", content: "59", row: 7, column: 0 }],
      [{ contentType: "notes", content: "9", row: 7, column: 0 }],
    );
  });
});

test.describe("board HIDDEN_TRIPLET", () => {
  test.use({
    drillGametoResume: HIDDEN_TRIPLET_DRILL_COLUMN_GAME,
  });
  test("with column group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 1;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 0 && column === 1) || (row === 1 && column === 1);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

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
      ],
    );
  });
});

test.describe("board HIDDEN_TRIPLET", () => {
  test.use({
    drillGametoResume: HIDDEN_TRIPLET_DRILL_BOX_GAME,
  });
  test("with box group", async ({ resumeDrillGame }) => {
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

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

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
      ],
    );
  });
});

test.describe("board HIDDEN_QUADRUPLET", () => {
  test.use({
    drillGametoResume: HIDDEN_QUADRUPLET_DRILL_ROW_GAME,
  });
  test("with row group", async ({ resumeDrillGame }) => {
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

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "47", row: 2, column: 0 }],
      [{ contentType: "notes", content: "47", row: 2, column: 0 }],
      [{ contentType: "notes", content: "7", row: 2, column: 0 }],
    );
  });
});

test.describe("board HIDDEN_QUADRUPLET", () => {
  test.use({
    drillGametoResume: HIDDEN_QUADRUPLET_DRILL_COLUMN_GAME,
  });
  test("with column group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 0;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 1 && column === 0) || (row === 2 && column === 0);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

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
      ],
    );
  });
});

test.describe("board HIDDEN_QUADRUPLET", () => {
  test.use({
    drillGametoResume: HIDDEN_QUADRUPLET_DRILL_BOX_GAME,
  });
  test("with box group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column < 3 && row > 2 && row < 6;
    };

    const hintSelectedColor = (row: number, column: number) => {
      return row === 3 && column === 2;
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "HIDDEN_QUADRUPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "34", row: 3, column: 0 },
        { contentType: "notes", content: "236", row: 4, column: 2 },
      ],
      [
        { contentType: "notes", content: "34", row: 3, column: 0 },
        { contentType: "notes", content: "236", row: 4, column: 2 },
      ],
      [
        { contentType: "notes", content: "4", row: 3, column: 0 },
        { contentType: "notes", content: "26", row: 4, column: 2 },
      ],
    );
  });
});

test.describe("board POINTING_PAIR", () => {
  test.use({
    drillGametoResume: POINTING_PAIR_DRILL_ROW_GAME,
  });
  test("with row group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 0 || (row <= 2 && column >= 3 && column <= 5);
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 0 && column === 3) || (row === 0 && column === 5);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "POINTING_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "25689", row: 0, column: 6 }],
      [{ contentType: "notes", content: "25689", row: 0, column: 6 }],
      [{ contentType: "notes", content: "2589", row: 0, column: 6 }],
    );
  });
});

test.describe("board POINTING_PAIR", () => {
  test.use({
    drillGametoResume: POINTING_PAIR_DRILL_COLUMN_GAME,
  });
  test("with column group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return (
        column === 4 || (row >= 3 && row <= 5 && column >= 3 && column <= 5)
      );
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (row === 3 && column === 4) || (row === 5 && column === 4);
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "POINTING_PAIR",
      hintSelectedColor,
      notHighlightedColor,
      [{ contentType: "notes", content: "89", row: 1, column: 4 }],
      [{ contentType: "notes", content: "89", row: 1, column: 4 }],
      [{ contentType: "notes", content: "8", row: 1, column: 4 }],
    );
  });
});

test.describe("board POINTING_TRIPLET", () => {
  test.use({
    drillGametoResume: POINTING_TRIPLET_DRILL_ROW_GAME,
  });
  test("with row group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return row === 5 || (row > 2 && column > 2 && column < 6 && row < 6);
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 5 && column === 3) ||
        (row === 5 && column === 4) ||
        (row === 5 && column === 5)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "POINTING_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "2567", row: 5, column: 1 },
        { contentType: "notes", content: "23567", row: 5, column: 2 },
      ],
      [
        { contentType: "notes", content: "2567", row: 5, column: 1 },
        { contentType: "notes", content: "23567", row: 5, column: 2 },
      ],
      [
        { contentType: "notes", content: "267", row: 5, column: 1 },
        { contentType: "notes", content: "2367", row: 5, column: 2 },
      ],
    );
  });
});

test.describe("board POINTING_TRIPLET", () => {
  test.use({
    drillGametoResume: POINTING_TRIPLET_DRILL_COLUMN_GAME,
  });
  test("with column group", async ({ resumeDrillGame }) => {
    const notHighlightedColor = (row: number, column: number) => {
      return column === 8 || (row <= 2 && column >= 6);
    };

    const hintSelectedColor = (row: number, column: number) => {
      return (
        (row === 0 && column === 8) ||
        (row === 1 && column === 8) ||
        (row === 2 && column === 8)
      );
    };

    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await sudokuBoard.hintBaseTest(
      "POINTING_TRIPLET",
      hintSelectedColor,
      notHighlightedColor,
      [
        { contentType: "notes", content: "3469", row: 7, column: 8 },
        { contentType: "notes", content: "2469", row: 8, column: 8 },
      ],
      [
        { contentType: "notes", content: "3469", row: 7, column: 8 },
        { contentType: "notes", content: "2469", row: 8, column: 8 },
      ],
      [
        { contentType: "notes", content: "346", row: 7, column: 8 },
        { contentType: "notes", content: "246", row: 8, column: 8 },
      ],
    );
  });
});
