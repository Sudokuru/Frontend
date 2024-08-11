import { Locator, Page, expect } from "@playwright/test";

export class PlayPage {
  readonly page: Page;
  readonly title: Locator;
  readonly start: Locator;
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
    this.title = page.getByText("Play a Sudoku game");
    this.start = page.getByText("Start Puzzle");
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
    this.fourPointStar = page.getByAltText("4 Point Star");
    this.fivePointStar = page.getByAltText("5 Point Star");
    this.ninePointStar = page.getByAltText("9 Point Star");
    this.twentyFourPointStar = page.getByAltText("24 Point Star");
  }

  async playPageIsRendered() {
    await expect(this.title).toBeInViewport({ ratio: 1 });
  }

  async starsHaveCount(count: number) {
    await expect(this.threePointStar).toHaveCount(0);
    await expect(this.fourPointStar).toHaveCount(0);
    await expect(this.fivePointStar).toHaveCount(0);
    await expect(this.ninePointStar).toHaveCount(0);
    await expect(this.twentyFourPointStar).toHaveCount(0);
  }

  async starsAreVisible() {
    await this.starsHaveCount(1);
  }

  async starsAreHidden() {
    await this.starsHaveCount(0);
  }

  async descriptionsAreVisible() {
    await expect(this.noviceDesc).toHaveCount(1);
    await expect(this.amateurDesc).toHaveCount(1);
    await expect(this.laymanDesc).toHaveCount(1);
    await expect(this.traineeDesc).toHaveCount(1);
    await expect(this.protegeDesc).toHaveCount(1);
    await expect(this.professionalDesc).toHaveCount(1);
    await expect(this.punditDesc).toHaveCount(1);
    await expect(this.masterDesc).toHaveCount(1);
    await expect(this.grandmasterDesc).toHaveCount(1);
  }
}
