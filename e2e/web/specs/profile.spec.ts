import { ProfilePage } from "../page/profile.page";
import { test } from "../fixture";
import { expect } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";
import { returnSudokuStrategyArray } from "../../../sudokuru/app/Contexts/PreferencesContext";

const SUDOKU_STRATEGY_ARRAY = returnSudokuStrategyArray();

test.describe("profile", () => {
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

  test("should display 'None' as learned strategies when profile is initialized", async ({
    profile,
  }) => {
    const profilePage = new ProfilePage(profile);
    await profilePage.verifyLearnedLessonsMatch(["None"]);
  });

  test.describe("strategy hint order", () => {
    test("strategies render correctly", async ({ profile }) => {
      const profilePage = new ProfilePage(profile);
      await profilePage.strategiesRenderCorrectly(SUDOKU_STRATEGY_ARRAY);
    });

    test("increment buttons should be disabled and enabled correctly", async ({
      profile,
    }) => {
      const profilePage = new ProfilePage(profile);
      await expect(profilePage.hintStrategyMenuUp).toBeDisabled();
      await expect(profilePage.hintStrategyMenuDown).toBeDisabled();

      await profilePage.clickHintStrategy(1, SUDOKU_STRATEGY_ARRAY[0]);

      await expect(profilePage.hintStrategyMenuUp).toBeDisabled();
      await expect(profilePage.hintStrategyMenuDown).toBeEnabled();

      // click last sudoku strategy
      await profilePage.clickHintStrategy(
        SUDOKU_STRATEGY_ARRAY.length,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 1],
      );

      await expect(profilePage.hintStrategyMenuUp).toBeEnabled();
      await expect(profilePage.hintStrategyMenuDown).toBeDisabled();
    });

    test("reset button functions correctly", async ({ profile }) => {
      const profilePage = new ProfilePage(profile);

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
        SUDOKU_STRATEGY_ARRAY[0],
      );
    });

    test("setting changes are saved accross refresh", async ({ profile }) => {
      const profilePage = new ProfilePage(profile);

      await profilePage.clickHintStrategy(1, SUDOKU_STRATEGY_ARRAY[0]);

      await profilePage.hintStrategyMenuDown.click();
      await profilePage.hintStrategyMenuDown.click();
      await profilePage.hintStrategyMenuDown.click();

      await profilePage.isHintStrategyVisible(4, SUDOKU_STRATEGY_ARRAY[0]);
      await profilePage.isHintStrategyVisible(1, SUDOKU_STRATEGY_ARRAY[1]);

      await profilePage.clickHintStrategy(
        SUDOKU_STRATEGY_ARRAY.length,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 1],
      );
      await profilePage.hintStrategyMenuUp.click();
      await profilePage.hintStrategyMenuUp.click();
      await profilePage.hintStrategyMenuUp.click();

      await profilePage.isHintStrategyVisible(
        SUDOKU_STRATEGY_ARRAY.length - 3,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 1],
      );
      await profilePage.isHintStrategyVisible(
        SUDOKU_STRATEGY_ARRAY.length,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 2],
      );

      await profile.reload();

      const headerComponent = new HeaderComponent(profile);
      await headerComponent.profile.click();
      const reloadedProfilePage = new ProfilePage(profile);

      await reloadedProfilePage.isHintStrategyVisible(
        4,
        SUDOKU_STRATEGY_ARRAY[0],
      );
      await reloadedProfilePage.isHintStrategyVisible(
        1,
        SUDOKU_STRATEGY_ARRAY[1],
      );
      await reloadedProfilePage.isHintStrategyVisible(
        SUDOKU_STRATEGY_ARRAY.length - 3,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 1],
      );
      await reloadedProfilePage.isHintStrategyVisible(
        SUDOKU_STRATEGY_ARRAY.length,
        SUDOKU_STRATEGY_ARRAY[SUDOKU_STRATEGY_ARRAY.length - 2],
      );
    });
  });
});
