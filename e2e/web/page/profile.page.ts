import { Locator, Page, expect } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly title: Locator;
  readonly themeSwitchEnabled: Locator;
  readonly themeSwitchDisabled: Locator;
  readonly highlightSwitchEnabled: Locator;
  readonly highlightSwitchDisabled: Locator;
  readonly highlightIdenticalValuesSwitchEnabled: Locator;
  readonly highlightIdenticalValuesSwitchDisabled: Locator;
  readonly highlightBoxSwitchEnabled: Locator;
  readonly highlightBoxSwitchDisabled: Locator;
  readonly highlightRowSwitchEnabled: Locator;
  readonly highlightRowSwitchDisabled: Locator;
  readonly highlightColumnSwitchEnabled: Locator;
  readonly highlightColumnSwitchDisabled: Locator;
  readonly featurePreviewSwitchEnabled: Locator;
  readonly featurePreviewSwitchDisabled: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Profile");
    this.themeSwitchEnabled = page.getByTestId("DarkThemeEnabled");
    this.themeSwitchDisabled = page.getByTestId("DarkThemeDisabled");
    this.highlightSwitchEnabled = page.getByTestId("HighlightEnabled");
    this.highlightSwitchDisabled = page.getByTestId("HighlightDisabled");
    this.highlightIdenticalValuesSwitchEnabled = page.getByTestId(
      "HighlightIdenticalValuesEnabled"
    );
    this.highlightIdenticalValuesSwitchDisabled = page.getByTestId(
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
    this.featurePreviewSwitchEnabled = page.getByTestId(
      "FeaturePreviewEnabled"
    );
    this.featurePreviewSwitchDisabled = page.getByTestId(
      "FeaturePreviewDisabled"
    );
  }

  async profilePageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async allHighlightSwitchesAreEnabled() {
    await expect(this.highlightSwitchEnabled).toBeInViewport({ ratio: 1 });
    await expect(this.highlightIdenticalValuesSwitchEnabled).toBeInViewport({
      ratio: 1,
    });
    await expect(this.highlightBoxSwitchEnabled).toBeInViewport({ ratio: 1 });
    await expect(this.highlightRowSwitchEnabled).toBeInViewport({ ratio: 1 });
    await expect(this.highlightColumnSwitchEnabled).toBeInViewport({
      ratio: 1,
    });
  }

  async allHighlightSwitchesAreDisabled() {
    await expect(this.highlightSwitchDisabled).toBeInViewport({ ratio: 1 });
    await expect(this.highlightIdenticalValuesSwitchDisabled).toBeInViewport({
      ratio: 1,
    });
    await expect(this.highlightBoxSwitchDisabled).toBeInViewport({ ratio: 1 });
    await expect(this.highlightRowSwitchDisabled).toBeInViewport({ ratio: 1 });
    await expect(this.highlightColumnSwitchDisabled).toBeInViewport({
      ratio: 1,
    });
  }
}
