import { contactUs } from "../fixture";
import { ContactPage } from "../page/contact.page";
import { expect } from "@playwright/test";
import { HomePage } from "../page/home.page";
import { Request } from "@playwright/test";

const contactTypes = [
  ["Feature", "Feature%20Request"],
  ["Bug", "Bug%20Report"],
  ["Other", "Other"],
];

contactUs.describe("contact page", () => {
  for (const [value, feedbackType] of contactTypes) {
    contactUs(value, async ({ page }) => {
      const contactPage = new ContactPage(page);
      await contactPage.submitFeedbackButtonIsDisabled();
      await contactPage.inputCounterIsZero();
      await contactPage.feedback.click();
      await contactPage.feedback.fill("Ban Cheaters!");
      await contactPage.inputCounterIsX("Ban Cheaters!".length);
      await contactPage.submitFeedbackButtonIsDisabled();
      await contactPage.page.getByText(value).click();
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
          .includes(
            "feedbackType=" + feedbackType + "&feedbackText=Ban%20Cheaters!"
          )
      ).toBeTruthy();
      await contactPage.thankYouIsVisible();
      await contactPage.closeAlert();
      const homePage = new HomePage(page);
      await homePage.homePageIsRendered();
    });
  }

  contactUs("Error", async ({ page }) => {
    const contactPage = new ContactPage(page);
    await contactPage.submitFeedbackButtonIsDisabled();
    await contactPage.inputCounterIsZero();
    await contactPage.page.getByText("Feature").click();
    await contactPage.submitFeedbackButtonIsDisabled();
    await contactPage.feedback.click();
    await contactPage.feedback.fill(" ");
    await contactPage.inputCounterIsX(" ".length);
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
        .includes("feedbackType=Feature%20Request&feedbackText=")
    ).toBeTruthy();
    await contactPage.errorIsVisible();
    await contactPage.closeAlert();
    await contactPage.errorIsNotVisible();
    await contactPage.submitFeedbackButtonIsEnabled();
  });
});
