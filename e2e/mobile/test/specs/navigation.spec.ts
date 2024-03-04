import HomePage from "../page/home.page.ts";
import { expect } from "@wdio/globals";
import ExpoPage from "../page/expo.page.ts";

describe("navigation routing", () => {
  beforeEach(async () => {
    await ExpoPage.openApp();
    await HomePage.homePageIsRendered();
  });

  it("can go everywhere in the app", async () => {
    await HomePage.startLessons.click();

    const selector =
      'new UiSelector().text("Learn new strategies").className("android.widget.TextView")';
    let title = await $(`android=${selector}`);
    await title.waitForDisplayed();
    // await button.waitForClickable();
  });
});
