import { test } from "../fixture";
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

test.describe("board highlighting", () => {
  test("highlighting should render correctly when a cell is selected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellHasColor(7, 6, NOT_SELECTED_CONFLICT_COLOR_RGB);
    await sudokuBoard.cellHasColor(7, 7, NOT_HIGHLIGHTED_COLOR_RGB);
    await sudokuBoard.cell[7][7].click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => row === 7, color: PEER_SELECTED_COLOR_RGB },
      {
        condition: (row, column) => column === 7 && row !== 7,
        color: PEER_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => row > 5 && column > 5,
        color: PEER_SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  // TODO: Add test: Board Highlighting should render correctly when cell is unselected

  test("Board Highlighting should render correctly when cell value is entered", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.cell[7][7].press("1");

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) =>
          (row === 0 && column === 0) ||
          (row === 1 && column === 8) ||
          (row === 2 && column === 4) ||
          (row === 3 && column === 3) ||
          (row === 4 && column === 1) ||
          (row === 5 && column === 6) ||
          (row === 6 && column === 2) ||
          (row === 7 && column === 5) ||
          (row === 8 && column === 7),
        color: IDENTICAL_VALUE_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) =>
          row === 7 || column == 7 || (row > 5 && column > 5),
        color: PEER_SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  // TODO: Add test: Board Highlighting should render correctly when undo button is entered

  test("Selecting invalid cell should update highlighting of cell correctly", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.cellHasColor(7, 6, SELECTED_CONFLICT_COLOR_RGB);
  });
});

// TODO add test: Should solve game with multiple action types
// TODO add test: Completing multiple games should display correct statistics

test.describe("complete game", () => {
  test("Completing a game and clicking 'Start New Game' should take you to the play game page", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.cell[7][6].press("8");
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.numPad[2 - 1].click();
    await sudokuBoard.cell[7][8].click();
    await sudokuBoard.cell[7][8].press("4");
    const endGameModal = new EndGameModalComponent(resumeGame);
    await endGameModal.endGameModalIsRendered();
    await endGameModal.newGame.click();
    const playPage = new PlayPage(resumeGame);
    await playPage.playPageIsRendered();
  });

  test("Completing a game should display correct game results", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.cell[7][6].press("8");
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.numPad[2 - 1].click();
    await sudokuBoard.cell[7][8].click();
    await sudokuBoard.cell[7][8].press("4");
    const endGameModal = new EndGameModalComponent(resumeGame);
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
      endGameModal.page.getByText("Difficulty: novice")
    ).toBeInViewport({ ratio: 1 });
  });

  test("Completing a game should display correct statistics", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.cell[7][6].press("8");
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.numPad[2 - 1].click();
    await sudokuBoard.cell[7][8].click();
    await sudokuBoard.cell[7][8].press("4");
    const endGameModal = new EndGameModalComponent(resumeGame);
    await endGameModal.newGame.click();
    const header = new HeaderComponent(resumeGame);
    await header.statistics.last().click(); // todo: stop using last (fix infinite stack)
    const statistics = new StatisticsPage(resumeGame);
    await statistics.statisticsPageIsRendered();
    await expect(statistics.page.getByText("Total Score: 34")).toBeInViewport({
      ratio: 1,
    });
    await expect(statistics.page.getByText("Games Played: 1")).toBeInViewport({
      ratio: 1,
    });
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
  });
});
