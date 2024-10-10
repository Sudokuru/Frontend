import { Locator, Page, expect } from "@playwright/test";

export class AboutUsPage {
  readonly page: Page;
  readonly mission: Locator;
  readonly teamMembers: Locator[];
  readonly teamMemberButtons: Locator[];

  constructor(page: Page) {
    this.page = page;
    this.mission = page.getByText("Mission");
    const teamMemberNames = [
      "Greg",
      "Thomas",
      "Daniel",
      "Arthur",
      "Dahlia",
      "Min",
    ];
    this.teamMembers = teamMemberNames.map((name) => page.getByTestId(name));
    this.teamMemberButtons = teamMemberNames.map((name) =>
      page.getByTestId("button-" + name)
    );
  }

  async aboutUsPageIsRendered() {
    await expect(this.mission).toBeInViewport({ ratio: 1 });
  }
}
