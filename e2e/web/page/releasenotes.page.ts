import { Locator, Page, expect } from "@playwright/test";
import { ReleaseNoteInterface } from "../../../sudokuru/app/Components/ReleaseNotes/ReleaseNote";
import { parseChangelogDate } from "../../../sudokuru/app/Components/ReleaseNotes/ReleaseNoteFunctions";
import { HeaderComponent } from "../components/header.component";

export const INITIAL_RELEASE_NOTES_COUNT = 9;

export class ReleaseNotesPage {
  readonly page: Page;
  readonly title: Locator;
  readonly search: Locator;
  readonly searchClear: Locator;
  readonly resultCount: Locator;
  readonly clearFilters: Locator;
  readonly targetsFilter: Locator;
  readonly targetsSection: Locator;
  readonly targetsSectionClose: Locator;
  readonly categoriesFilter: Locator;
  readonly categoriesSection: Locator;
  readonly categoriesSectionClose: Locator;
  readonly contributorsFilter: Locator;
  readonly contributorsSection: Locator;
  readonly contributorsSectionClose: Locator;
  readonly startDateFilter: Locator;
  readonly startDateSection: Locator;
  readonly startDateSectionClose: Locator;
  readonly endDateFilter: Locator;
  readonly endDateSection: Locator;
  readonly endDateSectionClose: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("ReleaseNotesTitle");
    this.search = page.getByPlaceholder("Search release notes…");
    this.searchClear = page.getByTestId("ReleaseNotesSearchClearButton");
    this.resultCount = page.getByTestId("ReleaseNotesResultCount");
    this.clearFilters = page.getByTestId("ReleaseNotesClearFiltersButton");
    this.targetsFilter = page.getByTestId("ReleaseNotesTargetsFilterButton");
    this.targetsSection = page.getByTestId("ReleaseNotesTargetsFilterSection");
    this.targetsSectionClose = page.getByTestId(
      "ReleaseNotesTargetsFilterCloseButton",
    );
    this.categoriesFilter = page.getByTestId(
      "ReleaseNotesCategoriesFilterButton",
    );
    this.categoriesSection = page.getByTestId(
      "ReleaseNotesCategoriesFilterSection",
    );
    this.categoriesSectionClose = page.getByTestId(
      "ReleaseNotesCategoriesFilterCloseButton",
    );
    this.contributorsFilter = page.getByTestId(
      "ReleaseNotesContributorsFilterButton",
    );
    this.contributorsSection = page.getByTestId(
      "ReleaseNotesContributorsFilterSection",
    );
    this.contributorsSectionClose = page.getByTestId(
      "ReleaseNotesContributorsFilterCloseButton",
    );
    this.startDateFilter = page.getByTestId(
      "ReleaseNotesStartDateFilterButton",
    );
    this.startDateSection = page.getByTestId(
      "ReleaseNotesStartDateFilterSection",
    );
    this.startDateSectionClose = page.getByTestId(
      "ReleaseNotesStartDateFilterCloseButton",
    );
    this.endDateFilter = page.getByTestId("ReleaseNotesEndDateFilterButton");
    this.endDateSection = page.getByTestId("ReleaseNotesEndDateFilterSection");
    this.endDateSectionClose = page.getByTestId(
      "ReleaseNotesEndDateFilterCloseButton",
    );
  }

  targetOption(target: string) {
    return this.page.getByTestId(`ReleaseNotesTargetOption-${target}`);
  }

  categoryOption(category: string) {
    return this.page.getByTestId(`ReleaseNotesCategoryOption-${category}`);
  }

  contributorOption(contributor: string) {
    return this.page.getByTestId(
      `ReleaseNotesContributorOption-${contributor}`,
    );
  }

  startYearOption(year: number) {
    return this.page.getByTestId(`ReleaseNotesStartYearOption-${year}`);
  }

  startMonthOption(month: string) {
    return this.page.getByTestId(`ReleaseNotesStartMonthOption-${month}`);
  }

  endYearOption(year: number) {
    return this.page.getByTestId(`ReleaseNotesEndYearOption-${year}`);
  }

  endMonthOption(month: string) {
    return this.page.getByTestId(`ReleaseNotesEndMonthOption-${month}`);
  }

  async navigateToPage() {
    const headerComponent = new HeaderComponent(this.page);
    await headerComponent.drawer.click();
    await headerComponent.releaseNotes.click();
    await this.releaseNotesPageIsRendered();
  }

  async searchFor(keyword: string) {
    await this.search.fill(keyword);
    await expect(this.searchClear).toBeInViewport({ ratio: 1 });
  }

  async clearSearch() {
    await this.searchClear.click();
    await expect(this.search).toHaveValue("");
    await expect(this.searchClear).toHaveCount(0);
  }

  parseChangelogDate(date: string) {
    return parseChangelogDate(date);
  }

  async expandSection(button: Locator, section: Locator) {
    await button.click();
    await this.sectionIsExpanded(section);
  }

  async collapseSection(closeButton: Locator, section: Locator) {
    await closeButton.click();
    await this.sectionIsCollapsed(section);
  }

  async toggleTarget(target: string) {
    const option = this.targetOption(target);
    await expect(option).toBeInViewport({ ratio: 1 });
    await option.click();
  }

  async toggleCategory(category: string) {
    const option = this.categoryOption(category);
    await expect(option).toBeInViewport({ ratio: 1 });
    await option.click();
  }

  async toggleContributor(contributor: string) {
    const option = this.contributorOption(contributor);
    await expect(option).toBeInViewport({ ratio: 1 });
    await option.click();
  }

  async selectStartDate(year: number, month: string) {
    await this.expandSection(this.startDateFilter, this.startDateSection);
    const yearOption = this.startYearOption(year);
    await expect(yearOption).toBeInViewport({ ratio: 1 });
    await yearOption.click();
    const monthOption = this.startMonthOption(month);
    await expect(monthOption).toBeInViewport({ ratio: 1 });
    await monthOption.click();
    await this.sectionIsCollapsed(this.startDateSection);
  }

  async selectEndDate(year: number, month: string) {
    await this.expandSection(this.endDateFilter, this.endDateSection);
    const yearOption = this.endYearOption(year);
    await expect(yearOption).toBeInViewport({ ratio: 1 });
    await yearOption.click();
    const monthOption = this.endMonthOption(month);
    await expect(monthOption).toBeInViewport({ ratio: 1 });
    await monthOption.click();
    await this.sectionIsCollapsed(this.endDateSection);
  }

  async releaseNotesPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async firstReleaseNoteIsRendered(version: string) {
    await expect(this.page.getByText(version)).toBeInViewport({ ratio: 1 });
  }

  async releaseNoteIsNotRendered(version: string) {
    await expect(this.page.getByTestId(version)).toHaveCount(0);
  }

  async resultCountIs(count: number) {
    await expect(this.resultCount).toHaveText(`${count} releases`);
  }

  async filterButtonLabelIs(button: Locator, label: string) {
    await expect(button).toHaveText(label);
  }

  async sectionIsExpanded(section: Locator) {
    await expect(section).toBeInViewport({ ratio: 1 });
  }

  async sectionIsCollapsed(section: Locator) {
    await expect(section).not.toBeInViewport({ ratio: 1 });
  }

  /**
   * We load in 9 elements at a time until we have loaded in the release not we want to interact with
   * @param notes All of the release notes in json format
   * @param version The version of the release note we want to load in
   */
  async loadNecessaryReleaseNotes(
    notes: ReleaseNoteInterface[],
    version: string,
  ) {
    let index = 0;
    for (const [key, note] of notes.entries()) {
      if (note.version === version) {
        index = key;
      }
    }
    const numberOfLoads = Math.ceil(index / INITIAL_RELEASE_NOTES_COUNT);

    for (let i = 0; i < numberOfLoads; i++) {
      const loaderLocator = this.page.getByTestId(
        notes[INITIAL_RELEASE_NOTES_COUNT + INITIAL_RELEASE_NOTES_COUNT * i]
          .version,
      );
      await loaderLocator.scrollIntoViewIfNeeded();
    }
  }

  /**
   * Determines if the provided text for the release note is present
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
   * Checks to see how many occurances of a string exist in the release note
   * @param version The version of the release note we want to load in
   * @param text The text we want to verify is present or not present
   * @param count The number of instances we expect the text to occur in the release note
   */
  async isReleaseNoteTextPresentWithCount(
    version: string,
    text: string,
    count: number,
  ) {
    const releaseNoteText: Locator = this.page
      .getByTestId(version)
      .getByText(text, { exact: true });
    await expect(releaseNoteText).toHaveCount(count);
  }
}
