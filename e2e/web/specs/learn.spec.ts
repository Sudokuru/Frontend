import { LearnPage } from "../page/learn.page";
import { test } from "../fixture";
import { expect } from "@playwright/test";
import { getStrategies } from "../../../sudokuru/app/Api/Lessons";

test.describe("learn", () => {
  test("should verify lessons have correct initial states", async ({
    learn,
  }) => {
    const learnPage = new LearnPage(learn);
    await learnPage.verifyLessonNext(0);
    for (let i: number = 1; i < getStrategies().length; i++) {
      await learnPage.verifyLessonLocked(i);
    }
  });

  test("should display correct difficulty text", async ({
    learn,
  }) => {
    const learnPage = new LearnPage(learn);
    for (let i: number = 0; i < 8; i++) {
      if (i == 0) {
        await learnPage.verifyLessonDifficultyText(i, "lesson", "Very Easy");
      } else if (i < 4) {
        await learnPage.verifyLessonDifficultyText(i, "locked", "Very Easy");
      } else if (i == 4) {
        await learnPage.verifyLessonDifficultyText(i, "locked", "Easy");
      } else if (i == 5) {
        await learnPage.verifyLessonDifficultyText(i, "locked", "Intermediate");
      } else if (i == 6) {
        await learnPage.verifyLessonDifficultyText(i, "locked", "Hard");
      } else {
        await learnPage.verifyLessonDifficultyText(i, "locked", "Very Hard");
      }
    }
  });
});