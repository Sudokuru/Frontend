import { Locator, Page } from "@playwright/test";

export class SudokuBoardComponent {
  readonly pause: Locator;
  readonly undo: Locator;
  readonly note: Locator;
  readonly erase: Locator;
  readonly numPad: Locator;

  constructor(page: Page) {
    this.pause = page.getByTestId("PauseButton");
    this.undo = page.getByTestId("undoButton");
    this.note = page.getByTestId("toggleNoteModeButton");
    this.erase = page.getByTestId("eraseButton");
    this.numPad = page.getByTestId("numberControl");
  }
}
