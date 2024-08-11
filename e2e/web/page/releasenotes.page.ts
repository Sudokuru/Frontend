import { Locator, Page, expect } from "@playwright/test";
import { ReleaseNoteInterface } from "../../../app/Components/ReleaseNotes/ReleaseNote";

export class ReleaseNotesPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("ReleaseNotesTitle");
  }

  async releaseNotesPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async firstReleaseNoteIsRendered(version: string) {
    await expect(this.page.getByText(version)).toBeInViewport({ ratio: 1 });
  }

  /**
   * We load in 9 elements at a time until we have loaded in the release not we want to interact with
   * @param notes All of the release notes in json format
   * @param version The version of the release note we want to load in
   */
  async loadNecessaryReleaseNotes(
    notes: ReleaseNoteInterface[],
    version: string
  ) {
    let index = 0;
    const LOADED_RELEASE_NOTES = 9;
    for (const [key, note] of notes.entries()) {
      if (note.version === version) {
        index = key;
      }
    }
    const numberOfLoads = Math.ceil(index / LOADED_RELEASE_NOTES);

    for (let i = 0; i < numberOfLoads; i++) {
      const loaderLocator = this.page.getByTestId(
        notes[LOADED_RELEASE_NOTES + LOADED_RELEASE_NOTES * i].version
      );
      await loaderLocator.scrollIntoViewIfNeeded();
    }
  }

  /**
   * Determines if the provided text for the release note is present
   * @param notes All of the release notes in json format
   * @param version The version of the release note we want to load in
   * @param text The text we want to verify is present in the release note
   */
  async isReleaseNoteTextPresent(version: string, text: string) {
    const releaseNoteText: Locator = this.page
      .getByTestId(version)
      .getByText(text, { exact: true });
    await releaseNoteText.scrollIntoViewIfNeeded();
    await expect(releaseNoteText).toBeInViewport({ ratio: 1 });
  }

  /**
   * Determines if the provided text for the release note is present with expected number
   * @param notes All of the release notes in json format
   * @param version The version of the release note we want to load in
   * @param text The text we want to verify is present in the release note with expected number
   */
  async isReleaseNoteTextPresentWithCount(
    version: string,
    text: string,
    count: number
  ) {
    const releaseNoteText: Locator = this.page
      .getByTestId(version)
      .getByText(text, { exact: true });
    await expect(releaseNoteText).toHaveCount(count);
  }
}
