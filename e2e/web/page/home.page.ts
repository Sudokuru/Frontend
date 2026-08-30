import { Locator, Page, expect } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";

export class HomePage {
  readonly page: Page;
  readonly dashboard: Locator;
  readonly customizeMode: Locator;
  readonly heroAction: Locator;
  readonly resumeClassic: Locator;
  readonly resumeDrill: Locator;
  readonly difficultySelector: Locator;
  readonly startLessons: Locator;
  readonly startDrills: Locator;
  readonly playSudoku: Locator;
  readonly customize: Locator;
  readonly customizeDone: Locator;
  readonly resetShortcuts: Locator;
  readonly addShortcut: Locator;
  readonly shortcutSearch: Locator;
  readonly closeShortcutLibrary: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboard = page.getByTestId("HomeDashboard");
    this.customizeMode = page.getByTestId("HomeCustomizeMode");
    this.heroAction = page.getByTestId("HomeHeroActionButton");
    this.resumeClassic = page.getByTestId("HomeResumeClassicButton");
    this.resumeDrill = page.getByTestId("HomeResumeDrillButton");
    this.difficultySelector = page.getByTestId("HomeDifficultySelector");
    this.startLessons = page.getByTestId("HomeLearnButton");
    this.startDrills = page.getByTestId("HomeDrillButton");
    this.playSudoku = page.getByTestId("HomePlayButton");
    this.customize = page.getByTestId("HomeCustomizeButton");
    this.customizeDone = page.getByTestId("HomeCustomizeDoneButton");
    this.resetShortcuts = page.getByTestId("HomeResetShortcutsButton");
    this.addShortcut = page.getByTestId("HomeAddShortcutButton");
    this.shortcutSearch = page.getByTestId("HomeShortcutSearchInput");
    this.closeShortcutLibrary = page.getByTestId("CloseHomeShortcutLibrary");
  }

  async homePageIsRendered() {
    await expect(this.dashboard).toBeInViewport({ ratio: 1 });
    await expect(this.startLessons).toBeInViewport({ ratio: 1 });
    // await expect(this.startDrills).toBeInViewport({ ratio: 1 });
    await expect(this.playSudoku).toBeInViewport({ ratio: 1 });
  }

  async headerRendersCorrectly() {
    const headerComponent = new HeaderComponent(this.page);
    await expect(headerComponent.drawer).toBeInViewport({ ratio: 1 });
    await expect(headerComponent.home).not.toBeInViewport({ ratio: 1 });
    await expect(headerComponent.profile).toBeInViewport({ ratio: 1 });
    await expect(headerComponent.statistics).toBeInViewport({ ratio: 1 });
  }

  difficulty(value: string) {
    return this.page.getByTestId(`HomeDifficulty-${value}`);
  }

  editingShortcut(shortcutTestId: string) {
    return this.page.getByTestId(`Editing${shortcutTestId}`);
  }

  removeShortcut(shortcutTestId: string) {
    return this.page.getByTestId(`Remove${shortcutTestId}`);
  }

  libraryShortcut(shortcutTestId: string) {
    return this.page.getByTestId(`Add${shortcutTestId}`);
  }

  shortcutSurface(shortcutTestId: string) {
    return this.page.getByTestId(`${shortcutTestId}Surface`);
  }

  async dragShortcut(sourceTestId: string, targetTestId: string) {
    const source = await this.editingShortcut(sourceTestId).boundingBox();
    const target = await this.editingShortcut(targetTestId).boundingBox();

    if (!source || !target) throw new Error("Shortcut cards are not rendered");

    await this.page.mouse.move(
      source.x + source.width / 2,
      source.y + source.height / 2,
    );
    await this.page.mouse.down();
    await this.page.mouse.move(
      target.x + target.width / 2,
      target.y + target.height / 2,
      { steps: 12 },
    );
    await this.page.mouse.up();
  }

  async shortcutOrder(shortcutTestIds: string[]) {
    const selector = shortcutTestIds
      .map((testId) => `[data-testid="${testId}"]`)
      .join(", ");
    return this.page
      .locator(selector)
      .evaluateAll((shortcuts) =>
        shortcuts.map((shortcut) => shortcut.getAttribute("data-testid")),
      );
  }
}
