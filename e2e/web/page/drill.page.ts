import { Locator, Page, expect } from "@playwright/test";

export class DrillPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Train with a strategy");
  }

  async drillPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async verifyDrillDifficultyText(
    drill: string,
    text: string,
    drillDifficulty: string,
  ) {
    const drillLocator = this.page.getByTestId(drill);
    const drillTextLocator = drillLocator.getByText(text);
    await drillTextLocator.scrollIntoViewIfNeeded();
    await expect(drillTextLocator).toBeInViewport({ ratio: 1 });
    const drillDifficultyLocator = drillLocator.getByText(drillDifficulty);
    await drillTextLocator.scrollIntoViewIfNeeded();
    await expect(drillDifficultyLocator).toBeInViewport({ ratio: 1 });
  }

  async getAndClickDrill(drill: string) {
    const lessonLocator = this.page.getByTestId(drill);
    await lessonLocator.click();
  }
}
