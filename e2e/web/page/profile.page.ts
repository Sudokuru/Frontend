import { Locator, Page, expect } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly title: Locator;
  readonly themeSwitchEnabled: Locator;
  readonly themeSwitchDisabled: Locator;
  readonly identicalValuesSwitchEnabled: Locator;
  readonly identicalValuesSwitchDisabled: Locator;
  readonly highlightBoxSwitchEnabled: Locator;
  readonly highlightBoxSwitchDisabled: Locator;
  readonly highlightRowSwitchEnabled: Locator;
  readonly highlightRowSwitchDisabled: Locator;
  readonly highlightColumnSwitchEnabled: Locator;
  readonly highlightColumnSwitchDisabled: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Profile");
    this.themeSwitchEnabled = page.getByTestId("DarkThemeEnabled");
    this.themeSwitchDisabled = page.getByTestId("DarkThemeDisabled");
    this.identicalValuesSwitchEnabled = page.getByTestId(
      "HighlightIdenticalValuesEnabled"
    );
    this.identicalValuesSwitchDisabled = page.getByTestId(
      "HighlightIdenticalValuesDisabled"
    );
    this.highlightBoxSwitchEnabled = page.getByTestId("HighlightBoxEnabled");
    this.highlightBoxSwitchDisabled = page.getByTestId("HighlightBoxDisabled");
    this.highlightRowSwitchEnabled = page.getByTestId("HighlightRowEnabled");
    this.highlightRowSwitchDisabled = page.getByTestId("HighlightRowDisabled");
    this.highlightColumnSwitchEnabled = page.getByTestId(
      "HighlightColumnEnabled"
    );
    this.highlightColumnSwitchDisabled = page.getByTestId(
      "HighlightColumnDisabled"
    );
  }

  async profilePageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
