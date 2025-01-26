import { LearnPage } from "../page/learn.page";
import { test } from "../fixture";
import { expect } from "@playwright/test";
import { getStrategies } from "../../../sudokuru/app/Api/Lessons";
import { ProfilePage } from "../page/profile.page";
import { StatisticsPage } from "../page/statistics.page";
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

  test("should display correct difficulty text", async ({ learn }) => {
    const LESSON_DIFFICULTIES = [
      { state: "lesson", difficulty: "Very Easy" },
      { state: "locked", difficulty: "Very Easy" },
      { state: "locked", difficulty: "Very Easy" },
      { state: "locked", difficulty: "Very Easy" },
      { state: "locked", difficulty: "Easy" },
      { state: "locked", difficulty: "Intermediate" },
      { state: "locked", difficulty: "Hard" },
      { state: "locked", difficulty: "Very Hard" },
    ];
    const learnPage = new LearnPage(learn);

    for (const [
      index,
      { state, difficulty },
    ] of LESSON_DIFFICULTIES.entries()) {
      await learnPage.verifyLessonDifficultyText(index, state, difficulty);
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

    // Verify lessons now appear as learned in learn page
    for (let i: number = 0; i < getStrategies().length; i++) {
      await learnPage.verifyLessonLearned(i);
    }

    // Verify learned lessons appear in profile page
    const headerComponent = new HeaderComponent(learn);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(learn);
    await profilePage.verifyLearnedLessonsMatch(lessons);

    // Click delete statistics button then cancel on the popup and verify not deleted
    await headerComponent.statistics.click();
    const statsPage = new StatisticsPage(learn);
    await statsPage.clickDeleteStatsAndPopupButtons(false);
    await headerComponent.profile.click();
    await profilePage.verifyLearnedLessonsMatch(lessons);

    // Click delete statistics button then confirm on popup and verify deleted
    await headerComponent.statistics.click();
    await statsPage.clickDeleteStatsAndPopupButtons(true);
    await headerComponent.profile.click();
    await profilePage.verifyLearnedLessonsMatch(["None"]);
  });

  test("should click on locked lesson and able to cancel", async ({
    learn,
  }) => {
    const learnPage = new LearnPage(learn);
    await learnPage.getAndClickLesson(1, "locked");
    const cancel = learn.getByTestId("awesome-alert-cancel-btn");
    await cancel.scrollIntoViewIfNeeded();
    await expect(cancel).toBeInViewport({ ratio: 1 });
    await cancel.click();
    await learnPage.learnPageIsRendered();
  });

  test("should click on locked lesson and able to proceed", async ({
    learn,
  }) => {
    const learnPage = new LearnPage(learn);
    await learnPage.getAndClickLesson(1, "locked");
    const confirm = learn.getByTestId("awesome-alert-confirm-btn");
    await confirm.scrollIntoViewIfNeeded();
    await expect(confirm).toBeInViewport({ ratio: 1 });
    await confirm.click();
    const titleLocator = learn.getByText("Amend Notes Lesson");
    await expect(titleLocator).toBeInViewport({ ratio: 1 });
  });

  test("should learn same lesson twice and display only once in profile", async ({
    learn,
  }) => {
    const learnPage = new LearnPage(learn);
    let lessonType: string = "lesson";

    for (let i: number = 0; i < 2; i++) {
      await learnPage.getAndClickLesson(0, lessonType);
      const titleLocator = learn.getByText("Sudoku 101 Lesson");
      await expect(titleLocator).toBeInViewport({ ratio: 1 });
      const finishLocator = learn.getByTestId("finishLesson");
      await finishLocator.scrollIntoViewIfNeeded();
      await expect(finishLocator).toBeInViewport({ ratio: 1 });
      await finishLocator.click();
      lessonType = "learned";
    }

    const headerComponent = new HeaderComponent(learn);
    await headerComponent.profile.click();
    const profilePage = new ProfilePage(learn);
    await profilePage.verifyLearnedLessonsMatch(["Sudoku 101"]);
  });
});
