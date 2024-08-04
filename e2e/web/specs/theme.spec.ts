import { ProfilePage } from "./../page/profile.page";
import { test } from "../fixture";
import { expect } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";
import {
  GOLD_COLOR_RGB,
  PURPLE_COLOR_RGB,
} from "../../../app/Styling/HighlightColors";

test.describe("theme", () => {
  test("toggle theme", async ({ page }) => {
    const headerComponent = new HeaderComponent(page);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(page);
    const title = page.getByText("Profile");
    await expect(title).toHaveCSS("color", GOLD_COLOR_RGB);
    await profilePage.themeSwitchEnabled.click();
    await expect(title).toHaveCSS("color", PURPLE_COLOR_RGB);
  });
});
