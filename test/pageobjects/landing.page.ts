import { $ } from "@wdio/globals";
import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LandingPage extends Page {
  /**
   * define selectors using getter methods
   */
  public get homeLearnButton() {
    return $("//*[@data-testid='HomeLearnButton']");
  }

  public get homeDrillButton() {
    return $("//*[@data-testid='HomeDrillButton']");
  }

  public get homePlayButton() {
    return $("//*[@data-testid='HomePlayButton']");
  }
}

export default new LandingPage();
