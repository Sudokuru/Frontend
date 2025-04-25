import { test } from "../fixture";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { PlayPage } from "../page/play.page";
import {
  AMEND_NOTES_EMPTY_CELL_GAME,
  NEW_EMPTY_GAME,
  OBVIOUS_SINGLE_GAME,
  PROGRESS_INDICATOR_DISABLED_PROFILE,
} from "../data";
import { getSingleMultiSelectKey } from "../playwright.config";
import { SELECTED_IDENTICAL_VALUE_COLOR_RGB } from "../../../sudokuru/app/Styling/HighlightColors";
import { ProfilePage } from "../page/profile.page";
import { expect } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";

test.describe("hint", () => {
  test.use({ gameToResume: AMEND_NOTES_EMPTY_CELL_GAME });
  const keys = ["h", "H"];
  for (const key of keys) {
    const capital = key === "H" ? "capital " : "";
    test("hint button: " + capital + key, async ({ resumeGame }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeGame);
      await sudokuBoard.cell[0][0].click();
      await sudokuBoard.page.keyboard.press(key);
      await sudokuBoard.page.keyboard.press(key);
      await sudokuBoard.page.keyboard.press(key);
      await sudokuBoard.page.keyboard.press(key);
      await sudokuBoard.page.keyboard.press(key);
      await sudokuBoard.page.keyboard.press(key);
      await sudokuBoard.cellHasNotes(0, 0, "1");
    });
  }
});

test.describe("pause", () => {
  const keys = ["button", "p", "P"];
  for (const key of keys) {
    const capital = key === "P" ? "capital " : "";
    test("pause button: " + capital + key, async ({ resumeGame }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeGame);
      await sudokuBoard.cell[0][0].click();
      if (key === "button") {
        await sudokuBoard.pause.click();
      } else {
        await sudokuBoard.page.keyboard.press(key);
      }
      const playPage = new PlayPage(resumeGame);
      await playPage.playPageIsRendered();
      await playPage.resumeButtonIsVisible();

      // verify the existing game is resumed.
      await playPage.resume.click();
      await sudokuBoard.cellHasValue(0, 0, "1");
      await sudokuBoard.cellHasValue(8, 8, "9");
    });
  }
});

test.describe("typing", () => {
  for (let i = 1; i <= 9; i++) {
    test(`typing ${i} should fill cell with correct number`, async ({
      resumeGame,
    }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeGame);
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.cell[7][7].press(i.toString());
      await sudokuBoard.cellHasValue(7, 7, i.toString());
    });
  }

  for (let i = 1; i <= 9; i++) {
    test(`typing ${i} should fill cell with correct note`, async ({
      resumeGame,
    }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeGame);
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.note.click();
      await sudokuBoard.cell[7][7].press(i.toString());
      await sudokuBoard.cellHasNotes(7, 7, i.toString());
    });
  }
});

test.describe("numpad", () => {
  for (let i = 1; i <= 9; i++) {
    test(`clicking numpad ${i} should fill cell with correct number`, async ({
      resumeGame,
    }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeGame);
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.numPad[i - 1].click();
      await sudokuBoard.cellHasValue(7, 7, i.toString());
    });
  }

  for (let i = 1; i <= 9; i++) {
    test(`clicking numpad ${i} should fill cell with correct note`, async ({
      resumeGame,
    }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeGame);
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.page.keyboard.press("t");
      await sudokuBoard.numPad[i - 1].click();
      await sudokuBoard.cellHasNotes(7, 7, i.toString());
    });
  }
});

test.describe("progress indicator", () => {
  const initialProgressIndicator = [
    "77.7778%",
    "77.7778%",
    "88.8889%",
    "66.6667%",
    "77.7778%",
    "77.7778%",
    "77.7778%",
    "77.7778%",
    "44.4444%",
  ];

  test.use({
    gameToResume: NEW_EMPTY_GAME,
  });

  test("should be visible when enabled", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.progressIndicatorRendersCorrectly(
      initialProgressIndicator,
    );
  });

  test("should not change when incorrect cells are added or removed", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
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

  test("should change when correct cells are added or removed", async ({
    resumeGame,
  }) => {
    const updatedProgressIndicator = [
      "77.7778%",
      "77.7778%",
      "88.8889%",
      "66.6667%",
      "77.7778%",
      "77.7778%",
      "77.7778%",
      "88.8889%",
      "44.4444%",
    ];
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[1][1].click();
    await sudokuBoard.cell[1][1].press("8");
    await sudokuBoard.progressIndicatorRendersCorrectly(
      updatedProgressIndicator,
    );
  });
});

test.describe("progress indicator", () => {
  const initialProgressIndicator = [
    "77.7778%",
    "77.7778%",
    "88.8889%",
    "66.6667%",
    "77.7778%",
    "77.7778%",
    "77.7778%",
    "77.7778%",
    "44.4444%",
  ];

  test.use({
    gameToResume: NEW_EMPTY_GAME,
    profileStorage: PROGRESS_INDICATOR_DISABLED_PROFILE,
  });

  test("should not be visible when disabled", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.progressIndicatorIsDisabled(initialProgressIndicator);
  });
});

test.describe("Initialize Notes", () => {
  test("should initialize notes for all cells when enabled", async ({
    featurePreview,
  }) => {
    const profilePage = new ProfilePage(featurePreview);
    await expect(profilePage.initializeNotesSwitchEnabled).toBeInViewport({
      ratio: 1,
    });
    await profilePage.initializeNotesSwitchEnabled.click();
    await profilePage.initializeNotesSwitchDisabled.click();
    const headerComponent = new HeaderComponent(featurePreview);
    await headerComponent.drawer.click();
    await headerComponent.drawerPlay.click();
    await featurePreview.getByText("Novice").click();
    const sudokuBoardComponent = new SudokuBoardComponent(featurePreview);
    await sudokuBoardComponent.verifyAllCellsInBoard(async (r, c) => {
      await sudokuBoardComponent.cellIsNotEmpty(r, c);
    });
  });

  test("should not initialize notes for all cells when disabled", async ({
    play,
  }) => {
    await play.getByText("Novice").click();
    const sudokuBoardComponent = new SudokuBoardComponent(play);
    await sudokuBoardComponent.verifyAllCellsInBoard(async (r, c) => {
      await sudokuBoardComponent.cellIsNotNote(r, c);
    });
  });
});

test.describe("Simplify Notes", () => {
  test.use({ gameToResume: OBVIOUS_SINGLE_GAME });
  test("should simplify notes after correct value insertion when enabled", async ({
    resumeGame,
  }) => {
    const headerComponent = new HeaderComponent(resumeGame);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(resumeGame);
    await profilePage.featurePreviewSwitchDisabled.click();
    await expect(profilePage.initializeNotesSwitchEnabled).toBeInViewport({
      ratio: 1,
    });
    await profilePage.initializeNotesSwitchEnabled.click();
    await profilePage.initializeNotesSwitchDisabled.click();
    await headerComponent.drawer.click();
    await headerComponent.drawerPlay.click();
    const playPage = new PlayPage(resumeGame);
    await playPage.resume.click();
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[0][0].click();
    await sudokuBoard.cell[0][0].press("1");
    await sudokuBoard.cellHasContent(0, 5, "568", "notes");
  });

  test("should simplify notes after an incorrect then correct value insertion when enabled", async ({
    resumeGame,
  }) => {
    const headerComponent = new HeaderComponent(resumeGame);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(resumeGame);
    await profilePage.featurePreviewSwitchDisabled.click();
    await expect(profilePage.initializeNotesSwitchEnabled).toBeInViewport({
      ratio: 1,
    });
    await profilePage.initializeNotesSwitchEnabled.click();
    await profilePage.initializeNotesSwitchDisabled.click();
    await headerComponent.drawer.click();
    await headerComponent.drawerPlay.click();
    const playPage = new PlayPage(resumeGame);
    await playPage.resume.click();
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[0][0].click();
    await sudokuBoard.cell[0][0].press("2");
    await sudokuBoard.cell[0][0].press("1");
    await sudokuBoard.cellHasContent(0, 5, "568", "notes");
  });

  test("should not simplify notes after incorrect value insertion when enabled", async ({
    resumeGame,
  }) => {
    const headerComponent = new HeaderComponent(resumeGame);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(resumeGame);
    await profilePage.featurePreviewSwitchDisabled.click();
    await expect(profilePage.initializeNotesSwitchEnabled).toBeInViewport({
      ratio: 1,
    });
    await profilePage.initializeNotesSwitchEnabled.click();
    await profilePage.initializeNotesSwitchDisabled.click();
    await headerComponent.drawer.click();
    await headerComponent.drawerPlay.click();
    const playPage = new PlayPage(resumeGame);
    await playPage.resume.click();
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[0][0].click();
    await sudokuBoard.cell[0][0].press("2");
    await sudokuBoard.cellHasContent(0, 5, "1568", "notes");
  });

  test("should not simplify notes after correct value insertion when disabled", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[0][0].click();
    await sudokuBoard.cell[0][0].press("1");
    await sudokuBoard.cellHasContent(0, 5, "1568", "notes");
  });
});

test.describe("undo", () => {
  const keys = ["button", "u", "U"];
  for (const key of keys) {
    const capital = key === "U" ? "capital " : "";
    test(
      "Undo button should remove value entered on previous move from keypad with: " +
        capital +
        key,
      async ({ resumeGame }) => {
        const sudokuBoard = new SudokuBoardComponent(resumeGame);
        await sudokuBoard.cell[7][7].click();
        await sudokuBoard.cell[7][7].press("1");
        await sudokuBoard.cellHasValue(7, 7, "1");
        if (key === "button") {
          await sudokuBoard.undo.click();
        } else {
          await sudokuBoard.page.keyboard.press(key);
        }
        await sudokuBoard.cellHasValue(7, 7, "0");
      },
    );
  }

  test("Undo button should remove value entered on previous move from numpad", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.numPad[0].click();
    await sudokuBoard.cellHasValue(7, 7, "1");
    await sudokuBoard.page.keyboard.press("U");
    await sudokuBoard.cellHasValue(7, 7, "0");
  });

  test("Undo button should replace value erased on previous move from erase button", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.erase.click();
    await sudokuBoard.cellHasValue(7, 6, "0");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasValue(7, 6, "1");
  });

  test("Undo button should replace notes erased on previous move from erase button", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][8].click();
    await sudokuBoard.erase.click();
    await sudokuBoard.cellHasValue(7, 8, "0");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(7, 8, "45");
  });

  test("Undo button should replace value overridden on previous move with keypad", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.cell[7][6].press("2");
    await sudokuBoard.cellHasValue(7, 6, "2");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasValue(7, 6, "1");
  });

  test("Undo button should replace value overridden on previous move with numpad", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.numPad[1].click();
    await sudokuBoard.cellHasValue(7, 6, "2");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasValue(7, 6, "1");
  });

  test("Undo button should remove note entered on previous move with keypad", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.page.keyboard.press("T");
    await sudokuBoard.cell[7][7].press("1");
    await sudokuBoard.cellHasNotes(7, 7, "1");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasValue(7, 7, "0");
  });

  test("Undo button should remove note entered on previous move with numpad", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.numPad[0].click();
    await sudokuBoard.cellHasNotes(7, 7, "1");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasValue(7, 7, "0");
  });

  test("Undo button should replace note removed on previous move with keypad", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][8].click();
    await sudokuBoard.page.keyboard.press("N");
    await sudokuBoard.cell[7][8].press("5");
    await sudokuBoard.cellHasNotes(7, 8, "4");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(7, 8, "45");
  });

  test("Undo button should replace note removed on previous move with numpad", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][8].click();
    await sudokuBoard.note.click();
    await sudokuBoard.numPad[4].click();
    await sudokuBoard.cellHasNotes(7, 8, "4");
    await sudokuBoard.undo.click();
    await sudokuBoard.cellHasNotes(7, 8, "45");
  });

  test("Undo button should function with a note move spanning multiple cells @os-specific", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await resumeGame.keyboard.down(getSingleMultiSelectKey());
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.cell[7][8].click();

    await sudokuBoard.page.keyboard.press("N");
    await sudokuBoard.numPad[7].click();

    await sudokuBoard.cellHasNotes(7, 7, "8");
    await sudokuBoard.cellHasNotes(7, 8, "458");

    await sudokuBoard.undo.click();

    await sudokuBoard.cellHasValue(7, 7, "0");
    await sudokuBoard.cellHasNotes(7, 8, "45");
  });

  test("Undo button should function with an erase move spanning multiple cells", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[6][6].click();
    await resumeGame.keyboard.down("Shift");
    await sudokuBoard.cell[8][8].click();
    await resumeGame.keyboard.up("Shift");

    await sudokuBoard.erase.click();

    await sudokuBoard.cellHasValue(7, 6, "0");
    await sudokuBoard.cellHasValue(7, 7, "0");
    await sudokuBoard.cellHasValue(7, 8, "0");

    await sudokuBoard.undo.click();

    await sudokuBoard.cellHasValue(7, 6, "1");
    await sudokuBoard.cellHasValue(7, 7, "0");
    await sudokuBoard.cellHasNotes(7, 8, "45");
  });
});

test.describe("erase", () => {
  test("Erase button should be disabled if a cell with a given is selected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellHasValue(0, 2, "3");
    await sudokuBoard.cell[0][2].click();
    await sudokuBoard.eraseButtonIsDisabled();
  });

  test("Erase hotkey should not work if a cell with a given is selected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellHasValue(0, 2, "3");
    await sudokuBoard.cell[0][2].click();
    await sudokuBoard.cell[0][2].press("0");
    await sudokuBoard.cellHasValue(0, 2, "3");
  });

  test("Erase button should be disabled if a cell with a correct value is selected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellHasValue(0, 0, "1");
    await sudokuBoard.cell[0][0].click();
    await sudokuBoard.eraseButtonIsDisabled();
  });

  test("Erase hotkey should not work if a cell with a correct value is selected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellHasValue(0, 0, "1");
    await sudokuBoard.cell[0][0].click();
    await sudokuBoard.cell[0][0].press("0");
    await sudokuBoard.cellHasValue(0, 0, "1");
  });

  test("Erase button should be disabled if an empty cell is selected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellHasValue(7, 7, "0");
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.eraseButtonIsDisabled();
  });

  test("Erasing an incorrect value should succeed for button and all keyboard shortcuts", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.erase.click();
    await sudokuBoard.cellHasValue(7, 6, "0");
    // Use keyboard shortcuts to erase the value
    const keys = ["Delete", "Backspace", "0", "e", "E"];
    for (const key of keys) {
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasValue(7, 6, "1");
      await sudokuBoard.cell[7][6].press(key);
      await sudokuBoard.cellHasValue(7, 6, "0");
    }
  });

  test("Erasing a cell with notes should succeed", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellHasNotes(7, 8, "45");
    await sudokuBoard.cell[7][8].click();
    await sudokuBoard.erase.click();
    await sudokuBoard.cellHasValue(7, 8, "0");
  });

  test("Erasing multiple cells with notes and incorrect values should succeed", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[6][6].click();
    await resumeGame.keyboard.down("Shift");
    await sudokuBoard.cell[8][8].click();
    await resumeGame.keyboard.up("Shift");

    await sudokuBoard.erase.click();

    await sudokuBoard.cellHasValue(7, 6, "0");
    await sudokuBoard.cellHasValue(7, 7, "0");
    await sudokuBoard.cellHasValue(7, 8, "0");
  });

  test("Erase button should be disabled if only multiple correct values and givens are selected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[0][0].click();
    await resumeGame.keyboard.down("Shift");
    await sudokuBoard.cell[2][2].click();
    await resumeGame.keyboard.up("Shift");
    await sudokuBoard.eraseButtonIsDisabled();
  });

  test("Erase hotkey should not work if only multiple correct values and givens are selected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[0][0].click();
    await resumeGame.keyboard.down("Shift");
    await sudokuBoard.cell[2][2].click();
    await resumeGame.keyboard.up("Shift");

    await sudokuBoard.erase.click();

    await sudokuBoard.cellHasValue(0, 0, "1");
  });
});

test.describe("navigate board", () => {
  test("Navigate left to right", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
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

  test("Navigate right to left", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
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

  test("Navigate top to bottom", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[0][0].click();
    const keys = ["ArrowDown", "s", "S"];
    for (const key of keys) {
      for (let row = 0; row < 9; row++) {
        await sudokuBoard.cellHasColor(
          row,
          0,
          SELECTED_IDENTICAL_VALUE_COLOR_RGB,
        );
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cellHasColor(0, 0, SELECTED_IDENTICAL_VALUE_COLOR_RGB);
    }
  });

  test("Navigate bottom to top", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[8][0].click();
    const keys = ["ArrowUp", "w", "W"];
    for (const key of keys) {
      for (let row = 8; row >= 0; row--) {
        await sudokuBoard.cellHasColor(
          row,
          0,
          SELECTED_IDENTICAL_VALUE_COLOR_RGB,
        );
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cellHasColor(8, 0, SELECTED_IDENTICAL_VALUE_COLOR_RGB);
    }
  });
});

test.describe("toggle notes", () => {
  const keys = ["button", "n", "N", "t", "T"];
  for (const key of keys) {
    const capital = key === "N" || key === "T" ? "capital " : "";
    test("toggle notes: " + capital + key, async ({ resumeGame }) => {
      const sudokuBoard = new SudokuBoardComponent(resumeGame);
      await sudokuBoard.cell[7][7].click();
      if (key === "button") {
        await sudokuBoard.note.click();
      } else {
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cellHasValue(7, 7, "0");
      await sudokuBoard.page.keyboard.press("1");
      await sudokuBoard.cellHasNotes(7, 7, "1");
      if (key === "button") {
        await sudokuBoard.note.click();
      } else {
        await sudokuBoard.page.keyboard.press(key);
      }
      await sudokuBoard.cell[7][7].press("2");
      await sudokuBoard.cellHasValue(7, 7, "2");
    });
  }
});

test.describe("typing with multiple cells selected", () => {
  test.use({ gameToResume: NEW_EMPTY_GAME });

  test("inserting notes should succeed", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[3][6].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.page.keyboard.press("1");

    await resumeGame.keyboard.down("Shift");

    await sudokuBoard.cell[5][8].click();
    await sudokuBoard.page.keyboard.press("1");

    await sudokuBoard.cellHasValue(3, 6, "0");
    await sudokuBoard.cellHasNotes(3, 7, "1");
    await sudokuBoard.cellHasNotes(3, 8, "1");
    await sudokuBoard.cellHasNotes(4, 6, "1");
    await sudokuBoard.cellHasNotes(4, 7, "1");
    await sudokuBoard.cellHasValue(4, 8, "8");
    await sudokuBoard.cellHasValue(5, 6, "5");
    await sudokuBoard.cellHasValue(5, 7, "6");
    await sudokuBoard.cellHasValue(5, 8, "4");
  });

  test.use({ gameToResume: NEW_EMPTY_GAME });

  test("inserting values should fail", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[3][6].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.page.keyboard.press("1");

    await sudokuBoard.page.keyboard.press("n");
    await resumeGame.keyboard.down("Shift");

    await sudokuBoard.cell[5][8].click();
    await sudokuBoard.page.keyboard.press("1");

    await sudokuBoard.cellHasNotes(3, 6, "1");
    await sudokuBoard.cellHasValue(3, 7, "0");
    await sudokuBoard.cellHasValue(3, 8, "0");
    await sudokuBoard.cellHasValue(4, 6, "0");
    await sudokuBoard.cellHasValue(4, 7, "0");
    await sudokuBoard.cellHasValue(4, 8, "8");
    await sudokuBoard.cellHasValue(5, 6, "5");
    await sudokuBoard.cellHasValue(5, 7, "6");
    await sudokuBoard.cellHasValue(5, 8, "4");
  });
});

test.describe("numpad with multiple cells selected", () => {
  test.use({ gameToResume: NEW_EMPTY_GAME });
  test("inserting notes should succeed", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[3][6].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.page.keyboard.press("1");

    await resumeGame.keyboard.down("Shift");

    await sudokuBoard.cell[5][8].click();
    await sudokuBoard.numPad[0].click();

    await sudokuBoard.cellHasValue(3, 6, "0");
    await sudokuBoard.cellHasNotes(3, 7, "1");
    await sudokuBoard.cellHasNotes(3, 8, "1");
    await sudokuBoard.cellHasNotes(4, 6, "1");
    await sudokuBoard.cellHasNotes(4, 7, "1");
    await sudokuBoard.cellHasValue(4, 8, "8");
    await sudokuBoard.cellHasValue(5, 6, "5");
    await sudokuBoard.cellHasValue(5, 7, "6");
    await sudokuBoard.cellHasValue(5, 8, "4");
  });

  test("numpad disabled when not in note mode", async ({ resumeGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[3][6].click();
    await sudokuBoard.page.keyboard.press("n");
    await sudokuBoard.page.keyboard.press("1");

    await sudokuBoard.page.keyboard.press("n");
    await resumeGame.keyboard.down("Shift");

    await sudokuBoard.cell[5][8].click();
    await sudokuBoard.numPad[0].click();

    await sudokuBoard.cellHasNotes(3, 6, "1");
    await sudokuBoard.cellHasValue(3, 7, "0");
    await sudokuBoard.cellHasValue(3, 8, "0");
    await sudokuBoard.cellHasValue(4, 6, "0");
    await sudokuBoard.cellHasValue(4, 7, "0");
    await sudokuBoard.cellHasValue(4, 8, "8");
    await sudokuBoard.cellHasValue(5, 6, "5");
    await sudokuBoard.cellHasValue(5, 7, "6");
    await sudokuBoard.cellHasValue(5, 8, "4");
  });
});
