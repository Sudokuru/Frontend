import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { test } from "../../fixture";

test.describe("mistake counter", () => {
  test("displays and updates the drill mistake count", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await expect(sudokuBoard.mistakes).toContainText("1");
    await expect(sudokuBoard.mistakes).toBeInViewport({ ratio: 1 });

    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.note.click();
    await sudokuBoard.cell[7][6].press("2");
    await expect(sudokuBoard.mistakes).toContainText("2");

    await sudokuBoard.cell[7][6].press("2");
    await sudokuBoard.cell[7][6].press("1");
    await expect(sudokuBoard.mistakes).toContainText("2");

    await sudokuBoard.cell[7][2].click();
    await sudokuBoard.cell[7][2].press("5");
    await expect(sudokuBoard.mistakes).toContainText("3");

    await sudokuBoard.cell[7][2].press("5");
    await expect(sudokuBoard.mistakes).toContainText("3");
  });
});

test.describe("hint counter", () => {
  test("displays and updates the drill hint count", async ({
    resumeDrillGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await expect(sudokuBoard.hints).toContainText("0");
    await expect(sudokuBoard.hints).toBeInViewport({ ratio: 1 });

    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.note.click();
    await sudokuBoard.cell[7][6].press("1");
    await sudokuBoard.hint.click();
    await expect(sudokuBoard.hints).toContainText("1");
    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.hintExit.click();
    await expect(sudokuBoard.hints).toContainText("1");

    await sudokuBoard.hint.click();
    await expect(sudokuBoard.hints).toContainText("1");
  });
});

test.describe("timer", () => {
  test("displays and advances the drill timer", async ({ resumeDrillGame }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeDrillGame);

    await expect(sudokuBoard.timer).toContainText(/[1-9]\d*/);
    await expect(sudokuBoard.timer).toBeInViewport({ ratio: 1 });
    const initialTime = await sudokuBoard.timer.textContent();

    await expect
      .poll(() => sudokuBoard.timer.textContent())
      .not.toBe(initialTime);
  });
});
