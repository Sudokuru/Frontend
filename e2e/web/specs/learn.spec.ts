import { LearnPage } from "../page/learn.page";
import { test } from "../fixture";
import { expect } from "@playwright/test";
import { getStrategies } from "../../../sudokuru/app/Api/Lessons";
import { ProfilePage } from "../page/profile.page";
import { HeaderComponent } from "../components/header.component";

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

  test("should solve every lesson and verify they display in profile", async ({
    learn,
  }) => {
    const lessons: string[] = [];
    const learnPage = new LearnPage(learn);

    for (let i: number = 0; i < getStrategies().length; i++) {
      // Store lesson name and navigate there
      const lessonName = await learnPage.getAndClickLesson(i, "lesson");
      const titleLocator = learn.getByText(lessonName + " Lesson");

      // Verify on lesson page then finish it and add to learned lessons array
      await expect(titleLocator).toBeInViewport({ ratio: 1 });
      const finishLocator = learn.getByTestId("finishLesson");
      await finishLocator.scrollIntoViewIfNeeded();
      await expect(finishLocator).toBeInViewport({ ratio: 1 });
      await finishLocator.click();
      lessons.push(lessonName);
    }
 
    // Verify learned lessons appear in profile page
    const headerComponent = new HeaderComponent(learn);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(learn);
    await profilePage.verifyLearnedLessonsMatch(lessons);
  });
});