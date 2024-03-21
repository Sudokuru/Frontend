import { Locator, Page, expect } from "@playwright/test";

export class ContactPage {
  readonly title: Locator;

  constructor(page: Page) {
    this.title = page.getByText("Contact Us");
  }

  async contactPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
