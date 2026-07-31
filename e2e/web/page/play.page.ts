import { Locator, Page, expect } from "@playwright/test";
import { DEMO_DIFFICULTIES } from "../../../sudokuru/app/Components/SudokuBoard/Core/Functions/DifficultyFunctions";

const CARD_WIDTH = 300;
const CARD_HEIGHT = 600;
const CARD_PADDING = 20;
const CARD_HEIGHT_ASPECT_RATIO = 3 / 5;
const IMAGE_HIDE_SHRINKAGE_THRESHOLD = 0.3;
const COMPACT_CONTENT_SHRINKAGE_THRESHOLD = 0.6;
const MAX_HEIGHT_RATIO = 0.7;
const MAX_SHRINKAGE = 0.99;
const SHRINKAGE_ROUNDING_FACTOR = 100;
const STANDARD_DIFFICULTY_CARD_COUNT = 9;
const DIFFICULTY_CARD_COUNT =
  STANDARD_DIFFICULTY_CARD_COUNT + DEMO_DIFFICULTIES.length;

export class PlayPage {
  readonly page: Page;
  readonly title: Locator;
  readonly resume: Locator;
  readonly noviceDesc: Locator;
  readonly amateurDesc: Locator;
  readonly laymanDesc: Locator;
  readonly traineeDesc: Locator;
  readonly protegeDesc: Locator;
  readonly professionalDesc: Locator;
  readonly punditDesc: Locator;
  readonly masterDesc: Locator;
  readonly grandmasterDesc: Locator;
  readonly threePointStar: Locator;
  readonly fourPointStar: Locator;
  readonly fivePointStar: Locator;
  readonly ninePointStar: Locator;
  readonly twentyFourPointStar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText(/^Play Sudoku$/);
    this.resume = page.getByText("Resume Puzzle");
    this.noviceDesc = page.getByTestId("NoviceDescription");
    this.amateurDesc = page.getByTestId("AmateurDescription");
    this.laymanDesc = page.getByTestId("LaymanDescription");
    this.traineeDesc = page.getByTestId("TraineeDescription");
    this.protegeDesc = page.getByTestId("ProtegeDescription");
    this.professionalDesc = page.getByTestId("ProfessionalDescription");
    this.punditDesc = page.getByTestId("PunditDescription");
    this.masterDesc = page.getByTestId("MasterDescription");
    this.grandmasterDesc = page.getByTestId("GrandmasterDescription");
    this.threePointStar = page.getByAltText("3 Point Star");
    // Does substring match by default so 4 Point Star will match 24 Point Star
    // /^ marks the beginning of the string and $/ marks the end for exact match
    this.fourPointStar = page.getByAltText(/^4 Point Star$/);
    this.fivePointStar = page.getByAltText("5 Point Star");
    this.ninePointStar = page.getByAltText("9 Point Star");
    this.twentyFourPointStar = page.getByAltText("24 Point Star");
  }

  async playPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async resumeButtonIsVisible() {
    await expect(this.resume).toBeInViewport({ ratio: 1 });
  }

  async starsHaveCount(count: number) {
    // some stars appear multiple times if they appear
    await expect(this.threePointStar).toHaveCount(count * 2);
    await expect(this.fourPointStar).toHaveCount(count * 2);
    await expect(this.fivePointStar).toHaveCount(count);
    await expect(this.ninePointStar).toHaveCount(count * 2);
    await expect(this.twentyFourPointStar).toHaveCount(count * 2);
  }

  async starsAreVisible() {
    await this.starsHaveCount(1);
  }

  async starsAreHidden() {
    await this.starsHaveCount(0);
  }

  private calculateCardsPerRow(
    width: number,
    height: number,
    count: number,
  ): number {
    let columnCount: number = Math.floor(width / (CARD_WIDTH + 100));
    if (columnCount === 0) {
      return 1;
    }

    const maxRows: number = Math.floor((height * 0.8) / CARD_HEIGHT);
    const minColumns: number = Math.ceil(count / maxRows);

    while (
      columnCount > minColumns &&
      columnCount - 1 >= Math.ceil(count / (columnCount - 1))
    ) {
      columnCount--;
    }
    return columnCount;
  }

  private getDifficultyPanelShrinkage(
    viewport: { width: number; height: number } | null,
  ): number {
    if (!viewport) {
      return 0;
    }

    const cardHeight = CARD_WIDTH * CARD_HEIGHT_ASPECT_RATIO;
    const columnCount = this.calculateCardsPerRow(
      viewport.width,
      viewport.height,
      DIFFICULTY_CARD_COUNT,
    );
    const rowCount = Math.ceil(DIFFICULTY_CARD_COUNT / columnCount);
    const unshrunkHeight =
      rowCount * cardHeight +
      (rowCount > 0 ? (rowCount - 1) * CARD_PADDING : 0);
    const maxAllowedHeight = viewport.height * MAX_HEIGHT_RATIO;
    const rawShrinkage =
      unshrunkHeight > 0 ? 1 - maxAllowedHeight / unshrunkHeight : 0;

    return Math.min(
      MAX_SHRINKAGE,
      Math.max(
        0,
        Math.ceil(rawShrinkage * SHRINKAGE_ROUNDING_FACTOR) /
          SHRINKAGE_ROUNDING_FACTOR,
      ),
    );
  }

  difficultyStarsShouldBeVisible(
    viewport: { width: number; height: number } | null,
  ) {
    return (
      this.getDifficultyPanelShrinkage(viewport) <
      IMAGE_HIDE_SHRINKAGE_THRESHOLD
    );
  }

  difficultyDescriptionsShouldBeVisible(
    viewport: { width: number; height: number } | null,
  ) {
    return (
      this.getDifficultyPanelShrinkage(viewport) <
      COMPACT_CONTENT_SHRINKAGE_THRESHOLD
    );
  }

  async descriptionsHaveCount(count: number) {
    await expect(this.noviceDesc).toHaveCount(count);
    await expect(this.amateurDesc).toHaveCount(count);
    await expect(this.laymanDesc).toHaveCount(count);
    await expect(this.traineeDesc).toHaveCount(count);
    await expect(this.protegeDesc).toHaveCount(count);
    await expect(this.professionalDesc).toHaveCount(count);
    await expect(this.punditDesc).toHaveCount(count);
    await expect(this.masterDesc).toHaveCount(count);
    await expect(this.grandmasterDesc).toHaveCount(count);
  }

  async descriptionsAreVisible() {
    await this.descriptionsHaveCount(1);
  }

  async descriptionsAreHidden() {
    await this.descriptionsHaveCount(0);
  }
}
