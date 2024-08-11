import { test } from "../fixture";
import { HeaderComponent } from "../components/header.component";
import { ReleaseNotesPage } from "../page/releasenotes.page";
import json from "../../../Changelog.json";
import { ReleaseNoteInterface } from "../../../app/Components/ReleaseNotes/ReleaseNote";
const releaseNotes: ReleaseNoteInterface[] = json;

test.describe("release notes", () => {
  test("first release note renders", async ({ page }) => {
    const headerComponent = new HeaderComponent(page);
    await headerComponent.releaseNotes.click();
    const releaseNotesPage = new ReleaseNotesPage(page);
    await releaseNotesPage.releaseNotesPageIsRendered();
    await releaseNotesPage.firstReleaseNoteIsRendered(releaseNotes[0].version);
  });
});
