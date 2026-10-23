import { HomePage } from "./../page/home.page";
import { expect } from "@playwright/test";
import { test } from "../fixture";
import { HeaderComponent } from "../components/header.component";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { ALMOST_FINISHED_GAME, POINTING_PAIR_DRILL_GAME } from "../data";
import { ProfilePage } from "../page/profile.page";

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

test.describe("both saved games", () => {
  test.use({
    activeGameStorage: ALMOST_FINISHED_GAME,
    activeDrillGameStorage: POINTING_PAIR_DRILL_GAME,
  });

  test("resumes each saved board without replacing the other", async ({
    featurePreview,
  }) => {
    const header = new HeaderComponent(featurePreview);
    const home = new HomePage(featurePreview);
    const board = new SudokuBoardComponent(featurePreview);
    await header.home.click();
    await expect(home.resumeClassic).toBeInViewport({ ratio: 1 });
    await expect(home.resumeDrill).toBeInViewport({ ratio: 1 });
    await home.resumeClassic.click();
    await board.sudokuBoardIsRendered();
    await board.cellHasValue(0, 0, "1");
    await expect(board.mistakes).toContainText("235");
    await featurePreview.reload();
    await home.resumeDrill.click();
    await board.sudokuBoardIsRendered();
    await board.cellHasValue(0, 0, "6");
    await board.cellHasNotes(7, 6, "1236");
    await featurePreview.reload();
    await home.resumeClassic.click();
    await board.sudokuBoardIsRendered();
    await board.cellHasValue(0, 0, "1");
    await expect(board.mistakes).toContainText("235");
  });
});

test.describe("drill feature gating", () => {
  test.use({
    activeDrillGameStorage: POINTING_PAIR_DRILL_GAME,
    homeShortcutsStorage: ["play", "learn", "drill", "drill-obvious-single"],
  });

  for (const setting of ["preview", "drills"] as const) {
    test(`${setting} hides drills without deleting saved games or shortcuts`, async ({
      featurePreview,
    }) => {
      const header = new HeaderComponent(featurePreview);
      const home = new HomePage(featurePreview);
      const profile = new ProfilePage(featurePreview);
      await header.home.click();
      await expect(home.resumeDrill).toBeInViewport({ ratio: 1 });
      await expect(home.shortcut("HomeObviousSingleDrillShortcut")).toHaveCount(
        1,
      );
      await header.profile.click();
      await (
        setting === "preview"
          ? profile.featurePreviewSwitchEnabled
          : profile.drillsSwitchEnabled
      ).click();
      await header.home.click();
      await expect(home.resumeDrill).toHaveCount(0);
      await expect(home.startDrills).toHaveCount(0);
      await expect(home.shortcut("HomeObviousSingleDrillShortcut")).toHaveCount(
        0,
      );
      await featurePreview.reload();
      await expect(home.resumeDrill).toHaveCount(0);
      await header.profile.click();
      await (
        setting === "preview"
          ? profile.featurePreviewSwitchDisabled
          : profile.drillsSwitchDisabled
      ).click();
      await header.home.click();
      await expect(home.resumeDrill).toBeInViewport({ ratio: 1 });
      await expect(home.startDrills).toHaveCount(1);
      await expect(home.shortcut("HomeObviousSingleDrillShortcut")).toHaveCount(
        1,
      );
      const expectedOrder = [
        "HomePlayButton",
        "HomeLearnButton",
        "HomeDrillButton",
        "HomeObviousSingleDrillShortcut",
      ];
      await expect
        .poll(() => home.shortcutOrder(expectedOrder))
        .toEqual(expectedOrder);
      await home.resumeDrill.click();
      const board = new SudokuBoardComponent(featurePreview);
      await board.sudokuBoardIsRendered();
      await board.cellHasValue(0, 0, "6");
      await board.cellHasNotes(7, 6, "1236");
    });
  }
});

test.describe("combined shortcut changes", () => {
  test.use({ homeShortcutsStorage: ["play", "learn", "statistics"] });

  test("preserves a reordered layout when adding and removing shortcuts", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.customize.click();
    await home.dragShortcut("HomePlayButton", "HomeStatisticsButton");
    await home.addLibraryShortcut("HomeProfileButton", "Profile");
    await home.removeShortcut("HomeLearnButton").click();
    await home.customizeDone.click();
    const expected = [
      "HomeStatisticsButton",
      "HomePlayButton",
      "HomeProfileButton",
    ];
    await expect.poll(() => home.shortcutOrder(expected)).toEqual(expected);
    await page.reload();
    await expect.poll(() => home.shortcutOrder(expected)).toEqual(expected);
    await expect(home.startLessons).toHaveCount(0);
  });
});

test("persists an empty layout", async ({ page }) => {
  const home = new HomePage(page);
  await home.customize.click();
  await home.removeShortcut("HomePlayButton").click();
  await home.removeShortcut("HomeLearnButton").click();
  await home.customizeDone.click();
  await expect(home.dashboard).toBeInViewport({ ratio: 1 });
  await expect(home.playSudoku).toHaveCount(0);
  await expect(home.startLessons).toHaveCount(0);
  await page.reload();
  await expect(home.dashboard).toBeInViewport({ ratio: 1 });
  await expect(home.playSudoku).toHaveCount(0);
  await expect(home.startLessons).toHaveCount(0);
});

test.describe("reset an empty layout", () => {
  test.use({ homeShortcutsStorage: [] });

  test("restores and persists the default shortcuts", async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.dashboard).toBeInViewport({ ratio: 1 });
    await expect(home.playSudoku).toHaveCount(0);
    await expect(home.startLessons).toHaveCount(0);
    await home.customize.click();
    await home.resetShortcuts.click();
    await expect(home.editingShortcut("HomePlayButton")).toBeInViewport({
      ratio: 1,
    });
    await expect(home.editingShortcut("HomeLearnButton")).toBeInViewport({
      ratio: 1,
    });
    await home.customizeDone.click();
    await expect(home.playSudoku).toBeInViewport({ ratio: 1 });
    await expect(home.startLessons).toBeInViewport({ ratio: 1 });
    await page.reload();
    await expect(home.playSudoku).toBeInViewport({ ratio: 1 });
    await expect(home.startLessons).toBeInViewport({ ratio: 1 });
  });
});

test.describe("multi-row shortcut order", () => {
  test.use({
    homeShortcutsStorage: [
      "play",
      "learn",
      "statistics",
      "profile",
      "classic-novice",
      "classic-amateur",
    ],
  });

  test("moves a shortcut across rows and persists the order", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 1000 });
    const home = new HomePage(page);
    await home.customize.click();
    await home.dragShortcut("HomePlayButton", "HomeClassicAmateurShortcut");
    await home.customizeDone.click();
    const expected = [
      "HomeLearnButton",
      "HomeStatisticsButton",
      "HomeProfileButton",
      "HomeClassicNoviceShortcut",
      "HomeClassicAmateurShortcut",
      "HomePlayButton",
    ];
    await expect.poll(() => home.shortcutOrder(expected)).toEqual(expected);
    await page.reload();
    await expect.poll(() => home.shortcutOrder(expected)).toEqual(expected);
  });
});
