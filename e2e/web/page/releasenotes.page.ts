import { Locator, Page, expect } from "@playwright/test";

export class ReleaseNotesPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Release Notes");
  }

  async releaseNotesPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async firstReleaseNoteIsRendered(version: string) {
    await expect(this.page.getByText(version)).toBeInViewport({ ratio: 1 });
  }
}
