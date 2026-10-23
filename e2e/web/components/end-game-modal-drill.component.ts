import { Locator, Page, expect } from "@playwright/test";

export class EndGameDrillModalComponent {
  readonly page: Page;

  readonly title: Locator;
  readonly results: Locator;
  readonly newGame: Locator;
  readonly changeStrategy: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Drill Results");
    this.results = page.getByTestId("endGameResults");
    this.newGame = page.getByTestId("StartNewDrillGame");
    this.changeStrategy = page.getByTestId("ChangeDrillButton");
  }

  async endGameModalIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
    await expect(this.results).toBeInViewport({ ratio: 1 });
  }

  async statisticIsFullyVisible(
    testID: string,
    label: string | RegExp,
    value: string | RegExp,
  ) {
    const row = this.page.getByTestId(`${testID}Row`);
    const labelElement = this.page.getByTestId(`${testID}Label`);
    const valueElement = this.page.getByTestId(testID);

    await expect(row).toBeInViewport({ ratio: 1 });
    await expect(labelElement).toBeInViewport({ ratio: 1 });
    await expect(valueElement).toBeInViewport({ ratio: 1 });
    await expect(labelElement).toHaveText(label);
    await expect(valueElement).toHaveText(value);
  }
}
