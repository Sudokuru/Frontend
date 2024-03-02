import { Locator, Page, expect } from "@playwright/test";

export class SudokuPage {
  readonly page: Page;
  readonly timer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timer = page.getByText("Time: ");
  }

  async sudokuPageIsRendered() {
    await expect(this.timer).toBeInViewport({ ratio: 1 });
  }
}
