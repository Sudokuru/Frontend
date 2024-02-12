import { HomePage } from "./../page/home.page";
import { expect } from "@playwright/test";
import { test } from "../fixture";

test.describe("home page navigation", () => {
  test("start lessons button", async ({ page }) => {
    const homePage = new HomePage(page);
    homePage.clickStartLessonsButton();
  });

  test("start drills button", async ({ page }) => {
    const homePage = new HomePage(page);
    homePage.clickStartDrillsButton();
  });

  test("play sudoku button", async ({ page }) => {
    const homePage = new HomePage(page);
    homePage.clickPlaySudokuButton();
  });
});
