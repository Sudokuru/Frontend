import { Locator, Page, expect } from "@playwright/test";
import { ReleaseNoteInterface } from "../../../sudokuru/app/Components/ReleaseNotes/ReleaseNote";
import { HeaderComponent } from "../components/header.component";

export class ReleaseNotesPage {
  readonly page: Page;
  readonly title: Locator;
  readonly search: Locator;
  readonly searchClear: Locator;
  readonly resultCount: Locator;
  readonly clearFilters: Locator;
  readonly targetsFilter: Locator;
  readonly targetsMenu: Locator;
  readonly targetsMenuClose: Locator;
  readonly categoriesFilter: Locator;
  readonly categoriesMenu: Locator;
  readonly categoriesMenuClose: Locator;
  readonly contributorsFilter: Locator;
  readonly contributorsMenu: Locator;
  readonly contributorsMenuClose: Locator;
  readonly startDateFilter: Locator;
  readonly startDateMenu: Locator;
  readonly startDateMenuClose: Locator;
  readonly startYear: Locator;
  readonly startMonth: Locator;
  readonly endDateFilter: Locator;
  readonly endDateMenu: Locator;
  readonly endDateMenuClose: Locator;
  readonly endYear: Locator;
  readonly endMonth: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("ReleaseNotesTitle");
    this.search = page.getByPlaceholder("Search release notes…");
    this.searchClear = page.getByTestId("ReleaseNotesSearchClearButton");
    this.resultCount = page.getByTestId("ReleaseNotesResultCount");
    this.clearFilters = page.getByTestId("ReleaseNotesClearFiltersButton");
    this.targetsFilter = page.getByTestId("ReleaseNotesTargetsFilterButton");
    this.targetsMenu = page.getByTestId("ReleaseNotesTargetsFilterMenu");
    this.targetsMenuClose = page.getByTestId(
      "ReleaseNotesTargetsFilterCloseButton",
    );
    this.categoriesFilter = page.getByTestId(
      "ReleaseNotesCategoriesFilterButton",
    );
    this.categoriesMenu = page.getByTestId("ReleaseNotesCategoriesFilterMenu");
    this.categoriesMenuClose = page.getByTestId(
      "ReleaseNotesCategoriesFilterCloseButton",
    );
    this.contributorsFilter = page.getByTestId(
      "ReleaseNotesContributorsFilterButton",
    );
    this.contributorsMenu = page.getByTestId(
      "ReleaseNotesContributorsFilterMenu",
    );
    this.contributorsMenuClose = page.getByTestId(
      "ReleaseNotesContributorsFilterCloseButton",
    );
    this.startDateFilter = page.getByTestId(
      "ReleaseNotesStartDateFilterButton",
    );
    this.startDateMenu = page.getByTestId("ReleaseNotesStartDateFilterMenu");
    this.startDateMenuClose = page.getByTestId(
      "ReleaseNotesStartDateFilterCloseButton",
    );
    this.startYear = page.getByTestId("ReleaseNotesStartYearButton");
    this.startMonth = page.getByTestId("ReleaseNotesStartMonthButton");
    this.endDateFilter = page.getByTestId("ReleaseNotesEndDateFilterButton");
    this.endDateMenu = page.getByTestId("ReleaseNotesEndDateFilterMenu");
    this.endDateMenuClose = page.getByTestId(
      "ReleaseNotesEndDateFilterCloseButton",
    );
    this.endYear = page.getByTestId("ReleaseNotesEndYearButton");
    this.endMonth = page.getByTestId("ReleaseNotesEndMonthButton");
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
    return new Date(date.replace(/(\d+)(st|nd|rd|th)/, "$1"));
  }

  async openMenu(button: Locator, menu: Locator) {
    await button.click();
    await this.menuIsOpen(menu);
  }

  async closeMenu(closeButton: Locator, menu: Locator) {
    await closeButton.click();
    await this.menuIsClosed(menu);
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
    await this.openMenu(this.startDateFilter, this.startDateMenu);
    await this.startYear.click();
    const yearOption = this.startYearOption(year);
    await expect(yearOption).toBeInViewport({ ratio: 1 });
    await yearOption.click();
    await this.startMonth.click();
    const monthOption = this.startMonthOption(month);
    await expect(monthOption).toBeInViewport({ ratio: 1 });
    await monthOption.click();
    await this.menuIsClosed(this.startDateMenu);
  }

  async selectEndDate(year: number, month: string) {
    await this.openMenu(this.endDateFilter, this.endDateMenu);
    await this.endYear.click();
    const yearOption = this.endYearOption(year);
    await expect(yearOption).toBeInViewport({ ratio: 1 });
    await yearOption.click();
    await this.endMonth.click();
    const monthOption = this.endMonthOption(month);
    await expect(monthOption).toBeInViewport({ ratio: 1 });
    await monthOption.click();
    await this.menuIsClosed(this.endDateMenu);
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

  async menuIsOpen(menu: Locator) {
    await expect(menu).toBeInViewport({ ratio: 1 });
  }

  async menuIsClosed(menu: Locator) {
    await expect(menu).not.toBeInViewport({ ratio: 1 });
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
    const LOADED_RELEASE_NOTES = 9;
    for (const [key, note] of notes.entries()) {
      if (note.version === version) {
        index = key;
      }
    }
    const numberOfLoads = Math.ceil(index / LOADED_RELEASE_NOTES);

    for (let i = 0; i < numberOfLoads; i++) {
      const loaderLocator = this.page.getByTestId(
        notes[LOADED_RELEASE_NOTES + LOADED_RELEASE_NOTES * i].version,
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
