import { $, expect } from "@wdio/globals";

class HeaderComponent {
  public get drawer() {
    return $('//android.widget.Button[@resource-id="OpenDrawerNavigation"]');
  }

  public get drawerClose() {
    return $("~Close");
  }

  public get drawerHome() {
    return $("~Home");
  }

  public get drawerLearn() {
    return $("~Learn");
  }

  public get drawerDrill() {
    return $("~Drill");
  }

  public get drawerPlay() {
    return $("~Play");
  }

  public get drawerContact() {
    return $("~Contact");
  }

  public get statistics() {
    return $(
      '//android.widget.Button[@resource-id="ViewStatisticsPageButton"]'
    );
  }

  public get profile() {
    return $('//android.widget.Button[@resource-id="ViewProfilePageButton"]');
  }

  public get home() {
    return $('//android.widget.Button[@resource-id="ViewHomePageButton"]');
  }

  public async drawerIsRendered() {
    await expect(this.drawerClose).toBeDisplayed();
    await expect(this.drawerHome).toBeDisplayed();
    await expect(this.drawerLearn).toBeDisplayed();
    await expect(this.drawerDrill).toBeDisplayed();
    await expect(this.drawerPlay).toBeDisplayed();
    await expect(this.drawerContact).toBeDisplayed();
  }
}

export default new HeaderComponent();
