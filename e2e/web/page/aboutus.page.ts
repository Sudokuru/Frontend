import { Locator, Page, expect } from "@playwright/test";

export class AboutUsPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("About Us");
  }

  async aboutUsPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
