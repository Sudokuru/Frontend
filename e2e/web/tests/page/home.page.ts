import { Locator, Page } from "@playwright/test";

export class HomePage {
  readonly startLessons: Locator;
  readonly startDrills: Locator;
  readonly playSudoku: Locator;

  constructor(page: Page) {
    this.startLessons = page.getByTestId("HomeLearnButton").locator("img");
    this.startDrills = page.getByTestId("HomeDrillButton").locator("img");
    this.playSudoku = page.getByTestId("HomePlayButton").locator("img");
  }

  async clickStartLessonsButton() {
    await this.startLessons.click();
  }

  async clickStartDrillsButton() {
    await this.startDrills.click();
  }

  async clickPlaySudokuButton() {
    await this.playSudoku.click();
  }
}
