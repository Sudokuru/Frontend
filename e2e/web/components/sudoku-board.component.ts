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
    numColumns?: number
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
      this.page.getByTestId(`cellr${row}c${column}value:${value}`)
    ).toBeInViewport({ ratio: 1 });
  }

  async cellHasNotes(row: number, column: number, notes: string) {
    await expect(
      this.page.getByTestId(`cellr${row}c${column}notes:${notes}`)
    ).toBeInViewport({ ratio: 1 });
  }

  async cellHasContent(
    row: number,
    column: number,
    content: string,
    contentType: "notes" | "value"
  ) {
    await expect(
      this.page.getByTestId(`cellr${row}c${column}${contentType}:${content}`)
    ).toBeInViewport({ ratio: 1 });
  }

  /**
   * For each cell in the puzzle, checks each condition starting from the first.
   * If the condition is valid then checks that the cell matches the expected color.
   * @param conditions An array of condition objects.
   * Condition object contains the following:
   * - A function that takes in a row and a column number and returns a boolean depending on if cell meets the condition.
   * - A string which is a RGB value of what color the cell should be
   */
  async isSudokuBoardHighlightedCorrectly(
    conditions: {
      condition: (row: number, column: number) => boolean;
      color: string;
    }[]
  ) {
    for (let row = 0; row < this.numRows; row++) {
      for (let column = 0; column < this.numColumns; column++) {
        for (let i = 0; i < conditions.length; i++) {
          if (conditions[i].condition(row, column)) {
            await this.cellHasColor(row, column, conditions[i].color);
            break;
          }
        }
      }
    }
  }

  async eraseButtonIsDisabled() {
    await expect(this.erase).toHaveCSS("pointer-events", "none");
  }
}
