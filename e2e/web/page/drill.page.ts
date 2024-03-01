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
}
