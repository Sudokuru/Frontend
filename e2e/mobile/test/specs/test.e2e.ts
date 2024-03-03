import { expect } from "@wdio/globals";
import LoginPage from "../pageobjects/login.page.js";
import SecurePage from "../pageobjects/secure.page.js";
import { TIMEOUT } from "dns";

describe("My Login application", () => {
  // it("should login with valid credentials", async () => {
  //   await LoginPage.open();

  //   await LoginPage.login("tomsmith", "SuperSecretPassword!");
  //   await expect(SecurePage.flashAlert).toBeExisting();
  //   await expect(SecurePage.flashAlert).toHaveTextContaining(
  //     "You logged into a secure area!"
  //   );
  // });

  it("should login with valid credentials", async () => {
    await driver.activateApp("host.exp.exponent");

    const appState = await driver.queryAppState("host.exp.exponent");
    console.log("APP STATE: ", appState);
    // if appstate is 4 then we are good to go

    let selector =
      'new UiSelector().text("Enter URL manually").className("android.widget.TextView")';
    let button = await $(`android=${selector}`);
    await button.click();

    selector =
      'new UiSelector().text("exp://").className("android.widget.EditText")';
    button = await $(`android=${selector}`);
    await button.setValue("exp://192.168.1.152:8081");

    // hitting enter button
    await driver.sendKeyEvent("66");

    selector =
      'new UiSelector().text("Connect").className("android.widget.TextView")';
    button = await $(`android=${selector}`);
    await button.click();

    button = await $(
      '//android.view.ViewGroup[@resource-id="HomeLearnButton"]'
    );
    await button.waitForDisplayed();

    // Shake the device to remove the expo info box thing
    // error hasn't been implemented yet?
    // await driver.shake();

    await button.click();

    selector =
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
