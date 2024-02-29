import { Locator, Page, expect } from "@playwright/test";

export class HeaderComponent {
  readonly drawer: Locator;
  readonly logo: Locator;
  readonly statistics: Locator;
  readonly profile: Locator;
  readonly home: Locator;

  constructor(page: Page) {
    this.drawer = page.getByTestId("OpenDrawerNavigation");
    this.logo = page.locator("img").nth(3); //todo create test id for logo
    this.statistics = page.getByTestId("ViewStatisticsPageButton");
    this.profile = page.getByTestId("ViewProfilePageButton");
    this.home = page.getByTestId("ViewHomePageButton");
  }
}
