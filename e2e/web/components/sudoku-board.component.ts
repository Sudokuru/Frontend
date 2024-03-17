import { Locator, Page, expect } from "@playwright/test";

export class SudokuBoardComponent {
  readonly page: Page;

  readonly numNumPads: number;
  readonly numRows: number;
  readonly numColumns: number;

  readonly timer: Locator;
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
    numColumns?: number,
  ) {
    this.page = page;

    this.numNumPads = numNumPads ? numNumPads : 9;
    this.numRows = numRows ? numRows : 9;
    this.numColumns = numColumns ? numColumns : 9;

    this.timer = page.getByText("Time: ");
    this.pause = page.getByTestId("PauseButton");
    this.undo = page.getByTestId("undoButton");
    this.note = page.getByTestId("toggleNoteModeButton");
    this.erase = page.getByTestId("eraseButton");

    for (let i = 0; i < this.numNumPads; i++) {
      this.numPad[i] = page.getByTestId("numberControl" + (i + 1));
    }

    for (let r = 0; r < this.numRows; r++) {
      this.cell.push([]);
      for (let c = 0; c < this.numColumns; c++) {
        const subLocator: string = "r" + r + "c" + c;
        this.cell[r][c] = page.getByTestId(new RegExp(`^cell${subLocator}`));
      }
    }
  }

  async sudokuBoardIsRendered() {
    await expect(this.timer).toBeInViewport({ ratio: 1 });
  }

  async cellHasColor(row: number, column: number, color: string) {
    await expect(this.cell[row][column]).toHaveCSS("background-color", color);
  }

  async cellHasValue(row: number, column: number, value: string) {
    await expect(
      this.page.getByTestId(`cellr${row}c${column}value:${value}`),
    ).toBeInViewport({ ratio: 1 });
  }

  async cellHasNotes(row: number, column: number, notes: string) {
    await expect(
      this.page.getByTestId(`cellr${row}c${column}notes:${notes}`),
    ).toBeInViewport({ ratio: 1 });
  }

  async eraseButtonIsDisabled() {
    await expect(this.erase).toHaveCSS("pointer-events", "none");
  }
}
