import { test } from "../../fixture";
import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { EndGameDrillModalComponent } from "../../components/end-game-modal-drill.component";
import { DrillPage } from "../../page/drill.page";
import {
  failNextStorageRemoval,
  getFailedStorageOperationCount,
} from "../../storage-test-helpers";

// TODO add test: Should solve game with multiple action types

test.describe("complete drill", () => {
  test("Failed active-game removal does not expose completed drill UI", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.note.click();
    await sudokuBoard.cell[7][6].press("1");
    await failNextStorageRemoval(resumeDrillGame, "active_drill_game");
    await sudokuBoard.cell[7][3].click();
    await sudokuBoard.numPad[6 - 1].click();

    await expect
      .poll(() => getFailedStorageOperationCount(resumeDrillGame))
      .toBe(1);
    const endGameModal = new EndGameDrillModalComponent(resumeDrillGame);
    await expect(endGameModal.title).toHaveCount(0);
    await expect
      .poll(() =>
        resumeDrillGame.evaluate(() =>
          localStorage.getItem("active_drill_game"),
        ),
      )
      .not.toBeNull();
    await sudokuBoard.sudokuBoardIsRendered();
  });

  test("Completing a drill and clicking 'Start New Drill' should take you to the drill page", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.note.click();
    await sudokuBoard.cell[7][6].press("1");
    await sudokuBoard.cell[7][3].click();
    await sudokuBoard.numPad[6 - 1].click();
    const endGameModal = new EndGameDrillModalComponent(resumeDrillGame);
    await endGameModal.endGameModalIsRendered();
    await endGameModal.newGame.click();
    const playPage = new DrillPage(resumeDrillGame);
    await playPage.drillPageIsRendered();
  });

  test("Completing a drill should display correct drill results", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.note.click();
    await sudokuBoard.cell[7][6].press("1");
    await sudokuBoard.cell[7][3].click();
    await sudokuBoard.numPad[6 - 1].click();
    const endGameModal = new EndGameDrillModalComponent(resumeDrillGame);
    await endGameModal.endGameModalIsRendered();
    await endGameModal.statisticIsFullyVisible(
      "time",
      /Time Spent:/,
      /^0[1-5]$/,
    );
    await endGameModal.statisticIsFullyVisible(
      "strategy",
      /Strategy:/,
      "Pointing Pair",
    );
    await endGameModal.statisticIsFullyVisible(
      "numWrongCellsPlayed",
      /Mistakes Made:/,
      "1",
    );
    await endGameModal.statisticIsFullyVisible(
      "numHintsUsed",
      /Hint Used:/,
      "No",
    );
  });

  test("Completing a drill with hint should display correct game results", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.note.click();
    await sudokuBoard.cell[7][6].press("1");
    await sudokuBoard.solveHint();
    const endGameModal = new EndGameDrillModalComponent(resumeDrillGame);
    await endGameModal.endGameModalIsRendered();
    await endGameModal.statisticIsFullyVisible(
      "time",
      /Time Spent:/,
      /^0[1-5]$/,
    );
    await endGameModal.statisticIsFullyVisible(
      "strategy",
      /Strategy:/,
      "Pointing Pair",
    );
    await endGameModal.statisticIsFullyVisible(
      "numWrongCellsPlayed",
      /Mistakes Made:/,
      "1",
    );
    await endGameModal.statisticIsFullyVisible(
      "numHintsUsed",
      /Hint Used:/,
      "Yes",
    );
  });

  test("Completing a drill with note mistakes should display correct game results", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.note.click();
    await sudokuBoard.cell[7][6].press("2");
    await sudokuBoard.cell[7][6].press("2");
    await sudokuBoard.cell[7][6].press("1");
    await sudokuBoard.cell[7][3].click();
    await sudokuBoard.numPad[6 - 1].click();
    const endGameModal = new EndGameDrillModalComponent(resumeDrillGame);
    await endGameModal.endGameModalIsRendered();
    await endGameModal.statisticIsFullyVisible(
      "time",
      /Time Spent:/,
      /^0[1-5]$/,
    );
    await endGameModal.statisticIsFullyVisible(
      "strategy",
      /Strategy:/,
      "Pointing Pair",
    );
    await endGameModal.statisticIsFullyVisible(
      "numWrongCellsPlayed",
      /Mistakes Made:/,
      "2",
    );
    await endGameModal.statisticIsFullyVisible(
      "numHintsUsed",
      /Hint Used:/,
      "No",
    );
  });
});

test.describe("start drill", () => {
  test("Clicking on obvious single button should start obvious single drill", async ({
    drill,
  }) => {
    await drill.getByText("Obvious Single").click();
    const sudokuBoard = new SudokuBoardComponent(drill);
    await expect(sudokuBoard.difficulty).toContainText("Obvious Single");
    await expect(sudokuBoard.difficulty).toBeInViewport({ ratio: 1 });
  });

  test("Clicking on button with obvious pair text should start obvious pair drill", async ({
    drill,
  }) => {
    await drill.getByText("Obvious Pair").click();
    const sudokuBoard = new SudokuBoardComponent(drill);
    await expect(sudokuBoard.difficulty).toContainText("Obvious Pair");
    await expect(sudokuBoard.difficulty).toBeInViewport({ ratio: 1 });
  });
});

test.describe("resume drill", () => {
  test("user can pause and resume a game", async ({ drill }) => {
    const drillPage = new DrillPage(drill);
    await drill.getByText("Obvious Single").click();
    const sudokuBoard = new SudokuBoardComponent(drill);
    await sudokuBoard.pause.click();
    await drillPage.resumeButtonIsVisible();
    await drillPage.resume.click();
    await expect(sudokuBoard.difficulty).toContainText("Obvious Single");
    await expect(sudokuBoard.difficulty).toBeInViewport({ ratio: 1 });
  });
});
