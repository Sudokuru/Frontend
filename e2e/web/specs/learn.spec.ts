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
});