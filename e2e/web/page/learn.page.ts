import { Locator, Page, expect } from "@playwright/test";

export class LearnPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Learn new strategies");
  }

  async learnPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async verifyLessonLearned(lesson: number) {
    const lessonLocator = this.page.getByTestId("learned" + lesson);
    await lessonLocator.scrollIntoViewIfNeeded();
    await expect(lessonLocator).toBeInViewport({ ratio: 1 });
  }

  async verifyLessonLocked(lesson: number) {
    const lessonLocator = this.page.getByTestId("locked" + lesson);
    await lessonLocator.scrollIntoViewIfNeeded();
    await expect(lessonLocator).toBeInViewport({ ratio: 1 });
  }

  async verifyLessonNext(lesson: number) {
    const lessonLocator = this.page.getByTestId("lesson" + lesson);
    await lessonLocator.scrollIntoViewIfNeeded();
    await expect(lessonLocator).toBeInViewport({ ratio: 1 });
  }

  async verifyLessonDifficultyText(lesson: number, lessonType: string, text: string) {
    const lessonLocator = this.page.getByTestId(lessonType + lesson);
    const lessonTextLocator = lessonLocator.getByText(text);
    await lessonTextLocator.scrollIntoViewIfNeeded();
    await expect(lessonTextLocator).toBeInViewport({ ratio: 1 });
  }

  async getAndClickLesson(lesson: number, lessonType: string) {
    const lessonLocator = this.page.getByTestId(lessonType + lesson);
    const lessonName = (await lessonLocator.getByTestId("lessonName")?.textContent()) ?? 'Error';
    await lessonLocator.click();
    return lessonName;
  }
}
