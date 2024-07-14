import { HomePage } from "./../page/home.page";
import { expect } from "@playwright/test";
import { test } from "../fixture";

test.describe("navigation buttons", () => {
  test("hover over navigation buttons", async ({ page }) => {
    const homePage = new HomePage(page);
    const buttons = [
      homePage.startLessons,
      homePage.startDrills,
      homePage.playSudoku,
    ];
    for (const button of buttons) {
      await expect(button).toHaveCSS("border-color", "rgb(242, 242, 242)");
      await button.hover();
      await expect(button).toHaveCSS("border-color", "rgb(217, 160, 91)");
    }
  });
});
