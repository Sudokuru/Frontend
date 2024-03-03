import { Locator, Page, expect } from "@playwright/test";

export class PlayPage {
  readonly page: Page;
  readonly title: Locator;
  readonly start: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Play a Sudoku game");
    this.start = page.getByText("Start Puzzle");
  }

  async playPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
