import { SudokuBoardComponent } from "./../../components/sudoku-board.component";
import { test } from "../../fixture";
import {
  POINTING_PAIR_CORRECT_DRILL_GAME,
  PROGRESS_INDICATOR_DRILL_DISABLED_PROFILE,
} from "../../data";
import { getSingleMultiSelectKey } from "../../playwright.config";
import {
  SELECTED_COLOR_RGB,
  SELECTED_IDENTICAL_VALUE_COLOR_RGB,
} from "../../../../sudokuru/app/Styling/HighlightColors";
import { expect } from "@playwright/test";
import { EndGameDrillModalComponent } from "../../components/end-game-modal-drill.component";
import { DrillPage } from "../../page/drill.page";
import { HeaderComponent } from "../../components/header.component";
import { ProfilePage } from "../../page/profile.page";

test.describe("hint", () => {
  test.use({ drillGametoResume: POINTING_PAIR_CORRECT_DRILL_GAME });
  const keys = ["h", "H"];
  for (const key of keys) {
    const capital = key === "H" ? "capital " : "";
    test("hint button: " + capital + key, async ({ resumeDrillGame }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
      await sudokuBoard.cell[0][0].click();
      for (let i = 0; i < 6; i++) {
        await sudokuBoard.page.keyboard.press(key);
      }
      const endGameModal = new EndGameDrillModalComponent(resumeDrillGame);
      await endGameModal.endGameModalIsRendered();
    });
  }
});

test.describe("pause", () => {
  const keys = ["button", "p", "P"];
  for (const key of keys) {
    const capital = key === "P" ? "capital " : "";
    test("pause button: " + capital + key, async ({ resumeDrillGame }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
      await sudokuBoard.cell[0][0].click();
      if (key === "button") {
        await sudokuBoard.pause.click();
      } else {
        await sudokuBoard.page.keyboard.press(key);
      }
      const drillPage = new DrillPage(resumeDrillGame);
      await drillPage.drillPageIsRendered();
      await drillPage.resumeButtonIsVisible();

      // verify the existing game is resumed.
      await drillPage.resume.click();
      await sudokuBoard.cellHasValue(0, 0, "6");
      await sudokuBoard.cellHasValue(8, 8, "1");
    });
  }
});

test.describe("typing", () => {
  for (let i = 1; i <= 9; i++) {
    test(`typing ${i} should fill cell with ${i} number`, async ({
      resumeDrillGame,
    }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
      await sudokuBoard.cell[8][0].click();
      await sudokuBoard.cell[8][0].press(i.toString());
      await sudokuBoard.cellHasValue(8, 0, i.toString());
    });
  }

  for (let i = 1; i <= 9; i++) {
    test(`typing ${i} should fill cell with ${i} note`, async ({
      resumeDrillGame,
    }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
      await sudokuBoard.cell[8][0].click();
      await sudokuBoard.note.click();
      await sudokuBoard.cell[8][0].press("7");
      await sudokuBoard.cell[8][0].press(i.toString());
      await sudokuBoard.cellHasNotes(8, 0, i.toString());
    });
  }
});

test.describe("numpad", () => {
  for (let i = 1; i <= 9; i++) {
    test(`clicking numpad ${i} should fill cell with ${i} number`, async ({
      resumeDrillGame,
    }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
      await sudokuBoard.cell[8][0].click();
      await sudokuBoard.numPad[i - 1].click();
      await sudokuBoard.cellHasValue(8, 0, i.toString());
    });
  }

  for (let i = 1; i <= 9; i++) {
    test(`clicking numpad ${i} should fill cell with ${i} note`, async ({
      resumeDrillGame,
    }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
      await sudokuBoard.cell[8][0].click();
      await sudokuBoard.page.keyboard.press("t");
      await sudokuBoard.cell[8][0].press("7");
      await sudokuBoard.numPad[i - 1].click();
      await sudokuBoard.cellHasNotes(8, 0, i.toString());
    });
  }
});

test.describe("progress indicator", () => {
  const initialProgressIndicator = [
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
  ];

  test("should be visible when enabled", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.progressIndicatorRendersCorrectly(
      initialProgressIndicator,
    );
  });

  test("should not change when incorrect cells are added or removed", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[1][1].click();
    await sudokuBoard.cell[1][1].press("1");
    await sudokuBoard.progressIndicatorRendersCorrectly(
      initialProgressIndicator,
    );
    await sudokuBoard.undo.click();
    await sudokuBoard.progressIndicatorRendersCorrectly(
      initialProgressIndicator,
    );
  });

  test("should not change when correct cells are added or removed", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[1][1].click();
    await sudokuBoard.cell[1][1].press("8");
    await sudokuBoard.progressIndicatorRendersCorrectly(
      initialProgressIndicator,
    );
  });
});

test.describe("progress indicator", () => {
  const initialProgressIndicator = [
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
    "100%",
  ];

  test.use({
    profileStorage: PROGRESS_INDICATOR_DRILL_DISABLED_PROFILE,
  });

  test("should not be visible when disabled", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.progressIndicatorIsDisabled(initialProgressIndicator);
  });
});

test.describe("Initialize Notes", () => {
  test("should not affect board state when disabled", async ({ drill }) => {
    const header = new HeaderComponent(drill);
    await header.profile.click();
    const profilePage = new ProfilePage(drill);
    await profilePage.initializeNotesSwitchEnabled.click();
    await expect(profilePage.initializeNotesSwitchDisabled).toBeInViewport({
      ratio: 1,
    });
    await header.drawer.click();
    await header.drawerDrill.click();
    await drill.getByText("Obvious Pair").click();
    const SudokuClassicBoardComponent = new SudokuBoardComponent(drill);
    await SudokuClassicBoardComponent.verifyAllCellsInBoard(async (r, c) => {
      await SudokuClassicBoardComponent.cellIsNotEmpty(r, c);
    });
  });
});

// todo re-add simplify notes tests when we have more advanced obvious single drills
// currently simplify notes functionality in drills is not worth writing tests for since it isn't relevant without the advanced obvious single drills
// since current obvious single drills are the last remaining cell - there is no simplify notes since the game is completed by the last obvious single

test.describe("undo", () => {
  const keys = ["button", "u", "U"];
  for (const key of keys) {
    const capital = key === "U" ? "capital " : "";
    test(
      "Undo button should remove value entered on previous move from keypad with: " +
        capital +
        key,
      async ({ resumeDrillGame }) => {
        const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
        await sudokuBoard.cell[8][0].click();
        await sudokuBoard.cell[8][0].press("1");
        await sudokuBoard.cellHasValue(8, 0, "1");
        if (key === "button") {
          await sudokuBoard.undo.click();
        } else {
          await sudokuBoard.page.keyboard.press(key);
        }
        await sudokuBoard.cellHasNotes(8, 0, "7");
      },
    );
  }

  test("Undo button should remove value entered on previous move from numpad", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[8][0].click();
    await sudokuBoard.numPad[0].click();
    await sudokuBoard.cellHasValue(8, 0, "1");
    await sudokuBoard.page.keyboard.press("U");
    await sudokuBoard.cellHasNotes(8, 0, "7");
  });

  test("Undo button should replace value overridden on previous move with keypad", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[8][0].click();
    await sudokuBoard.cell[8][0].press("2");
    await sudokuBoard.cellHasValue(8, 0, "2");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(8, 0, "7");
  });

  test("Undo button should replace value overridden on previous move with numpad", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[8][0].click();
    await sudokuBoard.numPad[1].click();
    await sudokuBoard.cellHasValue(8, 0, "2");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(8, 0, "7");
  });

  test("Undo button should remove note entered on previous move with keypad", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[8][0].click();
    await sudokuBoard.page.keyboard.press("T");
    await sudokuBoard.cell[8][0].press("1");
    await sudokuBoard.cellHasNotes(8, 0, "17");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(8, 0, "7");
  });

  test("Undo button should remove note entered on previous move with numpad", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[8][0].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.numPad[0].click();
    await sudokuBoard.cellHasNotes(8, 0, "17");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(8, 0, "7");
  });

  test("Undo button should replace note removed on previous move with keypad", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[8][0].click();
    await sudokuBoard.page.keyboard.press("N");
    await sudokuBoard.cell[8][0].press("7");
    await sudokuBoard.cellHasValue(8, 0, "0");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(8, 0, "7");
  });

  test("Undo button should replace note removed on previous move with numpad", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[8][0].click();
    await sudokuBoard.note.click();
    await sudokuBoard.numPad[6].click();
    await sudokuBoard.cellHasValue(8, 0, "0");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(8, 0, "7");
  });

  test("Undo button should function with a note move spanning multiple cells @os-specific", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await resumeDrillGame.keyboard.down(getSingleMultiSelectKey());
    await sudokuBoard.cell[6][3].click();
    await sudokuBoard.cell[7][4].click();

    await sudokuBoard.page.keyboard.press("N");
    await sudokuBoard.numPad[6].click();

    await sudokuBoard.cellHasNotes(6, 3, "47");
    await sudokuBoard.cellHasNotes(7, 4, "58");

    await sudokuBoard.undo.click();

    await sudokuBoard.cellHasNotes(6, 3, "4");
    await sudokuBoard.cellHasNotes(7, 4, "578");
  });
});

test.describe("erase", () => {
  test("Erase button should not exist", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await expect(sudokuBoard.erase).not.toBeInViewport({ ratio: 1 });
  });

  test("Erase hotkey should not work", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[8][0].click();
    await sudokuBoard.cell[8][0].press("1");
    await sudokuBoard.cellHasValue(8, 0, "1");
    await sudokuBoard.page.keyboard.press("e");
    await sudokuBoard.page.keyboard.press("E");
    await sudokuBoard.cellHasValue(8, 0, "1");
  });
});

test.describe("reset", () => {
  test("Reset button should work", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    const keys = ["button", "r", "R"];
    for (const key of keys) {
      await sudokuBoard.cell[8][0].click();
      await sudokuBoard.note.click();
      await sudokuBoard.numPad[6].click();
      await sudokuBoard.cellHasValue(8, 0, "0");

      await resumeDrillGame.keyboard.down(getSingleMultiSelectKey());
      await sudokuBoard.cell[6][3].click();
      await sudokuBoard.cell[7][4].click();
      await sudokuBoard.numPad[6].click();
      await sudokuBoard.cellHasNotes(6, 3, "47");
      await sudokuBoard.cellHasNotes(7, 4, "58");
      await resumeDrillGame.keyboard.up(getSingleMultiSelectKey());

      await sudokuBoard.page.keyboard.press("N");
      await sudokuBoard.cell[5][0].click();
      await sudokuBoard.numPad[0].click();
      await sudokuBoard.cellHasValue(5, 0, "1");

      if (key === "button") {
        await sudokuBoard.reset.click();
      } else {
        await sudokuBoard.page.keyboard.press(key);
      }

      await sudokuBoard.cellHasNotes(8, 0, "7");

      await sudokuBoard.cellHasNotes(6, 3, "4");
      await sudokuBoard.cellHasNotes(7, 4, "578");

      await sudokuBoard.cellHasNotes(5, 0, "9");
    }
  });
});

test.describe("navigate board", () => {
  test("Navigate left to right", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[0][0].click();
    const keys = ["ArrowRight", "d", "D"];
    for (const key of keys) {
      for (let col = 0; col < 9; col++) {
        await sudokuBoard.cellHasColor(
          0,
          col,
          SELECTED_IDENTICAL_VALUE_COLOR_RGB,
        );
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cellHasColor(0, 0, SELECTED_IDENTICAL_VALUE_COLOR_RGB);
    }
  });

  test("Navigate right to left", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[0][8].click();
    const keys = ["ArrowLeft", "a", "A"];
    for (const key of keys) {
      for (let col = 8; col >= 0; col--) {
        await sudokuBoard.cellHasColor(
          0,
          col,
          SELECTED_IDENTICAL_VALUE_COLOR_RGB,
        );
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cellHasColor(0, 8, SELECTED_IDENTICAL_VALUE_COLOR_RGB);
    }
  });

  test("Navigate top to bottom", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[0][0].click();
    const keys = ["ArrowDown", "s", "S"];
    for (const key of keys) {
      for (let row = 0; row < 9; row++) {
        if (row === 5 || row === 8) {
          await sudokuBoard.cellHasColor(row, 0, SELECTED_COLOR_RGB);
        } else {
          await sudokuBoard.cellHasColor(
            row,
            0,
            SELECTED_IDENTICAL_VALUE_COLOR_RGB,
          );
        }
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cellHasColor(0, 0, SELECTED_IDENTICAL_VALUE_COLOR_RGB);
    }
  });

  test("Navigate bottom to top", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[8][0].click();
    const keys = ["ArrowUp", "w", "W"];
    for (const key of keys) {
      for (let row = 8; row >= 0; row--) {
        if (row === 5 || row === 8) {
          await sudokuBoard.cellHasColor(row, 0, SELECTED_COLOR_RGB);
        } else {
          await sudokuBoard.cellHasColor(
            row,
            0,
            SELECTED_IDENTICAL_VALUE_COLOR_RGB,
          );
        }
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cellHasColor(8, 0, SELECTED_COLOR_RGB);
    }
  });
});

test.describe("toggle notes", () => {
  const keys = ["button", "n", "N", "t", "T"];
  for (const key of keys) {
    const capital = key === "N" || key === "T" ? "capital " : "";
    test("toggle notes: " + capital + key, async ({ resumeDrillGame }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
      await sudokuBoard.cell[8][0].click();
      if (key === "button") {
        await sudokuBoard.note.click();
      } else {
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cellHasNotes(8, 0, "7");
      await sudokuBoard.page.keyboard.press("1");
      await sudokuBoard.cellHasNotes(8, 0, "17");
      if (key === "button") {
        await sudokuBoard.note.click();
      } else {
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cell[8][0].press("2");
      await sudokuBoard.cellHasValue(8, 0, "2");
    });
  }
});

test.describe("typing with multiple cells selected", () => {
  test("inserting notes should succeed", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[6][6].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.page.keyboard.press("1");

    await resumeDrillGame.keyboard.down("Shift");

    await sudokuBoard.cell[8][8].click();
    await sudokuBoard.page.keyboard.press("1");

    await sudokuBoard.cellHasNotes(6, 6, "3");
    await sudokuBoard.cellHasValue(6, 7, "8");
    await sudokuBoard.cellHasValue(6, 8, "7");
    await sudokuBoard.cellHasNotes(7, 6, "236");
    await sudokuBoard.cellHasNotes(7, 7, "16");
    await sudokuBoard.cellHasNotes(7, 8, "139");
    await sudokuBoard.cellHasValue(8, 6, "5");
    await sudokuBoard.cellHasValue(8, 7, "4");
    await sudokuBoard.cellHasValue(8, 8, "1");
  });

  test("inserting values should fail", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[6][6].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.page.keyboard.press("1");

    await sudokuBoard.page.keyboard.press("n");
    await resumeDrillGame.keyboard.down("Shift");

    await sudokuBoard.cell[8][8].click();
    await sudokuBoard.page.keyboard.press("1");

    await sudokuBoard.cellHasNotes(6, 6, "13");
    await sudokuBoard.cellHasValue(6, 7, "8");
    await sudokuBoard.cellHasValue(6, 8, "7");
    await sudokuBoard.cellHasNotes(7, 6, "1236");
    await sudokuBoard.cellHasNotes(7, 7, "6");
    await sudokuBoard.cellHasNotes(7, 8, "39");
    await sudokuBoard.cellHasValue(8, 6, "5");
    await sudokuBoard.cellHasValue(8, 7, "4");
    await sudokuBoard.cellHasValue(8, 8, "1");
  });
});

test.describe("numpad with multiple cells selected", () => {
  test("inserting notes should succeed", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[6][6].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.page.keyboard.press("1");

    await resumeDrillGame.keyboard.down("Shift");

    await sudokuBoard.cell[8][8].click();
    await sudokuBoard.numPad[0].click();

    await sudokuBoard.cellHasNotes(6, 6, "3");
    await sudokuBoard.cellHasValue(6, 7, "8");
    await sudokuBoard.cellHasValue(6, 8, "7");
    await sudokuBoard.cellHasNotes(7, 6, "236");
    await sudokuBoard.cellHasNotes(7, 7, "16");
    await sudokuBoard.cellHasNotes(7, 8, "139");
    await sudokuBoard.cellHasValue(8, 6, "5");
    await sudokuBoard.cellHasValue(8, 7, "4");
    await sudokuBoard.cellHasValue(8, 8, "1");
  });

  test("numpad disabled when not in note mode", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[6][6].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.page.keyboard.press("1");

    await sudokuBoard.page.keyboard.press("n");
    await resumeDrillGame.keyboard.down("Shift");

    await sudokuBoard.cell[8][8].click();
    await sudokuBoard.numPad[0].click();

    await sudokuBoard.cellHasNotes(6, 6, "13");
    await sudokuBoard.cellHasValue(6, 7, "8");
    await sudokuBoard.cellHasValue(6, 8, "7");
    await sudokuBoard.cellHasNotes(7, 6, "1236");
    await sudokuBoard.cellHasNotes(7, 7, "6");
    await sudokuBoard.cellHasNotes(7, 8, "39");
    await sudokuBoard.cellHasValue(8, 6, "5");
    await sudokuBoard.cellHasValue(8, 7, "4");
    await sudokuBoard.cellHasValue(8, 8, "1");
  });
});
