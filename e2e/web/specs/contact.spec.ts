import { test } from "../fixture";
import { ContactPage } from "../page/contact.page";
import { expect } from "@playwright/test";
import { HomePage } from "../page/home.page";
import { Request } from "@playwright/test";

const contactTypes = [
  ["Feature", "Feature%20Request"],
  ["Bug", "Bug%20Report"],
  ["Other", "Other"],
];

test.describe("contact page", () => {
  for (const [value, feedbackType] of contactTypes) {
    test(value, async ({ contact }) => {
      const contactPage = new ContactPage(contact);
      await contactPage.submitFeedbackButtonIsDisabled();
      await contactPage.inputCounterIsZero();
      await contactPage.feedback.click();
      await contactPage.feedback.fill("Ban Cheaters!");
      await contactPage.inputCounterIsX("Ban Cheaters!".length);
      await contactPage.submitFeedbackButtonIsDisabled();
      await contactPage.page.getByText(value).click();
      await contactPage.submitFeedbackButtonIsEnabled();
      let postRequestPromise = new Promise((resolve) => {
        contact.on("request", (request) => {
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
            "feedbackType=" + feedbackType + "&feedbackText=Ban%20Cheaters!",
          ),
      ).toBeTruthy();
      await contactPage.thankYouIsVisible();
      await contactPage.closeSubmitAlert();
      const homePage = new HomePage(contact);
      await homePage.homePageIsRendered();
    });
  }

  test("Error", async ({ contact }) => {
    const contactPage = new ContactPage(contact);
    await contactPage.submitFeedbackButtonIsDisabled();
    await contactPage.inputCounterIsZero();
    await contactPage.page.getByText("Feature").click();
    await contactPage.submitFeedbackButtonIsDisabled();
    await contactPage.feedback.click();
    await contactPage.feedback.fill(" ");
    await contactPage.inputCounterIsX(" ".length);
    await contactPage.submitFeedbackButtonIsEnabled();
    let postRequestPromise = new Promise((resolve) => {
      contact.on("request", (request) => {
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
        .includes("feedbackType=Feature%20Request&feedbackText="),
    ).toBeTruthy();
    await contactPage.errorIsVisible();
    await contactPage.closeErrorAlert();
    await contactPage.errorIsNotVisible();
    await contactPage.submitFeedbackButtonIsEnabled();
  });
});
