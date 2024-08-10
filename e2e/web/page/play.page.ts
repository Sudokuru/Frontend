import { Locator, Page, expect } from "@playwright/test";

export class PlayPage {
  readonly page: Page;
  readonly title: Locator;
  readonly start: Locator;
  readonly threePointStar: Locator;
  readonly fourPointStar: Locator;
  readonly fivePointStar: Locator;
  readonly ninePointStar: Locator;
  readonly twentyFourPointStar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Play a Sudoku game");
    this.start = page.getByText("Start Puzzle");
    this.threePointStar = page.getByAltText("3 Point Star");
    this.fourPointStar = page.getByAltText("4 Point Star");
    this.fivePointStar = page.getByAltText("5 Point Star");
    this.ninePointStar = page.getByAltText("9 Point Star");
    this.twentyFourPointStar = page.getByAltText("24 Point Star");
  }

  async playPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async starsHaveCount(count: number) {
    await expect(this.threePointStar).toHaveCount(0);
    await expect(this.fourPointStar).toHaveCount(0);
    await expect(this.fivePointStar).toHaveCount(0);
    await expect(this.ninePointStar).toHaveCount(0);
    await expect(this.twentyFourPointStar).toHaveCount(0);
  }

  async starsAreVisible() {
    await this.starsHaveCount(1);
  }

  async starsAreHidden() {
    await this.starsHaveCount(0);
  }
}
