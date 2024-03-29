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
import { EndGameModalComponent } from "../components/end-game-modal.component";
import { HeaderComponent } from "../components/header.component";
import { StatisticsPage } from "../page/statistics.page";

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
      `typing ${i} should fill cell with correct note`,
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
// TODO add test: Completing multiple games should display correct statistics

resumeGame.describe("complete game", () => {
  resumeGame(
    "Completing a game and clicking 'Start New Game' should take you to the play game page",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][6].click();
      await sudokuBoard.cell[7][6].press("8");
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.numPad[2 - 1].click();
      await sudokuBoard.cell[7][8].click();
      await sudokuBoard.cell[7][8].press("4");
      const endGameModal = new EndGameModalComponent(page);
      await endGameModal.endGameModalIsRendered();
      await endGameModal.newGame.click();
      const playPage = new PlayPage(page);
      await playPage.playPageIsRendered();
    }
  );

  resumeGame(
    "Completing a game should display correct game results",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][6].click();
      await sudokuBoard.cell[7][6].press("8");
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.numPad[2 - 1].click();
      await sudokuBoard.cell[7][8].click();
      await sudokuBoard.cell[7][8].press("4");
      const endGameModal = new EndGameModalComponent(page);
      await expect(endGameModal.page.getByText("Score: 34")).toBeInViewport({
        ratio: 1,
      });
      await expect(
        endGameModal.page.getByText("Time Spent: 06:1")
      ).toBeInViewport({ ratio: 1 });
      await expect(
        endGameModal.page.getByText("Number of Hints Used: 0")
      ).toBeInViewport({ ratio: 1 });
      await expect(
        endGameModal.page.getByText("Mistakes Made: 235")
      ).toBeInViewport({ ratio: 1 });
      await expect(
        endGameModal.page.getByText("Difficulty: easy")
      ).toBeInViewport({ ratio: 1 });
    }
  );

  resumeGame(
    "Completing a game should display correct statistics",
    async ({ page }) => {
      const sudokuBoard = new SudokuBoardComponent(page);
      await sudokuBoard.cell[7][6].click();
      await sudokuBoard.cell[7][6].press("8");
      await sudokuBoard.cell[7][7].click();
      await sudokuBoard.numPad[2 - 1].click();
      await sudokuBoard.cell[7][8].click();
      await sudokuBoard.cell[7][8].press("4");
      const endGameModal = new EndGameModalComponent(page);
      await endGameModal.newGame.click();
      const header = new HeaderComponent(page);
      await header.statistics.last().click(); // todo: stop using last (fix infinite stack)
      const statistics = new StatisticsPage(page);
      await statistics.statisticsPageIsRendered();
      await expect(statistics.page.getByText("Total Score: 34")).toBeInViewport(
        { ratio: 1 }
      );
      await expect(statistics.page.getByText("Games Played: 1")).toBeInViewport(
        { ratio: 1 }
      );
      await expect(
        statistics.page.getByText("Fastest Solve Time: 06:1")
      ).toBeInViewport({ ratio: 1 });
      await expect(
        statistics.page.getByText("Average Solve Time: 06:1")
      ).toBeInViewport({ ratio: 1 });
      await expect(
        statistics.page.getByText("Total Solve Time: 06:1")
      ).toBeInViewport({ ratio: 1 });
      await expect(
        statistics.page.getByText("Total Hints Used: 0")
      ).toBeInViewport({ ratio: 1 });
      await expect(
        statistics.page.getByText("Total Mistakes Made: 235")
      ).toBeInViewport({ ratio: 1 });
    }
  );
});
