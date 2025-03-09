import { ReleaseNotesPage } from "./../page/releasenotes.page";
import { test } from "../fixture";
import { HeaderComponent } from "../components/header.component";
import json from "../../../sudokuru/Changelog.json";
import { ReleaseNoteInterface } from "../../../sudokuru/app/Components/ReleaseNotes/ReleaseNote";
const releaseNotes: ReleaseNoteInterface[] = json;

test.describe("release notes", () => {
  test("first release note renders", async ({ page }) => {
    const headerComponent = new HeaderComponent(page);
    await headerComponent.drawer.click();
    await headerComponent.releaseNotes.click();
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.releaseNotesPageIsRendered();
    await releaseNotesPage.firstReleaseNoteIsRendered(releaseNotes[0].version);
  });

  test("feature list renders feature content", async ({ page }) => {
    const headerComponent = new HeaderComponent(page);
    await headerComponent.drawer.click();
    await headerComponent.releaseNotes.click();
    const releaseNotesPage = new ReleaseNotesPage(page);
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
    const headerComponent = new HeaderComponent(page);
    await headerComponent.drawer.click();
    await headerComponent.releaseNotes.click();
    const releaseNotesPage = new ReleaseNotesPage(page);
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
