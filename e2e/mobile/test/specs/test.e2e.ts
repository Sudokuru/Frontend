import { expect } from "@wdio/globals";
import ExpoPage from "../pageobjects/expo.page.ts";

describe("My Login application", () => {
  beforeEach(async () => {
    await ExpoPage.openApp();
  });

  it("should login with valid credentials", async () => {
    const button = await $(
      '//android.view.ViewGroup[@resource-id="HomeLearnButton"]'
    );

    await button.waitForDisplayed();

    await button.click();

    const selector =
      'new UiSelector().text("Learn new strategies").className("android.widget.TextView")';
    let title = await $(`android=${selector}`);
    await title.waitForDisplayed();
    // await button.waitForClickable();

    // above code is working!
    // now need to find out why this code isn't working
    // await driver.elementSendKeys(`android=${selector}`, 'exp://192.168.1.152:8081');
    // await driver.sendKeyEvent('exp://192.168.1.152:8081');
    // await driver.sendKeyEvent('66');

    // const newButton = driver.findElement('xpath', 'android.widget.Button[@text="Enter URL Manually"]');
    // const button = await $('*=Enter');
    // await button.click();
    // exp://192.168.1.152:8081
    // await openDeepLinkUrl('HomeActivity');
    // await LoginPage.open();

    // await LoginPage.login("tomsmith", "SuperSecretPassword!");
    // await expect(SecurePage.flashAlert).toBeExisting();
    // await expect(SecurePage.flashAlert).toHaveTextContaining(
    //   "You logged into a secure area!"
    // );
  });
});
