import { Locator, Page, expect } from "@playwright/test";

export class DrillPage {
  readonly page: Page;
  readonly title: Locator;
  readonly resume: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Train with a strategy");
    this.resume = page.getByText("Resume Drill");
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

  async resumeButtonIsVisible() {
    await expect(this.resume).toBeInViewport({ ratio: 1 });
  }
}
