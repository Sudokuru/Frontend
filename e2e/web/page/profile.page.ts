import { Locator, Page, expect } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Profile");
  }

  async profilePageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
