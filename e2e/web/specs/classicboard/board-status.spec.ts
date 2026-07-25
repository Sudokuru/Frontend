import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { test } from "../../fixture";

test.describe("mistake counter", () => {
  test("displays and updates the classic game mistake count", async ({
    resumeClassicGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeClassicGame);

    await expect(sudokuBoard.mistakes).toContainText("235");
    await expect(sudokuBoard.mistakes).toBeInViewport({ ratio: 1 });

    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.cell[7][6].press("7");
    await expect(sudokuBoard.mistakes).toContainText("236");

    await sudokuBoard.cell[7][6].press("8");
    await expect(sudokuBoard.mistakes).toContainText("236");
  });
});

test.describe("hint counter", () => {
  test("displays and updates the classic game hint count", async ({
    resumeClassicGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeClassicGame);

    await expect(sudokuBoard.hints).toContainText("0");
    await expect(sudokuBoard.hints).toBeInViewport({ ratio: 1 });

    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.cell[7][6].press("8");
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.numPad[2 - 1].click();
    await sudokuBoard.hint.click();
    await expect(sudokuBoard.hints).toContainText("1");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.hintExit.click();
    await expect(sudokuBoard.hints).toContainText("1");

    await sudokuBoard.hint.click();
    await expect(sudokuBoard.hints).toContainText("2");
  });
});

test.describe("timer", () => {
  test("displays and advances the classic game timer", async ({
    resumeClassicGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeClassicGame);

    await expect(sudokuBoard.timer).toContainText(/06:\d{2}/);
    await expect(sudokuBoard.timer).toBeInViewport({ ratio: 1 });
    const initialTime = await sudokuBoard.timer.textContent();

    await expect
      .poll(() => sudokuBoard.timer.textContent())
      .not.toBe(initialTime);
  });
});
