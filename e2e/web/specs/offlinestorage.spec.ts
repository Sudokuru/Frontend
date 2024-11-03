import { expect } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";
import { test } from "../fixture";
import { StatisticsPage } from "../page/statistics.page";
import { ProfilePage } from "../page/profile.page";
import { HomePage } from "../page/home.page";
import { PlayPage } from "../page/play.page";
import {
  INVALID_ACTIVE_GAME_DATA,
  INVALID_PROFILE_DATA,
  INVALID_STATISTICS_DATA,
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
  test("Resume Game buton does not show with invalid active game object", async ({
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
  test("Resume Game buton does not show with invalid active game object data", async ({
    page,
  }) => {
    await page.reload();
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
    const playPage = new PlayPage(page);
    await expect(playPage.resume).not.toBeInViewport({ ratio: 1 });
  });
});
