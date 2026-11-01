import { expect } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";
import { test } from "../fixture";
import { StatisticsPage } from "../page/statistics.page";
import { ProfilePage } from "../page/profile.page";
import { HomePage } from "../page/home.page";
import { PlayPage } from "../page/play.page";
import { DrillPage } from "../page/drill.page";
import { PlayModesPage } from "../page/play-modes.page";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import {
  ALMOST_FINISHED_GAME,
  INVALID_ACTIVE_GAME_DATA,
  INVALID_PROFILE_DATA,
  INVALID_STATISTICS_DATA,
  POINTING_PAIR_DRILL_GAME,
} from "../data";

const withOutOfRangeActiveHint = (savedGame: any) => {
  const invalidSavedGame = JSON.parse(JSON.stringify(savedGame));
  invalidSavedGame[0].activeHint = {
    stage: 5,
    maxStage: 5,
    hint: {
      strategy: "OBVIOUS_SINGLE",
      cause: [[0, 0]],
      groups: [[2, 0]],
      placements: [[9, 0, 1]],
      removals: [],
      info: "Invalid persisted hint",
      action: "Invalid persisted hint",
      simplifyNotesAfterPlacement: false,
    },
    puzzleStateBeforeHint: JSON.parse(
      JSON.stringify(invalidSavedGame[0].puzzleState),
    ),
  };
  return invalidSavedGame;
};

const INVALID_CLASSIC_ACTIVE_HINT =
  withOutOfRangeActiveHint(ALMOST_FINISHED_GAME);
const INVALID_DRILL_ACTIVE_HINT = withOutOfRangeActiveHint(
  POINTING_PAIR_DRILL_GAME,
);

test.describe("Home preference recovery", () => {
  test.use({
    homeDifficultyStorage: "invalid-difficulty",
    homeShortcutsStorage: { invalid: true },
  });

  test("restores default difficulty and shortcuts from malformed preferences", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await expect(home.difficultySelector).toHaveAccessibleName(
      "Difficulty: Novice",
    );
    await expect(home.playSudoku).toBeInViewport({ ratio: 1 });
    await expect(home.startLessons).toBeInViewport({ ratio: 1 });
    await page.reload();
    await expect(home.difficultySelector).toHaveAccessibleName(
      "Difficulty: Novice",
    );
    await expect(home.playSudoku).toBeInViewport({ ratio: 1 });
  });
});

test.describe("Duplicate home shortcuts", () => {
  test.use({ homeShortcutsStorage: ["play", "play", "learn", "learn"] });

  test("renders each saved shortcut only once", async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.playSudoku).toHaveCount(1);
    await expect(home.startLessons).toHaveCount(1);
    await home.customize.click();
    await home.customizeDone.click();
    await page.reload();
    await expect(home.playSudoku).toHaveCount(1);
    await expect(home.startLessons).toHaveCount(1);
  });
});

const homeResumeRecoveryCases = [
  {
    name: "invalid classic save with a valid drill",
    storage: {
      activeGameStorage: INVALID_ACTIVE_GAME_DATA,
      activeDrillGameStorage: POINTING_PAIR_DRILL_GAME,
    },
    invalidResume: "resumeClassic",
    validResume: "resumeDrill",
    savedFirstCell: "6",
  },
  {
    name: "invalid drill save with a valid classic puzzle",
    storage: {
      activeGameStorage: ALMOST_FINISHED_GAME,
      activeDrillGameStorage: INVALID_ACTIVE_GAME_DATA,
    },
    invalidResume: "resumeDrill",
    validResume: "resumeClassic",
    savedFirstCell: "1",
  },
] as const;

for (const scenario of homeResumeRecoveryCases) {
  test.describe(`Home recovery: ${scenario.name}`, () => {
    test.use(scenario.storage);

    test("hides only the invalid resume and preserves the valid game", async ({
      featurePreview,
    }) => {
      const header = new HeaderComponent(featurePreview);
      const home = new HomePage(featurePreview);
      await header.home.click();
      const invalidResume = home[scenario.invalidResume];
      const validResume = home[scenario.validResume];
      await expect(validResume).toBeInViewport({ ratio: 1 });
      await expect(invalidResume).toHaveCount(0);
      await featurePreview.reload();
      await expect(validResume).toBeInViewport({ ratio: 1 });
      await expect(invalidResume).toHaveCount(0);
      await validResume.click();
      const board = new SudokuBoardComponent(featurePreview);
      await board.sudokuBoardIsRendered();
      await board.cellHasValue(0, 0, scenario.savedFirstCell);
    });
  });
}

test.describe("Offline Storage", () => {
  test.use({ statisticsStorage: {} });
  test("Invalid statistics object does not crash app", async ({ page }) => {
    await page.reload();
    const headerComponent = new HeaderComponent(page);
    await headerComponent.statistics.click();
    const statisticsPage = new StatisticsPage(page);
    await statisticsPage.statisticsPageIsRendered();
  });
});

test.describe("Offline Storage", () => {
  test.use({ profileStorage: {} });
  test("Invalid profile object does not crash app", async ({ page }) => {
    await page.reload();
    const headerComponent = new HeaderComponent(page);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(page);
    await profilePage.profilePageIsRendered();
  });
});

test.describe("Offline Storage", () => {
  test.use({ activeGameStorage: {} });
  test("Resume Game button does not show with invalid active game object", async ({
    page,
  }) => {
    await page.reload();
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playModesPage = new PlayModesPage(page);
    await playModesPage.classic.click();
    const playPage = new PlayPage(page);
    await playPage.playPageIsRendered();
    await expect(playPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});

test.describe("Offline Storage", () => {
  test.use({ activeDrillGameStorage: {} });
  test("Resume Drill button does not show with invalid active game object", async ({
    featurePreview,
  }) => {
    const profilePage = new HeaderComponent(featurePreview);
    await profilePage.home.click();
    await featurePreview.reload();
    const homePage = new HomePage(featurePreview);
    await homePage.startDrills.click();
    const drillPage = new DrillPage(featurePreview);
    await drillPage.drillPageIsRendered();
    await expect(drillPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});

test.describe("Offline Storage", () => {
  test.use({ statisticsStorage: INVALID_STATISTICS_DATA });
  test("Invalid statistics object data does not display", async ({ page }) => {
    await page.reload();
    const headerComponent = new HeaderComponent(page);
    await headerComponent.statistics.click();
    const statisticsPage = new StatisticsPage(page);
    await statisticsPage.statisticsPageIsRendered();
    await expect(statisticsPage.page.getByText("-10")).not.toBeInViewport({
      ratio: 1,
    });
  });
});

test.describe("Offline Storage", () => {
  test.use({ profileStorage: INVALID_PROFILE_DATA });
  test("Invalid profile object data does not display", async ({ page }) => {
    await page.reload();
    const headerComponent = new HeaderComponent(page);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(page);
    await profilePage.profilePageIsRendered();
    await expect(profilePage.page.getByText("banana")).not.toBeInViewport({
      ratio: 1,
    });
  });
});

test.describe("Offline Storage", () => {
  test.use({ activeGameStorage: INVALID_ACTIVE_GAME_DATA });
  test("Resume Game button does not show with invalid active game object data", async ({
    page,
  }) => {
    await page.reload();
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playModesPage = new PlayModesPage(page);
    await playModesPage.classic.click();
    const playPage = new PlayPage(page);
    await playPage.playPageIsRendered();
    await expect(playPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});

test.describe("Offline Storage", () => {
  test.use({ activeDrillGameStorage: INVALID_ACTIVE_GAME_DATA });
  test("Resume Drill button does not show with invalid active game object data", async ({
    featurePreview,
  }) => {
    const profilePage = new HeaderComponent(featurePreview);
    await profilePage.home.click();
    await featurePreview.reload();
    const homePage = new HomePage(featurePreview);
    await homePage.startDrills.click();
    const drillPage = new DrillPage(featurePreview);
    await drillPage.drillPageIsRendered();
    await expect(drillPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});

test.describe("Offline Storage", () => {
  test.use({ activeGameStorage: INVALID_CLASSIC_ACTIVE_HINT });
  test("Classic game rejects an active hint with out-of-range coordinates", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playModesPage = new PlayModesPage(page);
    await playModesPage.classic.click();
    const playPage = new PlayPage(page);
    await playPage.playPageIsRendered();
    await expect(playPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});

test.describe("Offline Storage", () => {
  test.use({ activeDrillGameStorage: INVALID_DRILL_ACTIVE_HINT });
  test("Drill game rejects an active hint with out-of-range coordinates", async ({
    featurePreview,
  }) => {
    const header = new HeaderComponent(featurePreview);
    await header.home.click();
    const homePage = new HomePage(featurePreview);
    await homePage.startDrills.click();
    const drillPage = new DrillPage(featurePreview);
    await drillPage.drillPageIsRendered();
    await expect(drillPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});

test.describe("Offline Storage", () => {
  test.use({ activeGameStorage: ALMOST_FINISHED_GAME });
  test("Resume Game with invalid data does not crash app", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playModesPage = new PlayModesPage(page);
    await playModesPage.classic.click();
    const playPage = new PlayPage(page);
    await page.evaluate(
      (INVALID_ACTIVE_GAME_DATA: JSON) => {
        window.localStorage.setItem(
          "active_classic_game",
          JSON.stringify(INVALID_ACTIVE_GAME_DATA),
        );
      },
      INVALID_ACTIVE_GAME_DATA as unknown as JSON,
    );

    await expect(playPage.resume).toBeInViewport({ ratio: 1 });
    await playPage.resume.click();
    await playPage.playPageIsRendered();
    await expect(playPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});

test.describe("Offline Storage", () => {
  test.use({ activeDrillGameStorage: POINTING_PAIR_DRILL_GAME });
  test("Resume Drill with invalid data does not crash app", async ({
    featurePreview,
  }) => {
    const profilePage = new HeaderComponent(featurePreview);
    await profilePage.home.click();
    const homePage = new HomePage(featurePreview);
    await homePage.startDrills.click();
    const drillPage = new DrillPage(featurePreview);
    await featurePreview.evaluate(
      (INVALID_ACTIVE_GAME_DATA: JSON) => {
        window.localStorage.setItem(
          "active_drill_game",
          JSON.stringify(INVALID_ACTIVE_GAME_DATA),
        );
      },
      INVALID_ACTIVE_GAME_DATA as unknown as JSON,
    );

    await expect(drillPage.resume).toBeInViewport({ ratio: 1 });
    await drillPage.resume.click();
    await drillPage.drillPageIsRendered();
    await expect(drillPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});
