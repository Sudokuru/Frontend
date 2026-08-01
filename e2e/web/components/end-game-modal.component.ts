import { Locator, Page, expect } from "@playwright/test";

export class EndGameModalComponent {
  readonly page: Page;

  readonly title: Locator;
  readonly results: Locator;
  readonly newGame: Locator;
  readonly changeDifficulty: Locator;
  readonly expandableHintsRow: Locator;
  readonly expandableHintsChevron: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Game Results");
    this.results = page.getByTestId("endGameResults");
    this.newGame = page.getByTestId("StartNewGameButton");
    this.changeDifficulty = page.getByTestId("ChangeDifficultyButton");
    this.expandableHintsRow = page.getByTestId("expandableNumHintsUsed");
    this.expandableHintsChevron = page.getByTestId("expandableNumHintsChevron");
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

  async totalHintsUsedIsFullyVisible(value: string) {
    await expect(this.expandableHintsRow).toBeInViewport({ ratio: 1 });
    await expect(this.expandableHintsRow).toContainText("Total Hints Used: ");
    await expect(this.page.getByTestId("numHintsUsed")).toHaveText(value);
  }

  async breakdownStatisticIsVisible(
    testID: string,
    label: string | RegExp,
    value: string | RegExp,
  ) {
    const row = this.page.getByTestId(`${testID}Row`);
    const labelElement = this.page.getByTestId(`${testID}Label`);
    const valueElement = this.page.getByTestId(testID);

    await expect(row).toBeInViewport({ ratio: 1 });
    await expect(labelElement).toHaveText(label);
    await expect(valueElement).toHaveText(value);
  }

  async expandHintsBreakdown() {
    await this.expandableHintsRow.click();
  }

  async hintsBreakdownIsCollapsed() {
    await expect(this.page.getByTestId(/^hintsUsed/)).toHaveCount(0);
  }

  async expandableHintsChevronIsVisible() {
    await expect(this.expandableHintsChevron).toBeInViewport({ ratio: 1 });
  }

  async expandableHintsChevronIsHidden() {
    await expect(this.expandableHintsChevron).toHaveCount(0);
  }

  async expandableHintsRowIsDisabled() {
    await expect(this.expandableHintsRow).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  }
}
