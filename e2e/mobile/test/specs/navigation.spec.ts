import HomePage from "../page/home.page.ts";
import { expect } from "@wdio/globals";
import ExpoPage from "../page/expo.page.ts";
import LearnPage from "../page/learn.page.ts";
import HeaderComponent from "../components/header.component.ts";

describe("navigation routing", () => {
  beforeEach(async () => {
    await ExpoPage.openApp();
    await HomePage.homePageIsRendered();
  });

  it("can go everywhere in the app", async () => {
    await (await HeaderComponent.drawer).click();
    await HeaderComponent.drawerIsRendered();
    await HeaderComponent.drawerClose.click();

    await HomePage.startLessons.click();
    await expect(await LearnPage.title).toBeDisplayed();

    await HeaderComponent.drawer.click();
    await HeaderComponent.drawerHome.click();
    await HomePage.homePageIsRendered();
  });
});
