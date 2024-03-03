import { Locator, Page, expect } from "@playwright/test";

export class PlayPage {
  readonly page: Page;
  readonly title: Locator;
  readonly start: Locator;

  constructor(page: Page) {
    this.page = page;
    // last because you may visit the page multiple times and
    // you want to make sure you are getting the visible one so
    // you can check if it is in the viewport for isRendered
    this.title = page.getByText("Play a Sudoku game").last();
    this.start = page.getByText("Start Puzzle");
  }

  async playPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
