import { HomePage } from "./../page/home.page";
import { expect } from "@playwright/test";
import { test } from "../fixture";
import { HeaderComponent } from "../components/header.component";

test.describe("home page", () => {
  test("start lessons button", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.startLessons.click();
  });

  test("start drills button", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.startDrills.click();
  });

  test("play sudoku button", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.playSudoku.click();
  });

  test("header renders correctly", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.headerRendersCorrectly();
  });

  test("statistics button", async ({ page }) => {
    const headerComponent = new HeaderComponent(page);
    await headerComponent.profile.click();
  });

  test("profile button", async ({ page }) => {
    const headerComponent = new HeaderComponent(page);
    await headerComponent.statistics.click();
  });
});

test.describe("play page navigation", () => {});
