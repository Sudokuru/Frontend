import { expect } from "@wdio/globals";
import LandingPage from "../pageobjects/landing.page";

describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    await LandingPage.open();

    await expect(LandingPage.homeDrillButton).toBeClickable();

    await LandingPage.homeDrillButton.click();
  });

  it("should login with valid credentials", async () => {
    await LandingPage.open();

    await expect(LandingPage.homeDrillButton).toBeClickable();

    await LandingPage.homeDrillButton.click();
  });

  it("should login with valid credentials", async () => {
    await LandingPage.open();

    await expect(LandingPage.homeDrillButton).toBeClickable();

    await LandingPage.homeDrillButton.click();
  });

  it("should login with valid credentials", async () => {
    await LandingPage.open();

    await expect(LandingPage.homeDrillButton).toBeClickable();

    await LandingPage.homeDrillButton.click();
  });
});
