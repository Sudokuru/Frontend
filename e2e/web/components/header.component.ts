import { Locator, Page } from "@playwright/test";

export class HeaderComponent {
  readonly drawer: Locator;
  readonly drawerClose: Locator;
  readonly drawerHome: Locator;
  readonly drawerLearn: Locator;
  readonly drawerDrill: Locator;
  readonly drawerPlay: Locator;
  readonly drawerContact: Locator;

  readonly logo: Locator;
  readonly statistics: Locator;
  readonly profile: Locator;
  readonly home: Locator;

  constructor(page: Page) {
    this.drawer = page.getByTestId("OpenDrawerNavigation");
    this.drawerClose = page
      .getByTestId("CloseDrawerNavigation")
      .getByRole("button", { name: "Close" });
    this.drawerHome = page.getByRole("button", { name: "Home" });
    this.drawerLearn = page.getByRole("button", { name: "Learn" });
    this.drawerDrill = page.getByRole("button", { name: "Drill" });
    this.drawerPlay = page.getByRole("button", { name: "Play" });
    this.drawerContact = page.getByRole("button", { name: "Contact" });

    this.logo = page.locator("img").nth(3); //todo create test id for logo
    this.statistics = page.getByTestId("ViewStatisticsPageButton");
    this.profile = page.getByTestId("ViewProfilePageButton");
    this.home = page.getByTestId("ViewHomePageButton");
  }
}
