import { Page } from "@playwright/test";

export class AboutUsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
