import { expect } from "@wdio/globals";
import LandingPage from "../pageobjects/landing.page";

describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    (await LandingPage.homeDrillButton).click();
  });
});
