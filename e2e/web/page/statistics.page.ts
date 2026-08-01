import { Locator, Page, expect } from "@playwright/test";

export class StatisticsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly deleteStatsButton: Locator;
  readonly expandableHintsRow: Locator;
  readonly expandableHintsChevron: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Total Game Statistics");
    this.deleteStatsButton = page.getByTestId("deleteStatsButton");
    this.expandableHintsRow = page.getByTestId("expandableNumHintsUsed");
    this.expandableHintsChevron = page.getByTestId("expandableNumHintsChevron");
  }

  async statisticsPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async clickDeleteStatsAndPopupButtons(popupButton: boolean) {
    await expect(this.deleteStatsButton).toBeInViewport({ ratio: 1 });
    await this.deleteStatsButton.click();
    const confirmLocator = this.page.getByTestId("confirmDeleteButton");
    await expect(confirmLocator).toBeInViewport({ ratio: 1 });
    const cancelLocator = this.page.getByTestId("cancelDeleteButton");
    await expect(cancelLocator).toBeInViewport({ ratio: 1 });
    if (popupButton) {
      await confirmLocator.click();
    } else {
      await cancelLocator.click();
    }
  }

  async totalHintsUsedIsFullyVisible(value: string) {
    await expect(this.expandableHintsRow).toBeInViewport({ ratio: 1 });
    await expect(this.expandableHintsRow).toContainText("Total Hints Used: ");
    await expect(this.page.getByTestId("numHintsUsed")).toHaveText(value);
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
