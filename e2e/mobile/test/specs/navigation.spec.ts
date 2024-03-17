import HomePage from "../page/home.page.ts";
import { expect } from "@wdio/globals";
import ExpoPage from "../page/expo.page.ts";
import LearnPage from "../page/learn.page.ts";
import DrillPage from "../page/drill.page.ts";
import PlayPage from "../page/play.page.ts";
import ContactPage from "../page/contact.page.ts";
import ProfilePage from "../page/profile.page.ts";
import StatisticsPage from "../page/statistics.page.ts";
import HeaderComponent from "../components/header.component.ts";

describe("navigation routing", () => {
  beforeEach(async () => {
    if (isExpoTest()) {
      await ExpoPage.openApp();
      await HomePage.homePageIsRendered();
    }
  });

  it("can go everywhere in the app", async () => {
    await (await HeaderComponent.drawer).click();
    await HeaderComponent.drawerIsRendered();
    await HeaderComponent.drawerClose.click();

    await HomePage.startLessons.click();
    await expect(await LearnPage.title).toBeDisplayed();
    await navigateBackHome();

    await HomePage.startDrills.click();
    await expect(await DrillPage.title).toBeDisplayed();
    await navigateBackHome();

    await HomePage.playSudoku.click();
    await expect(await PlayPage.title).toBeDisplayed();
    await navigateBackHome();

    await HeaderComponent.drawer.click();
    await HeaderComponent.drawerContact.click();
    await expect(await ContactPage.title).toBeDisplayed();
    await navigateBackHome();

    await HeaderComponent.profile.click();
    await expect(await ProfilePage.title).toBeDisplayed();
    await HeaderComponent.home.click();
    await HomePage.homePageIsRendered();

    await HeaderComponent.statistics.click();
    await expect(await StatisticsPage.title).toBeDisplayed();
    await HeaderComponent.home.click();
    await HomePage.homePageIsRendered();
  });
});

const navigateBackHome = async () => {
  await HeaderComponent.drawer.click();
  await HeaderComponent.drawerHome.click();
  await HomePage.homePageIsRendered();
};

const isExpoTest = (): boolean => {
  return (
    "appium:appPackage" in driver.capabilities &&
    driver.capabilities["appium:appPackage"] == "host.exp.exponent"
  );
};
