import { Locator, Page, expect } from "@playwright/test";

export class EndGameDrillModalComponent {
  readonly page: Page;

  readonly title: Locator;
  readonly newGame: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Drill Results");
    this.newGame = page.getByText("Start New Drill");
  }

  async endGameModalIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
