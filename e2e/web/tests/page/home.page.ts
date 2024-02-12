import { Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly startLessons: Locator;
  readonly startDrills: Locator;
  readonly playSudoku: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startLessons = page.getByTestId("HomeLearnButton");
    this.startDrills = page.getByTestId("HomeDrillButton");
    this.playSudoku = page.getByTestId("HomePlayButton");
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
