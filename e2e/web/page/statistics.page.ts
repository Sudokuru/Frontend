import { Locator, Page, expect } from "@playwright/test";

export class StatisticsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly deleteStatsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Total Game Statistics");
    this.deleteStatsButton = page.getByTestId("deleteStatsButton");
  }

  async statisticsPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async clickDeleteStatsAndPopupButtons(popupButton: boolean) {
    await expect(this.deleteStatsButton).toBeInViewport({ ratio: 1 });
    await this.deleteStatsButton.click();
    const confirmLocator = this.page.getByTestId("awesome-alert-confirm-btn");
    await expect(confirmLocator).toBeInViewport({ ratio: 1 });
    const cancelLocator = this.page.getByTestId("awesome-alert-cancel-btn");
    await expect(cancelLocator).toBeInViewport({ ratio: 1 });
    if (popupButton) {
      await confirmLocator.click();
    } else {
      await cancelLocator.click();
    }
  }
}
