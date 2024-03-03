import { $ } from "@wdio/globals";

class ExpoPage {
  public get enterUrlButton() {
    const selector =
      'new UiSelector().text("Enter URL manually").className("android.widget.TextView")';
    return $(`android=${selector}`);
  }

  public get expoUrlInputField() {
    const selector =
      'new UiSelector().text("exp://").className("android.widget.EditText")';
    return $(`android=${selector}`);
  }

  public get expoConnectButton() {
    const selector =
      'new UiSelector().text("Connect").className("android.widget.TextView")';
    return $(`android=${selector}`);
  }

  public async openApp() {
    await (await this.enterUrlButton).click();
    await (await this.expoUrlInputField).setValue("exp://192.168.1.152:8081");
    await driver.sendKeyEvent("66"); // hit enter button
    await (await this.expoConnectButton).click();
  }
}

export default new ExpoPage();
