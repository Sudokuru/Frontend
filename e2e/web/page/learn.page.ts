import { Locator, Page, expect } from "@playwright/test";

export class LearnPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Learn new strategies");
  }

  async learnPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
