import { Locator, Page, expect } from "@playwright/test";

export class AboutUsPage {
  readonly page: Page;
  readonly mission: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mission = page.getByText("Mission");
  }

  async aboutUsPageIsRendered() {
    await expect(this.mission).toBeInViewport({ ratio: 1 });
  }

  async teamMemberCardIsVisible(name: string) {
    await expect(this.page.getByTestId(name)).toBeInViewport({ ratio: 1 });
  }

  async teamMemberCardHasText(name: string, text: string) {
    await expect(this.page.getByTestId(name)).toContainText(text);
  }

  async linkButtonWorks(name: string, url: string) {
    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.getByTestId("button-" + name).click(),
    ]);
    expect(newPage.url()).toBe(url);
  }

  async mediaButtonsWork() {
    await this.linkButtonWorks(
      "source-code",
      "https://github.com/Sudokuru/Frontend",
    );
    await this.linkButtonWorks("youtube", "https://www.youtube.com/@SudoKuru");
  }
}
