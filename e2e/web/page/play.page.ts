import { Locator, Page, expect } from "@playwright/test";

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
    this.title = page.getByTestId("playPageTitle");
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

  async fullTitleIsVisible() {
    await expect(this.title).toHaveText("Play a Sudoku game");
  }

  async partialTitleIsVisible() {
    await expect(this.title).toHaveText("Play Sudoku");
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
