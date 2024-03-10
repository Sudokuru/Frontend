import { Locator, Page, expect } from "@playwright/test";

export class EndGameModalComponent {
  readonly page: Page;

  readonly title: Locator;
  readonly newGame: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Game Results");
    this.newGame = page.getByText("Play New Game");
  }

  async endGameModalIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
