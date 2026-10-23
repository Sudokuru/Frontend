import { DrillPage } from "./../page/drill.page";
import { test } from "../fixture";
import { expect } from "@playwright/test";
import { HomePage } from "../page/home.page";
import { SudokuBoardComponent } from "../components/sudoku-board.component";

test.describe("drill", () => {
  test("cards should display correct text", async ({ drill }) => {
    const DRILL_CARD_INFORMATION = [
      {
        strategy: "OBVIOUS_SINGLE",
        text: "Obvious Single",
        difficulty: "Very Easy",
      },
      {
        strategy: "OBVIOUS_PAIR",
        text: "Obvious Pair",
        difficulty: "Easy",
      },
      {
        strategy: "OBVIOUS_TRIPLET",
        text: "Obvious Triplet",
        difficulty: "Intermediate",
      },
      {
        strategy: "OBVIOUS_QUADRUPLET",
        text: "Obvious Quadruplet",
        difficulty: "Intermediate",
      },
      {
        strategy: "HIDDEN_SINGLE",
        text: "Hidden Single",
        difficulty: "Hard",
      },
      {
        strategy: "HIDDEN_PAIR",
        text: "Hidden Pair",
        difficulty: "Very Hard",
      },
      {
        strategy: "HIDDEN_TRIPLET",
        text: "Hidden Triplet",
        difficulty: "Very Hard",
      },
      {
        strategy: "HIDDEN_QUADRUPLET",
        text: "Hidden Quadruplet",
        difficulty: "Very Hard",
      },
      {
        strategy: "POINTING_PAIR",
        text: "Pointing Pair",
        difficulty: "Very Hard",
      },
      {
        strategy: "POINTING_TRIPLET",
        text: "Pointing Triplet",
        difficulty: "Very Hard",
      },
    ];

    const drillPage = new DrillPage(drill);

    const filteredData = DRILL_CARD_INFORMATION.filter(
      ({ strategy }) => strategy === strategy,
    );

    for (const { strategy, text, difficulty } of filteredData) {
      await drillPage.verifyDrillDifficultyText(strategy, text, difficulty);
    }
  });
});

test.describe("drill tutorial", () => {
  test.use({ homeShortcutsStorage: ["play", "drill", "drill-obvious-single"] });

  for (const entry of ["home shortcut", "drill page"] as const) {
    test(`shows instructions on each start from ${entry} unless opted out`, async ({
      featurePreview,
    }) => {
      const home = new HomePage(featurePreview);
      const drill = new DrillPage(featurePreview);
      const board = new SudokuBoardComponent(featurePreview);
      const start = async () => {
        await featurePreview.reload();
        if (entry === "home shortcut") {
          await home.shortcut("HomeObviousSingleDrillShortcut").click();
        } else {
          await home.startDrills.click();
          await drill.getAndClickDrill("OBVIOUS_SINGLE");
        }
      };

      await start();
      await expect(drill.tutorial).toBeInViewport({ ratio: 1 });
      await expect(board.sudokuBoard).toHaveCount(0);
      await drill.tutorialContinue.click();
      await board.sudokuBoardIsRendered();
      await expect(board.difficulty).toContainText("Obvious Single");

      await start();
      await expect(drill.tutorial).toBeInViewport({ ratio: 1 });
      await drill.tutorialOptOut.click();
      await drill.tutorialContinue.click();
      await board.sudokuBoardIsRendered();

      await featurePreview.reload();
      // Verify the preference applies to both entry points, not just the one
      // where the tutorial was dismissed.
      await home.shortcut("HomeObviousSingleDrillShortcut").click();
      await board.sudokuBoardIsRendered();
      await expect(drill.tutorial).toHaveCount(0);
      await featurePreview.reload();
      await home.startDrills.click();
      await drill.getAndClickDrill("OBVIOUS_SINGLE");
      await board.sudokuBoardIsRendered();
      await expect(drill.tutorial).toHaveCount(0);
    });
  }
});
