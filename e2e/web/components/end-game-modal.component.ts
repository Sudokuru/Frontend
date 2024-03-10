import { Locator, Page, expect } from "@playwright/test";

export class EndGameModalComponent {
  readonly title: Locator;
  readonly newGame: Locator;

  constructor(page: Page) {
    this.title = page.getByText("Game Results");
    this.newGame = page.getByText("Play New Game");
  }

  async endGameModalIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
