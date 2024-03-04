import HomePage from "../pageobjects/home.page.ts";
import { expect } from "@wdio/globals";
import ExpoPage from "../pageobjects/expo.page.ts";

describe("navigation routing", () => {
  beforeEach(async () => {
    await ExpoPage.openApp();
    await HomePage.homePageIsRendered();
  });

  it("can navigate to learn page", async () => {
    await HomePage.startLessons.click();

    const selector =
      'new UiSelector().text("Learn new strategies").className("android.widget.TextView")';
    let title = await $(`android=${selector}`);
    await title.waitForDisplayed();
    // await button.waitForClickable();
  });
});
