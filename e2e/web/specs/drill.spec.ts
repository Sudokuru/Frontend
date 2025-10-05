import { SUDOKU_STRATEGY_ARRAY, SudokuStrategy } from "sudokuru";
import { DrillPage } from "./../page/drill.page";
import { test } from "../fixture";
import { expect } from "@playwright/test";
import { getStrategies } from "../../../sudokuru/app/Api/Lessons";
import { ProfilePage } from "../page/profile.page";

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
