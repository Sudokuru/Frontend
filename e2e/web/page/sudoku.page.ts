import { Locator, Page, expect } from "@playwright/test";

export class SudokuPage {
  readonly page: Page;
  readonly timer: Locator;
  readonly pause: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timer = page.getByText("Time: ");
    this.pause = page.getByTestId("PauseButton");
  }

  async sudokuPageIsRendered() {
    await expect(this.timer).toBeInViewport({ ratio: 1 });
  }
}
