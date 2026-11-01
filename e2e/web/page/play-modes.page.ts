import { Locator, Page, expect } from "@playwright/test";

export class PlayModesPage {
  readonly page: Page;
  readonly playModesPage: Locator;
  readonly classic: Locator;

  constructor(page: Page) {
    this.page = page;
    this.playModesPage = page.getByTestId("PlayModesPage");
    this.classic = page.getByTestId("VariantClassicButton");
  }

  async playModesPageIsRendered() {
    await expect(this.playModesPage).toBeInViewport({ ratio: 1 });
    await expect(this.classic).toBeInViewport({ ratio: 1 });
  }
}
