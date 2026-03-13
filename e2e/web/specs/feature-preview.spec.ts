import { ProfilePage } from "./../page/profile.page";
import { test } from "../fixture";
import { devices, expect } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";
import { MOBILE_WIDTH_LESS_THAN } from "../playwright.config";

test.describe("feature preview", () => {
  test("indicator text appears correctly based on viewport size", async ({
    page,
  }) => {
    const headerComponent = new HeaderComponent(page);
    await headerComponent.profile.click();

    const viewPort = await page.viewportSize();

    if (viewPort && viewPort.width > MOBILE_WIDTH_LESS_THAN) {
      await headerComponent.fullFeaturePreviewTextIsNotVisible();
    } else {
      await headerComponent.partialFeaturePreviewTextIsNotVisible();
    }

    const profilePage = new ProfilePage(page);
    await profilePage.featurePreviewSwitchDisabled.click();

    if (viewPort && viewPort.width > MOBILE_WIDTH_LESS_THAN) {
      await headerComponent.fullFeaturePreviewTextIsVisible();
    } else {
      await headerComponent.partialFeaturePreviewTextIsVisible();
    }
  });

  test("Drills profile setting appears in feature preview", async ({
    featurePreview,
  }) => {
    const profilePage = new ProfilePage(featurePreview);
    await expect(profilePage.drillsSwitchEnabled).toBeInViewport({
      ratio: 1,
    });
  });

  test("Drills profile setting does not appear when feature preview is disabled", async ({
    profile,
  }) => {
    const profilePage = new ProfilePage(profile);
    await expect(profilePage.drillsSwitchEnabled).not.toBeInViewport({
      ratio: 1,
    });
    await expect(profilePage.drillsSwitchDisabled).not.toBeInViewport({
      ratio: 1,
    });
  });

  test("Initialize Notes profile setting appears in feature preview", async ({
    featurePreview,
  }) => {
    const profilePage = new ProfilePage(featurePreview);
    await expect(profilePage.initializeNotesSwitchEnabled).toBeInViewport({
      ratio: 1,
    });
  });

  test("Initialize Notes profile setting does not appear when feature preview is disabled", async ({
    profile,
  }) => {
    const profilePage = new ProfilePage(profile);
    await expect(profilePage.initializeNotesSwitchDisabled).not.toBeInViewport({
      ratio: 1,
    });
    await expect(profilePage.initializeNotesSwitchEnabled).not.toBeInViewport({
      ratio: 1,
    });
  });

  test("Simplify Notes profile setting appears in feature preview", async ({
    featurePreview,
  }) => {
    const profilePage = new ProfilePage(featurePreview);
    await expect(profilePage.simplifyNotesSwitchEnabled).toBeInViewport({
      ratio: 1,
    });
  });

  test("Simplify Notes profile setting does not appear when feature preview is disabled", async ({
    profile,
  }) => {
    const profilePage = new ProfilePage(profile);
    await expect(profilePage.simplifyNotesSwitchDisabled).not.toBeInViewport({
      ratio: 1,
    });
    await expect(profilePage.simplifyNotesSwitchEnabled).not.toBeInViewport({
      ratio: 1,
    });
  });
});
