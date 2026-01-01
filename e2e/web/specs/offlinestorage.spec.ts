import { expect } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";
import { test } from "../fixture";
import { StatisticsPage } from "../page/statistics.page";
import { ProfilePage } from "../page/profile.page";
import { HomePage } from "../page/home.page";
import { PlayPage } from "../page/play.page";
import { DrillPage } from "../page/drill.page";
import {
  ALMOST_FINISHED_GAME,
  INVALID_ACTIVE_GAME_DATA,
  INVALID_PROFILE_DATA,
  INVALID_STATISTICS_DATA,
  POINTING_PAIR_DRILL_GAME,
} from "../data";

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
    const playPage = new PlayPage(page);
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
    const playPage = new PlayPage(page);
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
    await expect(drillPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});

test.describe("Offline Storage", () => {
  test.use({ activeGameStorage: ALMOST_FINISHED_GAME });
  test("Resume Game with invalid data does not crash app", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
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
