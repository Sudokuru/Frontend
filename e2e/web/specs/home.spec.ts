import { HomePage } from "./../page/home.page";
import { expect } from "@playwright/test";
import { test } from "../fixture";
import { HeaderComponent } from "../components/header.component";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { ALMOST_FINISHED_GAME, POINTING_PAIR_DRILL_GAME } from "../data";

test.describe("home dashboard", () => {
  test.use({ learnedLessonsStorage: ["SUDOKU_101"] });

  test("shows the default dashboard state", async ({ page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.dashboard).toBeInViewport({ ratio: 1 });
    await expect(homePage.heroAction).toBeInViewport({ ratio: 1 });
    await expect(homePage.difficultySelector).toHaveAccessibleName(
      "Difficulty: Novice",
    );
    await expect(homePage.playSudoku).toBeInViewport({ ratio: 1 });
    await expect(homePage.startLessons).toContainText(
      "1 of 8 lessons complete",
    );
    await expect(homePage.startDrills).toHaveCount(0);
  });

  test("starts a puzzle at the selected difficulty", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.difficultySelector.click();
    await homePage.difficulty("amateur").click();

    await expect(homePage.difficultySelector).toHaveAccessibleName(
      "Difficulty: Amateur",
    );
    await page.reload();
    await expect(homePage.difficultySelector).toHaveAccessibleName(
      "Difficulty: Amateur",
    );

    await homePage.heroAction.click();
    const sudokuBoard = new SudokuBoardComponent(page);
    await sudokuBoard.sudokuBoardIsRendered();
    await expect(sudokuBoard.difficulty).toContainText("Amateur");
    await expect(sudokuBoard.difficulty).toBeInViewport({ ratio: 1 });
  });
});

test.describe("home resume actions", () => {
  test.use({ activeGameStorage: ALMOST_FINISHED_GAME });

  test("resumes a saved classic puzzle from the hero", async ({ page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.resumeClassic).toBeInViewport({ ratio: 1 });
    await expect(homePage.difficultySelector).toHaveCount(0);
    await homePage.resumeClassic.click();

    const sudokuBoard = new SudokuBoardComponent(page);
    await sudokuBoard.sudokuBoardIsRendered();
    await expect(sudokuBoard.difficulty).toContainText("Novice");
  });
});

test.describe("home drill resume action", () => {
  test.use({ activeDrillGameStorage: POINTING_PAIR_DRILL_GAME });

  test("resumes a saved drill when drills are enabled", async ({
    featurePreview,
  }) => {
    const header = new HeaderComponent(featurePreview);
    await header.home.click();
    const homePage = new HomePage(featurePreview);

    await expect(homePage.resumeDrill).toBeInViewport({ ratio: 1 });
    await homePage.resumeDrill.click();

    const sudokuBoard = new SudokuBoardComponent(featurePreview);
    await sudokuBoard.sudokuBoardIsRendered();
    await expect(sudokuBoard.difficulty).toContainText("Pointing Pair");
  });
});

test.describe("home shortcut customization", () => {
  test("adds, removes, searches, and persists shortcuts", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.customize.click();
    await expect(homePage.customizeMode).toBeInViewport({ ratio: 1 });
    await homePage.removeShortcut("HomeLearnButton").click();
    await homePage.addShortcut.click();
    await homePage.shortcutSearch.fill("  STATISTICS  ");
    await homePage.libraryShortcut("HomeStatisticsButton").click();
    await homePage.closeShortcutLibrary.click();
    await homePage.customizeDone.click();

    await expect(homePage.playSudoku).toBeInViewport({ ratio: 1 });
    await expect(page.getByTestId("HomeStatisticsButton")).toBeInViewport({
      ratio: 1,
    });
    await expect(homePage.startLessons).toHaveCount(0);

    await page.reload();
    await expect(page.getByTestId("HomeStatisticsButton")).toBeInViewport({
      ratio: 1,
    });
    await expect(homePage.startLessons).toHaveCount(0);
  });
});

test.describe("home shortcut reset", () => {
  test.use({ homeShortcutsStorage: ["statistics"] });

  test("restores and persists the default shortcuts", async ({ page }) => {
    const homePage = new HomePage(page);
    await expect(page.getByTestId("HomeStatisticsButton")).toBeInViewport({
      ratio: 1,
    });
    await homePage.customize.click();
    await homePage.resetShortcuts.click();
    await homePage.customizeDone.click();

    await page.reload();
    await expect(homePage.playSudoku).toBeInViewport({ ratio: 1 });
    await expect(homePage.startLessons).toBeInViewport({ ratio: 1 });
    await expect(homePage.startDrills).toHaveCount(0);
  });
});

test.describe("home shortcut order", () => {
  test.use({ homeShortcutsStorage: ["play", "learn", "statistics"] });

  test("reorders shortcuts by dragging and persists the order", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.customize.click();
    await homePage.dragShortcut("HomePlayButton", "HomeStatisticsButton");
    await homePage.customizeDone.click();

    const expectedOrder = [
      "HomeLearnButton",
      "HomeStatisticsButton",
      "HomePlayButton",
    ];
    await expect
      .poll(() => homePage.shortcutOrder(expectedOrder))
      .toEqual(expectedOrder);

    await page.reload();
    await expect
      .poll(() => homePage.shortcutOrder(expectedOrder))
      .toEqual(expectedOrder);
  });
});

test.describe("navigation buttons", () => {
  test("hover over navigation buttons", async ({ page }) => {
    const homePage = new HomePage(page);
    const shortcuts = [
      [homePage.startLessons, "HomeLearnButton"],
      // homePage.startDrills, // TODO: uncomment this once drills are out of feature preview
      [homePage.playSudoku, "HomePlayButton"],
    ] as const;
    for (const [button, testId] of shortcuts) {
      const card = homePage.shortcutSurface(testId);
      await expect(card).toHaveCSS("border-width", "1px");
      await button.hover();
      await expect(card).toHaveCSS("border-width", "2px");
    }
  });
});
