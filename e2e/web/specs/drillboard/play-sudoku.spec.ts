import { test } from "../../fixture";
import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { EndGameDrillModalComponent } from "../../components/end-game-modal-drill.component";
import { DrillPage } from "../../page/drill.page";

// TODO add test: Should solve game with multiple action types

test.describe("complete drill", () => {
  test("Completing a drill and clicking 'Start New Drill' should take you to the train page", async ({
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
    await expect(
      endGameModal.page.getByText(/Time Spent: (01|02)/),
    ).toBeInViewport({
      ratio: 1,
    });
    await expect(
      endGameModal.page.getByText("Strategy: Pointing Pair"),
    ).toBeInViewport({ ratio: 1 });
    await expect(
      endGameModal.page.getByText("Mistakes Made: 1"),
    ).toBeInViewport({ ratio: 1 });
    await expect(endGameModal.page.getByText("Hint Used: No")).toBeInViewport({
      ratio: 1,
    });
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
    await expect(
      endGameModal.page.getByText(/Time Spent: (01|02)/),
    ).toBeInViewport({
      ratio: 1,
    });
    await expect(
      endGameModal.page.getByText("Strategy: Pointing Pair"),
    ).toBeInViewport({ ratio: 1 });
    await expect(
      endGameModal.page.getByText("Mistakes Made: 1"),
    ).toBeInViewport({ ratio: 1 });
    await expect(endGameModal.page.getByText("Hint Used: Yes")).toBeInViewport({
      ratio: 1,
    });
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
    await expect(
      endGameModal.page.getByText(/Time Spent: (01|02)/),
    ).toBeInViewport({
      ratio: 1,
    });
    await expect(
      endGameModal.page.getByText("Strategy: Pointing Pair"),
    ).toBeInViewport({ ratio: 1 });
    await expect(
      endGameModal.page.getByText("Mistakes Made: 2"),
    ).toBeInViewport({ ratio: 1 });
    await expect(endGameModal.page.getByText("Hint Used: No")).toBeInViewport({
      ratio: 1,
    });
  });
});

test.describe("start drill", () => {
  test("Clicking on novice button should start novice game", async ({
    drill,
  }) => {
    await drill.getByText("Obvious Single").click();
    await expect(drill.getByText("Drill: Obvious Single")).toBeInViewport({
      ratio: 1,
    });
  });

  test("Clicking on button with intermediate text should start protege game", async ({
    drill,
  }) => {
    await drill.getByText("Obvious Pair").click();
    await expect(drill.getByText("Drill: Obvious Pair")).toBeInViewport({
      ratio: 1,
    });
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
    await expect(drill.getByText("Drill: Obvious Single")).toBeInViewport({
      ratio: 1,
    });
  });
});
