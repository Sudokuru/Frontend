import { Locator, Page, expect } from "@playwright/test";

export class HeaderComponent {
  readonly logo: Locator;
  readonly statistics: Locator;
  readonly profile: Locator;
  readonly home: Locator;

  constructor(page: Page) {
    this.logo = page.locator("img").nth(3); //todo create test id for logo
    this.statistics = page.getByTestId("ViewStatisticsPageButton");
    this.profile = page.getByTestId("ViewProfilePageButton");
    this.home = page.getByTestId("ViewHomePageButton");
  }

  // todo get testing for enable / disable of logo button
  // async logoButtonIsDisabled() {
  //     await expect(this.logo).not.toBeEnabled();
  // }

  // async logoButtonIsEnabled() {
  //     await expect(this.logo).toBeEnabled();
  // }

  // async clickLogoButton() {
  //     await this.logo.click();
  // }

  async statisticsButtonIsInViewport() {
    await expect(this.statistics).toBeInViewport({ ratio: 1 });
  }

  async statisticsButtonIsNotInViewport() {
    await expect(this.statistics).not.toBeInViewport({ ratio: 1 });
  }

  async clickStatisticsButton() {
    await this.statistics.click();
  }

  async profileButtonIsInViewport() {
    await expect(this.profile).toBeInViewport({ ratio: 1 });
  }

  async profileButtonIsNotInViewport() {
    await expect(this.profile).not.toBeInViewport({ ratio: 1 });
  }

  async clickProfileButton() {
    await this.profile.click();
  }

  async homeButtonIsInViewport() {
    await expect(this.home).toBeInViewport({ ratio: 1 });
  }

  async homeButtonIsNotInViewport() {
    await expect(this.home).not.toBeInViewport({ ratio: 1 });
  }

  async clickHomeButton() {
    await this.home.click();
  }
}
