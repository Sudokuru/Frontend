import {
  INITIAL_RELEASE_NOTES_COUNT,
  ReleaseNotesPage,
} from "./../page/releasenotes.page";
import { test } from "../fixture";
import { expect } from "@playwright/test";
import json from "../../../sudokuru/Changelog.json";
import { ReleaseNoteInterface } from "../../../sudokuru/app/Components/ReleaseNotes/ReleaseNote";
import { PENDING_CHANGELOG_DATE } from "../../../sudokuru/app/Components/ReleaseNotes/ReleaseNoteFunctions";
const releaseNotes: ReleaseNoteInterface[] = json;
const initiallyRenderedReleaseNotes = releaseNotes.slice(
  0,
  INITIAL_RELEASE_NOTES_COUNT,
);

test.describe("release notes", () => {
  test("first release note renders", async ({ page }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();
    await releaseNotesPage.firstReleaseNoteIsRendered(releaseNotes[0].version);
  });

  test("feature list renders feature content", async ({ page }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();
    await releaseNotesPage.loadNecessaryReleaseNotes(releaseNotes, "1.16.1");
    await releaseNotesPage.isReleaseNoteTextPresent("1.16.1", "Features:");
    await releaseNotesPage.isReleaseNoteTextPresent(
      "1.16.1",
      "•A placeholder 'Contact Us' page is added.",
    );
    await releaseNotesPage.isReleaseNoteTextPresentWithCount(
      "1.16.1",
      "•None",
      2,
    );
  });

  test("feature list renders bug content", async ({ page }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();
    await releaseNotesPage.loadNecessaryReleaseNotes(releaseNotes, "1.19.2");
    await releaseNotesPage.isReleaseNoteTextPresent("1.19.2", "Bug Fixes:");
    await releaseNotesPage.isReleaseNoteTextPresent(
      "1.19.2",
      "•Sudoku board hotkeys now work when board is not selected. However, the board needs to have been selected at least once.",
    );
    await releaseNotesPage.isReleaseNoteTextPresentWithCount(
      "1.19.2",
      "•None",
      2,
    );
  });
});

test.describe("release note filters", () => {
  test("filter sections expand and collapse", async ({ page }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();
    const sections = [
      {
        button: releaseNotesPage.targetsFilter,
        section: releaseNotesPage.targetsSection,
        close: releaseNotesPage.targetsSectionClose,
      },
      {
        button: releaseNotesPage.categoriesFilter,
        section: releaseNotesPage.categoriesSection,
        close: releaseNotesPage.categoriesSectionClose,
      },
      {
        button: releaseNotesPage.contributorsFilter,
        section: releaseNotesPage.contributorsSection,
        close: releaseNotesPage.contributorsSectionClose,
      },
      {
        button: releaseNotesPage.startDateFilter,
        section: releaseNotesPage.startDateSection,
        close: releaseNotesPage.startDateSectionClose,
      },
      {
        button: releaseNotesPage.endDateFilter,
        section: releaseNotesPage.endDateSection,
        close: releaseNotesPage.endDateSectionClose,
      },
    ];

    for (const section of sections) {
      await releaseNotesPage.expandSection(section.button, section.section);
      await expect(section.button).toHaveAccessibleName(/expanded$/);
      await expect(section.close).toHaveAccessibleName(/^Close .+ filter$/);
      await section.close.press("Enter");
      await releaseNotesPage.sectionIsCollapsed(section.section);
      await expect(section.button).toBeFocused();
      await expect(section.button).toHaveAccessibleName(/collapsed$/);
    }

    await releaseNotesPage.resultCountIs(releaseNotes.length);
  });

  test("expanding a filter section collapses the other sections", async ({
    page,
  }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();

    await releaseNotesPage.expandSection(
      releaseNotesPage.targetsFilter,
      releaseNotesPage.targetsSection,
    );

    await releaseNotesPage.expandSection(
      releaseNotesPage.categoriesFilter,
      releaseNotesPage.categoriesSection,
    );
    await releaseNotesPage.sectionIsCollapsed(releaseNotesPage.targetsSection);

    await releaseNotesPage.categoriesFilter.click();
    await releaseNotesPage.sectionIsCollapsed(
      releaseNotesPage.categoriesSection,
    );
  });

  test("keyword search only renders matching releases", async ({ page }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();

    await releaseNotesPage.searchFor(
      "Sudoku board hotkeys now work when board is not selected. However, the board needs to have been selected at least once.",
    );

    await releaseNotesPage.resultCountIs(1);
    await releaseNotesPage.firstReleaseNoteIsRendered("1.19.2");
    await releaseNotesPage.releaseNoteIsNotRendered(releaseNotes[0].version);
  });

  test("keyword search renders no releases when none match", async ({
    page,
  }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();

    await releaseNotesPage.searchFor(
      "This phrase should not match any Sudokuru release note",
    );

    await releaseNotesPage.resultCountIs(0);
    await releaseNotesPage.releaseNoteIsNotRendered(releaseNotes[0].version);
  });

  test("target, category, and contributor options filter releases", async ({
    page,
  }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();
    const target = "desktop";
    const category = "features";
    const contributor = "Thomas-Gallant";
    const targetMatches = releaseNotes.filter((note) =>
      note.targets.includes(target),
    );
    const targetAndCategoryMatches = targetMatches.filter(
      (note) => (note.features?.length ?? 0) > 0,
    );
    const allFilterMatches = targetAndCategoryMatches.filter((note) =>
      note.contributors.includes(contributor),
    );

    await releaseNotesPage.expandSection(
      releaseNotesPage.targetsFilter,
      releaseNotesPage.targetsSection,
    );
    await releaseNotesPage.toggleTarget(target);
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.targetsFilter,
      "Targets (1)",
    );
    await releaseNotesPage.resultCountIs(targetMatches.length);
    // Selecting an option keeps the section open for further selections.
    await releaseNotesPage.sectionIsExpanded(releaseNotesPage.targetsSection);
    await releaseNotesPage.toggleTarget(target);
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.targetsFilter,
      "Targets",
    );
    await releaseNotesPage.resultCountIs(releaseNotes.length);
    await releaseNotesPage.toggleTarget(target);

    await releaseNotesPage.expandSection(
      releaseNotesPage.categoriesFilter,
      releaseNotesPage.categoriesSection,
    );
    await releaseNotesPage.sectionIsCollapsed(releaseNotesPage.targetsSection);
    await releaseNotesPage.toggleCategory(category);
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.categoriesFilter,
      "Categories (1)",
    );
    await releaseNotesPage.resultCountIs(targetAndCategoryMatches.length);
    await releaseNotesPage.toggleCategory(category);
    await releaseNotesPage.resultCountIs(targetMatches.length);
    await releaseNotesPage.toggleCategory(category);

    await releaseNotesPage.expandSection(
      releaseNotesPage.contributorsFilter,
      releaseNotesPage.contributorsSection,
    );
    await releaseNotesPage.sectionIsCollapsed(
      releaseNotesPage.categoriesSection,
    );
    await releaseNotesPage.toggleContributor(contributor);
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.contributorsFilter,
      "Contributors (1)",
    );
    await releaseNotesPage.resultCountIs(allFilterMatches.length);
    await releaseNotesPage.toggleContributor(contributor);
    await releaseNotesPage.resultCountIs(targetAndCategoryMatches.length);
    await releaseNotesPage.toggleContributor(contributor);

    await releaseNotesPage.firstReleaseNoteIsRendered(
      allFilterMatches[0].version,
    );
    const nonMatchingRelease = initiallyRenderedReleaseNotes.find(
      (note) => !allFilterMatches.includes(note),
    );
    expect(nonMatchingRelease).toBeDefined();
    if (nonMatchingRelease) {
      await releaseNotesPage.releaseNoteIsNotRendered(
        nonMatchingRelease.version,
      );
    }
  });

  test("start and end date buttons filter an inclusive date range", async ({
    page,
  }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();
    const startYear = 2025;
    const startMonth = "March";
    const endYear = 2026;
    const endMonth = "March";
    const startDate = new Date(startYear, 2, 1);
    const endDate = new Date(endYear, 3, 0, 23, 59, 59, 999);
    const expectedReleases = releaseNotes.filter((note) => {
      if (note.date === PENDING_CHANGELOG_DATE) return false;
      const releaseDate = releaseNotesPage.parseChangelogDate(note.date);
      return releaseDate >= startDate && releaseDate <= endDate;
    });

    await releaseNotesPage.selectStartDate(startYear, startMonth);
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.startDateFilter,
      `Start Date: ${startMonth} ${startYear}`,
    );

    await releaseNotesPage.selectEndDate(endYear, endMonth);
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.endDateFilter,
      `End Date: ${endMonth} ${endYear}`,
    );

    await releaseNotesPage.resultCountIs(expectedReleases.length);
    await releaseNotesPage.firstReleaseNoteIsRendered(
      expectedReleases[0].version,
    );
    const outOfRangeRelease = initiallyRenderedReleaseNotes.find((note) => {
      if (note.date === PENDING_CHANGELOG_DATE) return false;
      const releaseDate = releaseNotesPage.parseChangelogDate(note.date);
      return releaseDate < startDate || releaseDate > endDate;
    });
    expect(outOfRangeRelease).toBeDefined();
    if (outOfRangeRelease) {
      await releaseNotesPage.releaseNoteIsNotRendered(
        outOfRangeRelease.version,
      );
    }
  });

  test("end date options do not precede the selected start date", async ({
    page,
  }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();
    await releaseNotesPage.selectStartDate(2025, "March");
    await releaseNotesPage.expandSection(
      releaseNotesPage.endDateFilter,
      releaseNotesPage.endDateSection,
    );
    await releaseNotesPage.endYearOption(2025).click();

    const earlierMonth = releaseNotesPage.endMonthOption("February");
    const equalMonth = releaseNotesPage.endMonthOption("March");
    await expect(earlierMonth).toBeInViewport({ ratio: 1 });
    await expect(earlierMonth).toBeDisabled();
    await expect(equalMonth).toBeInViewport({ ratio: 1 });
    await expect(equalMonth).toBeEnabled();
  });

  test("start date options do not follow the selected end date", async ({
    page,
  }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();
    await releaseNotesPage.selectEndDate(2026, "March");
    await releaseNotesPage.expandSection(
      releaseNotesPage.startDateFilter,
      releaseNotesPage.startDateSection,
    );
    await releaseNotesPage.startYearOption(2026).click();

    const laterMonth = releaseNotesPage.startMonthOption("May");
    const equalMonth = releaseNotesPage.startMonthOption("March");
    await expect(laterMonth).toBeInViewport({ ratio: 1 });
    await expect(laterMonth).toBeDisabled();
    await expect(equalMonth).toBeInViewport({ ratio: 1 });
    await expect(equalMonth).toBeEnabled();
  });

  for (const boundary of ["start", "end"] as const) {
    test(`changing only the ${boundary} year applies the retained month`, async ({
      page,
    }) => {
      const releaseNotesPage = new ReleaseNotesPage(page);
      await releaseNotesPage.navigateToPage();

      const controls = {
        start: {
          filter: releaseNotesPage.startDateFilter,
          section: releaseNotesPage.startDateSection,
          yearOption: releaseNotesPage.startYearOption(2026),
          selectDate: () => releaseNotesPage.selectStartDate(2025, "March"),
          label: "Start Date: March 2026",
        },
        end: {
          filter: releaseNotesPage.endDateFilter,
          section: releaseNotesPage.endDateSection,
          yearOption: releaseNotesPage.endYearOption(2026),
          selectDate: () => releaseNotesPage.selectEndDate(2025, "March"),
          label: "End Date: March 2026",
        },
      }[boundary];

      await controls.selectDate();
      await releaseNotesPage.expandSection(controls.filter, controls.section);
      // Exercise keyboard activation, not just pointer activation.
      await controls.yearOption.focus();
      await controls.yearOption.press("Enter");

      await releaseNotesPage.filterButtonLabelIs(
        controls.filter,
        controls.label,
      );
      // A year-only change keeps the section open for further adjustments.
      await releaseNotesPage.sectionIsExpanded(controls.section);
      await expect(controls.yearOption).toBeFocused();
    });
  }

  for (const boundary of ["start", "end"] as const) {
    test(`${boundary} month selection persists when the section is re-expanded`, async ({
      page,
    }) => {
      const releaseNotesPage = new ReleaseNotesPage(page);
      await releaseNotesPage.navigateToPage();

      const controls = {
        start: {
          filter: releaseNotesPage.startDateFilter,
          section: releaseNotesPage.startDateSection,
          close: releaseNotesPage.startDateSectionClose,
          monthOption: releaseNotesPage.startMonthOption("April"),
          committedYearMonth: releaseNotesPage.startMonthOption("January"),
          otherYearMonth: releaseNotesPage.startMonthOption("May"),
          selectDate: () => releaseNotesPage.selectStartDate(2025, "March"),
          label: "Start Date: April 2025",
        },
        end: {
          filter: releaseNotesPage.endDateFilter,
          section: releaseNotesPage.endDateSection,
          close: releaseNotesPage.endDateSectionClose,
          monthOption: releaseNotesPage.endMonthOption("April"),
          committedYearMonth: releaseNotesPage.endMonthOption("January"),
          otherYearMonth: releaseNotesPage.endMonthOption("May"),
          selectDate: () => releaseNotesPage.selectEndDate(2025, "March"),
          label: "End Date: April 2025",
        },
      }[boundary];

      await controls.selectDate();
      await releaseNotesPage.expandSection(controls.filter, controls.section);
      await controls.monthOption.focus();
      await controls.monthOption.press("Enter");

      await releaseNotesPage.filterButtonLabelIs(
        controls.filter,
        controls.label,
      );
      await releaseNotesPage.sectionIsCollapsed(controls.section);
      await expect(controls.filter).toBeFocused();
      await releaseNotesPage.expandSection(controls.filter, controls.section);
      // The re-expanded panel reflects the committed date: a month released
      // only in the committed year (January 2025) is offered, while a month
      // released only in another year (May 2026) is not.
      await expect(controls.committedYearMonth).toBeInViewport({ ratio: 1 });
      await expect(controls.otherYearMonth).toHaveCount(0);
      await releaseNotesPage.collapseSection(controls.close, controls.section);
      await releaseNotesPage.filterButtonLabelIs(
        controls.filter,
        controls.label,
      );
    });
  }

  test("clear button resets all active filters", async ({ page }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();

    await expect(releaseNotesPage.searchClear).toHaveCount(0);
    await releaseNotesPage.searchFor("Sudoku");
    await releaseNotesPage.clearSearch();
    await releaseNotesPage.searchFor("Sudoku");
    await releaseNotesPage.expandSection(
      releaseNotesPage.targetsFilter,
      releaseNotesPage.targetsSection,
    );
    await releaseNotesPage.toggleTarget("web");
    await releaseNotesPage.expandSection(
      releaseNotesPage.categoriesFilter,
      releaseNotesPage.categoriesSection,
    );
    await releaseNotesPage.toggleCategory("bug fixes");
    await releaseNotesPage.expandSection(
      releaseNotesPage.contributorsFilter,
      releaseNotesPage.contributorsSection,
    );
    await releaseNotesPage.toggleContributor("Thomas-Gallant");
    await releaseNotesPage.selectStartDate(2025, "March");

    await releaseNotesPage.clearFilters.click();

    await expect(releaseNotesPage.search).toHaveValue("");
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.targetsFilter,
      "Targets",
    );
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.categoriesFilter,
      "Categories",
    );
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.contributorsFilter,
      "Contributors",
    );
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.startDateFilter,
      "Start Date",
    );
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.endDateFilter,
      "End Date",
    );
    await releaseNotesPage.resultCountIs(releaseNotes.length);
    await expect(releaseNotesPage.clearFilters).toHaveCount(0);
  });
});
