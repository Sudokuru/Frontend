import { test } from "../fixture";
import { expect } from "@playwright/test";
import { PlayPage } from "../page/play.page";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { EndGameModalComponent } from "../components/end-game-modal.component";
import { HeaderComponent } from "../components/header.component";
import { StatisticsPage } from "../page/statistics.page";

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
    await expect(endGameModal.page.getByText("Score: 24")).toBeInViewport({
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
    await header.statistics.click(); // todo: stop using last (fix infinite stack)
    const statistics = new StatisticsPage(resumeGame);
    await statistics.statisticsPageIsRendered();
    await expect(statistics.page.getByText("Total Score: 24")).toBeInViewport({
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
