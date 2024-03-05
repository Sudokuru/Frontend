import { resumeGame } from "../fixture";
import { expect } from "@playwright/test";
import { PlayPage } from "../page/play.page";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import {
  IDENTICAL_VALUE_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_SELECTED_CONFLICT_COLOR_RGB,
  PEER_SELECTED_COLOR_RGB,
  SELECTED_COLOR_RGB,
  SELECTED_CONFLICT_COLOR_RGB,
} from "../../../app/Styling/HighlightColors";

resumeGame.describe("pause", () => {
  resumeGame("pause button", async ({ page }) => {
    const sudokuBoard = new SudokuBoardComponent(page);
    await sudokuBoard.pause.click();
    const playPage = new PlayPage(page);
    await playPage.playPageIsRendered();
  });
});

resumeGame.describe("board highlighting", () => {
  resumeGame(
    "highlighting should render correctly when a cell is selected",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cellHasColor(7, 6, NOT_SELECTED_CONFLICT_COLOR_RGB);
      await sudokuBoard.cellHasColor(7, 7, NOT_HIGHLIGHTED_COLOR_RGB);
      await sudokuBoard.cell[7][7].click();
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (row === 7 && column === 6) {
            await sudokuBoard.cellHasColor(
              row,
              column,
              NOT_SELECTED_CONFLICT_COLOR_RGB
            );
          } else if (row === 7 && column === 7) {
            await sudokuBoard.cellHasColor(row, column, SELECTED_COLOR_RGB);
          } else if (row === 7) {
            await sudokuBoard.cellHasColor(
              row,
              column,
              PEER_SELECTED_COLOR_RGB
            );
          } else if (column === 7 && row !== 7) {
            await sudokuBoard.cellHasColor(
              row,
              column,
              PEER_SELECTED_COLOR_RGB
            );
          } else if (row > 5 && column > 5) {
            await sudokuBoard.cellHasColor(
              row,
              column,
              PEER_SELECTED_COLOR_RGB
            );
          } else {
            await sudokuBoard.cellHasColor(
              row,
              column,
              NOT_HIGHLIGHTED_COLOR_RGB
            );
          }
        }
      }
    }
  );

  // TODO: Add test: Board Highlighting should render correctly when cell is unselected

  resumeGame(
    "Board Highlighting should render correctly when cell value is entered",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.cell[7][7].press("1");
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (
            (row === 0 && column === 0) ||
            (row === 1 && column === 8) ||
            (row === 2 && column === 4) ||
            (row === 3 && column === 3) ||
            (row === 4 && column === 1) ||
            (row === 5 && column === 6) ||
            (row === 6 && column === 2) ||
            (row === 7 && column === 5) ||
            (row === 8 && column === 7)
          ) {
            await sudokuBoard.cellHasColor(
              row,
              column,
              IDENTICAL_VALUE_COLOR_RGB
            );
          } else if (row === 7 && column === 6) {
            await sudokuBoard.cellHasColor(
              row,
              column,
              NOT_SELECTED_CONFLICT_COLOR_RGB
            );
          } else if (row === 7 && column === 7) {
            await sudokuBoard.cellHasColor(
              row,
              column,
              SELECTED_CONFLICT_COLOR_RGB
            );
          } else if (row === 7 || column == 7 || (row > 5 && column > 5)) {
            await sudokuBoard.cellHasColor(
              row,
              column,
              PEER_SELECTED_COLOR_RGB
            );
          } else {
            await sudokuBoard.cellHasColor(
              row,
              column,
              NOT_HIGHLIGHTED_COLOR_RGB
            );
          }
        }
      }
    }
  );

  // TODO: Add test: Board Highlighting should render correctly when undo button is entered

  resumeGame(
    "Selecting invalid cell should update highlighting of cell correctly",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][6].click();
      await sudokuBoard.cellHasColor(7, 6, SELECTED_CONFLICT_COLOR_RGB);
    }
  );
});

resumeGame.describe("typing", () => {
  for (let i = 1; i <= 9; i++) {
    resumeGame(
      `typing ${i} should fill cell with correct number`,
      async ({ page }) => {
        const sudokuBoard = new SudokuBoardComponent(page);
        await sudokuBoard.cell[7][7].click();
        await sudokuBoard.cell[7][7].press(i.toString());
        await sudokuBoard.cellHasValue(7, 7, i.toString());
      }
    );
  }

  for (let i = 1; i <= 9; i++) {
    resumeGame(
      `typing ${i} should fill cell with correct nnote`,
      async ({ page }) => {
        const sudokuBoard = new SudokuBoardComponent(page);
        await sudokuBoard.cell[7][7].click();
        await sudokuBoard.note.click();
        await sudokuBoard.cell[7][7].press(i.toString());
        await sudokuBoard.cellHasNotes(7, 7, i.toString());
      }
    );
  }
});

resumeGame.describe("numpad", () => {
  for (let i = 1; i <= 9; i++) {
    resumeGame(
      `clicking numpad ${i} should fill cell with correct number`,
      async ({ page }) => {
        const sudokuBoard = new SudokuBoardComponent(page);
        await sudokuBoard.cell[7][7].click();
        await sudokuBoard.numPad[i - 1].click();
        await sudokuBoard.cellHasValue(7, 7, i.toString());
      }
    );
  }

  for (let i = 1; i <= 9; i++) {
    resumeGame(
      `clicking numpad ${i} should fill cell with correct note`,
      async ({ page }) => {
        const sudokuBoard = new SudokuBoardComponent(page);
        await sudokuBoard.cell[7][7].click();
        await sudokuBoard.note.click();
        await sudokuBoard.numPad[i - 1].click();
        await sudokuBoard.cellHasNotes(7, 7, i.toString());
      }
    );
  }
});

resumeGame.describe("undo", () => {
  resumeGame(
    "Undo button should remove value entered on previous move from keypad",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.cell[7][7].press("1");
      await sudokuBoard.cellHasValue(7, 7, "1");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasValue(7, 7, "0");
    }
  );

  resumeGame(
    "Undo button should remove value entered on previous move from numpad",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.numPad[0].click();
      await sudokuBoard.cellHasValue(7, 7, "1");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasValue(7, 7, "0");
    }
  );

  resumeGame(
    "Undo button should replace value erased on previous move from erase button",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][6].click();
      await sudokuBoard.erase.click();
      await sudokuBoard.cellHasValue(7, 6, "0");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasValue(7, 6, "1");
    }
  );

  resumeGame(
    "Undo button should replace notes erased on previous move from erase button",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][8].click();
      await sudokuBoard.erase.click();
      await sudokuBoard.cellHasValue(7, 8, "0");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasNotes(7, 8, "45");
    }
  );

  resumeGame(
    "Undo button should replace value overridden on previous move with keypad",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][6].click();
      await sudokuBoard.cell[7][6].press("2");
      await sudokuBoard.cellHasValue(7, 6, "2");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasValue(7, 6, "1");
    }
  );

  resumeGame(
    "Undo button should replace value overridden on previous move with numpad",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][6].click();
      await sudokuBoard.numPad[1].click();
      await sudokuBoard.cellHasValue(7, 6, "2");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasValue(7, 6, "1");
    }
  );

  resumeGame(
    "Undo button should remove note entered on previous move with keypad",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.note.click();
      await sudokuBoard.cell[7][7].press("1");
      await sudokuBoard.cellHasNotes(7, 7, "1");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasValue(7, 7, "0");
    }
  );

  resumeGame(
    "Undo button should remove note entered on previous move with numpad",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.note.click();
      await sudokuBoard.numPad[0].click();
      await sudokuBoard.cellHasNotes(7, 7, "1");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasValue(7, 7, "0");
    }
  );

  resumeGame(
    "Undo button should replace note removed on previous move with keypad",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][8].click();
      await sudokuBoard.note.click();
      await sudokuBoard.cell[7][8].press("5");
      await sudokuBoard.cellHasNotes(7, 8, "4");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasNotes(7, 8, "45");
    }
  );

  resumeGame(
    "Undo button should replace note removed on previous move with numpad",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][8].click();
      await sudokuBoard.note.click();
      await sudokuBoard.numPad[4].click();
      await sudokuBoard.cellHasNotes(7, 8, "4");
      await sudokuBoard.undo.click();
      await sudokuBoard.cellHasNotes(7, 8, "45");
    }
  );
});

resumeGame.describe("erase", () => {
  resumeGame(
    "Erase button should be disabled if a cell with a given is selected",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cellHasValue(0, 2, "3");
      await sudokuBoard.cell[0][2].click();
      await sudokuBoard.eraseButtonIsDisabled();
    }
  );

  resumeGame(
    "Erase button should be disabled if a cell with a correct value is selected",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cellHasValue(0, 0, "1");
      await sudokuBoard.cell[0][0].click();
      await sudokuBoard.eraseButtonIsDisabled();
    }
  );

  resumeGame("Erasing an incorrect value should succeed", async ({ page }) => {
    const sudokuBoard = new SudokuBoardComponent(page);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.erase.click();
    await sudokuBoard.cellHasValue(7, 6, "0");
  });
});

// TODO add test: Should solve game with multiple action types
// TODO add test: Completing a game and clicking 'Start New Game' should take you to the play game page
// TODO add test: Completing a game should display correct game results
// TODO add test: Completing a game should display correct statistics
// TODO add test: Completing multiple games should display correct statistics
