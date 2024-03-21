import { Locator, Page, expect } from "@playwright/test";

export class ContactPage {
  readonly title: Locator;
  readonly submitFeedback: Locator;

  constructor(page: Page) {
    this.title = page.getByText("Contact Us");
    this.submitFeedback = page.getByTestId("SubmitFeedbackButton");
  }

  async contactPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }
}
