import { ProfilePage } from "./../page/profile.page";
import { test } from "../fixture";
import { devices } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";

test.describe("feature preview", () => {
  test("full indicator text appears on wide viewports", async ({ page }) => {
    const headerComponent = new HeaderComponent(page);
    await headerComponent.profile.click();
    await headerComponent.fullFeaturePreviewTextIsNotVisible();
    const profilePage = new ProfilePage(page);
    await profilePage.featurePreviewSwitchDisabled.click();
    await headerComponent.fullFeaturePreviewTextIsVisible();
  });

  test("partial indicator text appears on small viewports", async ({
    page,
  }) => {
    await page.setViewportSize(devices["iPhone 14"].viewport);
    const headerComponent = new HeaderComponent(page);
    await headerComponent.profile.click();
    await headerComponent.partialFeaturePreviewTextIsNotVisible();
    const profilePage = new ProfilePage(page);
    await profilePage.featurePreviewSwitchDisabled.click();
    await headerComponent.partialFeaturePreviewTextIsVisible();
  });
});
