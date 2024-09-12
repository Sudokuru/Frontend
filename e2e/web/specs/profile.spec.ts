import { ProfilePage } from "../page/profile.page";
import { test } from "../fixture";
import { expect } from "@playwright/test";
import {
  GOLD_COLOR_RGB,
  PURPLE_COLOR_RGB,
} from "../../../app/Styling/HighlightColors";
import { SUDOKU_STRATEGY_ARRAY } from "sudokuru";
import { HeaderComponent } from "../components/header.component";

test.describe("profile", () => {
  test("should toggle the theme and verify title color change", async ({
    profile,
  }) => {
    const profilePage = new ProfilePage(profile);
    const title = profile.getByText("Profile");
    await expect(title).toHaveCSS("color", GOLD_COLOR_RGB);
    await profilePage.themeSwitchEnabled.click();
    await expect(title).toHaveCSS("color", PURPLE_COLOR_RGB);
  });

  test("should toggle root highlight and verify all highlight switches' states", async ({
    profile,
  }) => {
    const profilePage = new ProfilePage(profile);
    await profilePage.highlightSwitchEnabled.click();
    await profilePage.verifyAllHighlightSwitchesAreDisabled();

    await profilePage.highlightSwitchDisabled.click();
    await profilePage.verifyAllHighlightSwitchesAreEnabled();

    await profilePage.highlightSwitchEnabled.click();
    await profilePage.highlightBoxSwitchDisabled.click();
    await profilePage.highlightColumnSwitchDisabled.click();

    await profilePage.highlightSwitchDisabled.click();
    await profilePage.verifyAllHighlightSwitchesAreEnabled();
  });

  test.describe("strategy hint order", () => {
    test("strategies render correctly", async ({ featurePreview }) => {
      const profilePage = new ProfilePage(featurePreview);
      await profilePage.strategiesRenderCorrectly(SUDOKU_STRATEGY_ARRAY);
    });

    test("increment buttons should be disabled and enabled correctly", async ({
      featurePreview,
    }) => {
      const profilePage = new ProfilePage(featurePreview);
      await expect(profilePage.hintStrategyMenuUp).toBeDisabled();
      await expect(profilePage.hintStrategyMenuDown).toBeDisabled();

      await profilePage.clickHintStrategy(1, SUDOKU_STRATEGY_ARRAY[0]);

      await expect(profilePage.hintStrategyMenuUp).toBeDisabled();
      await expect(profilePage.hintStrategyMenuDown).toBeEnabled();

      // click last sudoku strategy
      await profilePage.clickHintStrategy(
        SUDOKU_STRATEGY_ARRAY.length,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 1]
      );

      await expect(profilePage.hintStrategyMenuUp).toBeEnabled();
      await expect(profilePage.hintStrategyMenuDown).toBeDisabled();
    });

    test("reset button functions correctly", async ({ featurePreview }) => {
      const profilePage = new ProfilePage(featurePreview);

      await profilePage.clickHintStrategy(1, SUDOKU_STRATEGY_ARRAY[0]);

      await profilePage.hintStrategyMenuDown.click();
      await profilePage.hintStrategyMenuDown.click();

      await profilePage.isHintStrategyVisible(3, SUDOKU_STRATEGY_ARRAY[0]);

      await profilePage.hintStrategyReset.click();

      await profilePage.isHintStrategyVisible(1, SUDOKU_STRATEGY_ARRAY[0]);
    });

    test("reset button functions correctly with refresh", async ({
      featurePreview,
    }) => {
      const profilePage = new ProfilePage(featurePreview);

      await profilePage.clickHintStrategy(1, SUDOKU_STRATEGY_ARRAY[0]);

      await profilePage.hintStrategyMenuDown.click();
      await profilePage.hintStrategyMenuDown.click();

      await profilePage.isHintStrategyVisible(3, SUDOKU_STRATEGY_ARRAY[0]);

      await featurePreview.reload();

      const headerComponent = new HeaderComponent(featurePreview);
      await headerComponent.profile.click();
      const reloadedProfilePage = new ProfilePage(featurePreview);

      await reloadedProfilePage.hintStrategyReset.click();
      await reloadedProfilePage.isHintStrategyVisible(
        1,
        SUDOKU_STRATEGY_ARRAY[0]
      );
    });

    test("setting changes are saved accross refresh", async ({
      featurePreview,
    }) => {
      const profilePage = new ProfilePage(featurePreview);

      await profilePage.clickHintStrategy(1, SUDOKU_STRATEGY_ARRAY[0]);

      await profilePage.hintStrategyMenuDown.click();
      await profilePage.hintStrategyMenuDown.click();
      await profilePage.hintStrategyMenuDown.click();

      await profilePage.isHintStrategyVisible(4, SUDOKU_STRATEGY_ARRAY[0]);
      await profilePage.isHintStrategyVisible(1, SUDOKU_STRATEGY_ARRAY[1]);

      await profilePage.clickHintStrategy(
        SUDOKU_STRATEGY_ARRAY.length,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 1]
      );
      await profilePage.hintStrategyMenuUp.click();
      await profilePage.hintStrategyMenuUp.click();
      await profilePage.hintStrategyMenuUp.click();

      await profilePage.isHintStrategyVisible(
        SUDOKU_STRATEGY_ARRAY.length - 3,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 1]
      );
      await profilePage.isHintStrategyVisible(
        SUDOKU_STRATEGY_ARRAY.length,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 2]
      );

      await featurePreview.reload();

      const headerComponent = new HeaderComponent(featurePreview);
      await headerComponent.profile.click();
      const reloadedProfilePage = new ProfilePage(featurePreview);

      await reloadedProfilePage.isHintStrategyVisible(
        4,
        SUDOKU_STRATEGY_ARRAY[0]
      );
      await reloadedProfilePage.isHintStrategyVisible(
        1,
        SUDOKU_STRATEGY_ARRAY[1]
      );
      await reloadedProfilePage.isHintStrategyVisible(
        SUDOKU_STRATEGY_ARRAY.length - 3,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 1]
      );
      await reloadedProfilePage.isHintStrategyVisible(
        SUDOKU_STRATEGY_ARRAY.length,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 2]
      );
    });
  });
});
