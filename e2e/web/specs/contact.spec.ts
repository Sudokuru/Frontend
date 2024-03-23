import { contactUs } from "../fixture";
import { ContactPage } from "../page/contact.page";
import { expect } from "@playwright/test";
import { HomePage } from "../page/home.page";
import { Request } from "@playwright/test";

contactUs.describe("contact page", () => {
  contactUs("feature request", async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.submitFeedbackButtonIsDisabled();
    await contactPage.inputCounterIsZero();
    await contactPage.feedback.click();
    await contactPage.feedback.fill("Ban Cheaters!");
    await contactPage.inputCounterIsX("Ban Cheaters!".length);
    await contactPage.submitFeedbackButtonIsDisabled();
    await contactPage.page.getByText("Feature").click();
    await contactPage.submitFeedbackButtonIsEnabled();
    let postRequestPromise = new Promise((resolve) => {
      page.on("request", (request) => {
        if (request.url().includes("https://script.google.com/")) {
          resolve(request); // Resolve the promise when the matching request happens
        }
      });
    });
    await contactPage.submitFeedback.click();
    await contactPage.buttonIsSubmitting();
    const capturedRequest = (await postRequestPromise) as Request;
    expect(
      capturedRequest
        .url()
        .includes("feedbackType=Feature%20Request&feedbackText=Ban%20Cheaters!")
    ).toBeTruthy();
    await contactPage.thankYouIsVisible();
    await contactPage.closeAlert();
    const homePage = new HomePage(page);
    await homePage.homePageIsRendered();
  });
});
