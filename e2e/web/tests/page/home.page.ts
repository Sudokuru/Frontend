import { Locator, Page } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";

export class HomePage {
  readonly page: Page;
  readonly startLessons: Locator;
  readonly startDrills: Locator;
  readonly playSudoku: Locator;

  constructor(page: Page) {
    this.page = page;
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

  async headerRendersCorrectly() {
    const headerComponent = new HeaderComponent(this.page);
    await headerComponent.homeButtonIsNotInViewport();
    await headerComponent.profileButtonIsInViewport();
    await headerComponent.statisticsButtonIsInViewport();
  }
}
