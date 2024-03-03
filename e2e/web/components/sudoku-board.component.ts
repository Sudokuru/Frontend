import { Locator, Page } from "@playwright/test";

export class SudokuBoardComponent {
  readonly numNumPads: number;
  readonly numRows: number;
  readonly numColumns: number;

  readonly pause: Locator;
  readonly undo: Locator;
  readonly note: Locator;
  readonly erase: Locator;
  readonly numPad: Locator[] = [];
  readonly cell: Locator[][] = [];

  constructor(
    page: Page,
    numNumPads?: number,
    numRows?: number,
    numColumns?: number
  ) {
    this.numNumPads = numNumPads ? numNumPads : 9;
    this.numRows = numRows ? numRows : 9;
    this.numColumns = numColumns ? numColumns : 9;

    this.pause = page.getByTestId("PauseButton");
    this.undo = page.getByTestId("undoButton");
    this.note = page.getByTestId("toggleNoteModeButton");
    this.erase = page.getByTestId("eraseButton");

    for (let i = 0; i < this.numNumPads; i++) {
      this.numPad[i] = page.getByTestId("numberControl" + i);
    }

    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numColumns; c++) {
        const subLocator: string = "r" + r + "c" + c;
        //this.cell[r][c] = page.getByTestId(new RegExp(`^cell${subLocator}`));
      }
    }
  }
}
