import { HomePage } from "./../page/home.page";
import { expect } from "@playwright/test";
import { test } from "../fixture";

test.describe("home page", () => {
  test("start lessons button", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickStartLessonsButton();
  });

  test("start drills button", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickStartDrillsButton();
  });

  test("play sudoku button", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickPlaySudokuButton();
  });

  test("header renders correctly", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.headerRendersCorrectly();
  });
});

test.describe("play page navigation", () => {});
