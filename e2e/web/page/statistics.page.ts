import { Locator, Page, expect } from "@playwright/test";

export class StatisticsPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Total Game Statistics");
  }

  async profilePageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
