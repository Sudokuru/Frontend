import { Locator, Page, expect } from "@playwright/test";

import { HeaderComponent } from "../components/header.component";

export class HomePage {
  readonly page: Page;
  readonly startLessons: Locator;
  readonly startDrills: Locator;
  readonly playSudoku: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startLessons = page.getByTestId("HomeLearnButton");
    this.startDrills = page.getByTestId("HomeDrillButton");
    this.playSudoku = page.getByTestId("HomePlayButton");
  }

  async homePageIsRendered() {
    await expect(this.startLessons).toBeInViewport({ ratio: 1 });
    await expect(this.startDrills).toBeInViewport({ ratio: 1 });
    await expect(this.playSudoku).toBeInViewport({ ratio: 1 });
  }

  async headerRendersCorrectly() {
    const headerComponent = new HeaderComponent(this.page);
    await expect(headerComponent.drawer).toBeInViewport({ ratio: 1 });
    await expect(headerComponent.home).not.toBeInViewport({ ratio: 1 });
    await expect(headerComponent.profile).toBeInViewport({ ratio: 1 });
    await expect(headerComponent.statistics).toBeInViewport({ ratio: 1 });
  }
}
