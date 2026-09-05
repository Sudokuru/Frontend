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
  test("filter menus open and close", async ({ page }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();
    const menus = [
      {
        button: releaseNotesPage.targetsFilter,
        menu: releaseNotesPage.targetsMenu,
        close: releaseNotesPage.targetsMenuClose,
      },
      {
        button: releaseNotesPage.categoriesFilter,
        menu: releaseNotesPage.categoriesMenu,
        close: releaseNotesPage.categoriesMenuClose,
      },
      {
        button: releaseNotesPage.contributorsFilter,
        menu: releaseNotesPage.contributorsMenu,
        close: releaseNotesPage.contributorsMenuClose,
      },
      {
        button: releaseNotesPage.startDateFilter,
        menu: releaseNotesPage.startDateMenu,
        close: releaseNotesPage.startDateMenuClose,
      },
      {
        button: releaseNotesPage.endDateFilter,
        menu: releaseNotesPage.endDateMenu,
        close: releaseNotesPage.endDateMenuClose,
      },
    ];

    for (const menu of menus) {
      await releaseNotesPage.openMenu(menu.button, menu.menu);
      await releaseNotesPage.closeMenu(menu.close, menu.menu);
    }

    await releaseNotesPage.resultCountIs(releaseNotes.length);
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

    await releaseNotesPage.openMenu(
      releaseNotesPage.targetsFilter,
      releaseNotesPage.targetsMenu,
    );
    await releaseNotesPage.toggleTarget(target);
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.targetsFilter,
      "Targets (1)",
    );
    await releaseNotesPage.resultCountIs(targetMatches.length);
    await releaseNotesPage.toggleTarget(target);
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.targetsFilter,
      "Targets",
    );
    await releaseNotesPage.resultCountIs(releaseNotes.length);
    await releaseNotesPage.toggleTarget(target);
    await releaseNotesPage.closeMenu(
      releaseNotesPage.targetsMenuClose,
      releaseNotesPage.targetsMenu,
    );

    await releaseNotesPage.openMenu(
      releaseNotesPage.categoriesFilter,
      releaseNotesPage.categoriesMenu,
    );
    await releaseNotesPage.toggleCategory(category);
    await releaseNotesPage.filterButtonLabelIs(
      releaseNotesPage.categoriesFilter,
      "Categories (1)",
    );
    await releaseNotesPage.resultCountIs(targetAndCategoryMatches.length);
    await releaseNotesPage.toggleCategory(category);
    await releaseNotesPage.resultCountIs(targetMatches.length);
    await releaseNotesPage.toggleCategory(category);
    await releaseNotesPage.closeMenu(
      releaseNotesPage.categoriesMenuClose,
      releaseNotesPage.categoriesMenu,
    );

    await releaseNotesPage.openMenu(
      releaseNotesPage.contributorsFilter,
      releaseNotesPage.contributorsMenu,
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
    await releaseNotesPage.closeMenu(
      releaseNotesPage.contributorsMenuClose,
      releaseNotesPage.contributorsMenu,
    );

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

  test("clear button resets all active filters", async ({ page }) => {
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.navigateToPage();

    await expect(releaseNotesPage.searchClear).toHaveCount(0);
    await releaseNotesPage.searchFor("Sudoku");
    await releaseNotesPage.clearSearch();
    await releaseNotesPage.searchFor("Sudoku");
    await releaseNotesPage.openMenu(
      releaseNotesPage.targetsFilter,
      releaseNotesPage.targetsMenu,
    );
    await releaseNotesPage.toggleTarget("web");
    await releaseNotesPage.closeMenu(
      releaseNotesPage.targetsMenuClose,
      releaseNotesPage.targetsMenu,
    );
    await releaseNotesPage.openMenu(
      releaseNotesPage.categoriesFilter,
      releaseNotesPage.categoriesMenu,
    );
    await releaseNotesPage.toggleCategory("bug fixes");
    await releaseNotesPage.closeMenu(
      releaseNotesPage.categoriesMenuClose,
      releaseNotesPage.categoriesMenu,
    );
    await releaseNotesPage.openMenu(
      releaseNotesPage.contributorsFilter,
      releaseNotesPage.contributorsMenu,
    );
    await releaseNotesPage.toggleContributor("Thomas-Gallant");
    await releaseNotesPage.closeMenu(
      releaseNotesPage.contributorsMenuClose,
      releaseNotesPage.contributorsMenu,
    );
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
