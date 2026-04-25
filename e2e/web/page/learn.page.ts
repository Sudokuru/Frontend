import { Locator, Page, expect } from "@playwright/test";
import { MOBILE_WIDTH_LESS_THAN } from "../playwright.config";

export class LearnPage {
  readonly page: Page;
  readonly title: Locator;
  readonly checkCircleIcon: Locator;
  readonly lockIcon: Locator;
  readonly playCircleIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Learn Sudoku");
    this.checkCircleIcon = page.locator('[data-icon="check-circle"]');
    this.lockIcon = page.locator('[data-icon="lock"]');
    this.playCircleIcon = page.locator('[data-icon="play-circle"]');
  }

  async learnPageIsRendered() {
    await this.title.scrollIntoViewIfNeeded();
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async verifyLessonState(
    lesson: number,
    state: "learned" | "locked" | "lesson",
  ) {
    const testId = state + lesson;
    const lessonLocator = this.page.getByTestId(testId);
    await lessonLocator.scrollIntoViewIfNeeded();
    await expect(lessonLocator).toBeInViewport({ ratio: 1 });
  }

  async verifyLessonDifficultyText(
    lesson: number,
    lessonType: string,
    text: string,
  ) {
    const lessonLocator = this.page.getByTestId(lessonType + lesson);

    // Get viewport size to determine if difficulty text should be visible
    const viewportSize = await this.page.viewportSize();
    const estimatedHidesDifficulty =
      viewportSize && viewportSize.width < MOBILE_WIDTH_LESS_THAN;

    // Difficulty subtitles are only visible when not in mobile view
    // This check verifies the responsive behavior of ListPanel
    if (!estimatedHidesDifficulty) {
      const lessonDifficultyLocator = lessonLocator.getByTestId("difficulty");
      await lessonDifficultyLocator.scrollIntoViewIfNeeded();
      await expect(lessonDifficultyLocator).toHaveText(text);
      await expect(lessonDifficultyLocator).toBeInViewport({ ratio: 1 });
    }
  }

  async getAndClickLesson(lesson: number, lessonType: string) {
    const lessonLocator = this.page.getByTestId(lessonType + lesson);
    const lessonName =
      (await lessonLocator.getByTestId("lessonName")?.innerText()) ?? "Error";
    await lessonLocator.click();
    return lessonName;
  }
}
