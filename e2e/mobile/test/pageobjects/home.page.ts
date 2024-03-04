import { $, expect } from "@wdio/globals";

class HomePage {
  public get startLessons() {
    return $('//android.view.ViewGroup[@resource-id="HomeLearnButton"]');
  }

  public get startDrills() {
    return $('//android.view.ViewGroup[@resource-id="HomeDrillButton"]');
  }

  public get playSudoku() {
    return $('//android.view.ViewGroup[@resource-id="HomePlayButton"]');
  }

  public async homePageIsRendered() {
    await expect(this.startLessons).toBeDisplayed();
    await expect(this.startDrills).toBeDisplayed();
    await expect(this.playSudoku).toBeDisplayed();
  }
}

export default new HomePage();
