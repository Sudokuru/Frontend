import { Locator, Page, expect } from "@playwright/test";
import { SudokuStrategy } from "sudokuru";
import { toTitle } from "../../../app/Components/SudokuBoard/sudoku";
import {
  NOT_HIGHLIGHTED_COLOR_RGB,
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  HINT_SELECTED_COLOR_RGB,
} from "../../../app/Styling/HighlightColors";

export class SudokuBoardComponent {
  readonly page: Page;

  readonly numNumPads: number;
  readonly numRows: number;
  readonly numColumns: number;

  readonly sudokuBoard: Locator;

  readonly timer: Locator;
  readonly pause: Locator;
  readonly undo: Locator;
  readonly note: Locator;
  readonly erase: Locator;
  readonly hint: Locator;
  readonly hintExit: Locator;
  readonly hintFinish: Locator;
  readonly hintArrowRight: Locator;
  readonly hintArrowLeft: Locator;
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

    this.sudokuBoard = page.getByTestId("sudokuBoard");

    this.timer = page.getByText("Time: ");
    this.pause = page.getByTestId("PauseButton");
    this.undo = page.getByTestId("undoButton");
    this.note = page.getByTestId("toggleNoteModeButton");
    this.erase = page.getByTestId("eraseButton");
    this.hint = page.getByTestId("hintButton");
    this.hintExit = page.getByTestId("hintExit");
    this.hintFinish = page.getByTestId("hintFinish");
    this.hintArrowRight = page.getByTestId("hintArrowRight");
    this.hintArrowLeft = page.getByTestId("hintArrowLeft");

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

  async sudokuBoardContainsText(text: string | RegExp) {
    await expect(this.sudokuBoard).toContainText(text);
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

  async solveHint() {
    await this.hint.click();
    await this.hintArrowRight.click();
    await this.hintArrowRight.click();
    await this.hintArrowRight.click();
    await this.hintArrowRight.click();
    await this.hintFinish.click();
  }

  /**
   * This is a helper function for Hint testing.
   * This tests highlighting at relevant stages, hint undo and 'redo' functionality, and cell content of the hint stages.
   * @param sudokuBoard The playwright sudoku board page object.
   * @param row This is the row (0-8) of the target cell of the hint.
   * @param column This is the column (0-8) of the target cell of the hint.
   * @param hintSelectedColor This is a function provided to determine which cells should be highlighted as causes.
   * @param notHighlightedColor This is a function provided to determine what cells should be left unshaded as groups to focus on during the hint.
   * @param initialCellState This is an object containing the cell content and cell content type for initial cell state.
   * @param stageFourCellNotes This is an object containing the cell content and cell content type for the target cell for hint stage four.
   * @param stageFiveCellNotes This is an object containing the cell content and cell content type for the target cell for hint stage five.
   */
  async hintBaseTest(
    strategy: SudokuStrategy,
    hintSelectedColor: (row: number, column: number) => boolean,
    notHighlightedColor: (row: number, column: number) => boolean,
    initialCellState: {
      contentType: "notes" | "value";
      content: string;
      row: number;
      column: number;
    }[],
    stageFourCellNotes: {
      contentType: "notes" | "value";
      content: string;
      row: number;
      column: number;
    }[],
    stageFiveCellNotes: {
      contentType: "notes" | "value";
      content: string;
      row: number;
      column: number;
    }[]
  ) {
    await this.hint.click();

    await this.sudokuBoardContainsText(
      this.getHintMessageForStage(1, strategy)
    );
    await this.hintArrowRight.click();
    await this.sudokuBoardContainsText(
      this.getHintMessageForStage(2, strategy)
    );
    await this.hintArrowRight.click();

    await this.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    await this.sudokuBoardContainsText("The hint is located in this region");
    await this.hintArrowRight.click();

    await this.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    // testing undo logic
    await this.hintArrowLeft.click();
    for (const state of initialCellState) {
      await this.cellHasContent(
        state.row,
        state.column,
        state.content,
        state.contentType
      );
    }
    await this.hintArrowRight.click();
    for (const state of stageFourCellNotes) {
      await this.cellHasContent(
        state.row,
        state.column,
        state.content,
        state.contentType
      );
    }

    await this.hintArrowRight.click();
    for (const state of stageFiveCellNotes) {
      await this.cellHasContent(
        state.row,
        state.column,
        state.content,
        state.contentType
      );
    }

    await this.hintArrowLeft.click();
    for (const state of stageFourCellNotes) {
      await this.cellHasContent(
        state.row,
        state.column,
        state.content,
        state.contentType
      );
    }
    await this.hintArrowLeft.click();
    for (const state of initialCellState) {
      await this.cellHasContent(
        state.row,
        state.column,
        state.content,
        state.contentType
      );
    }

    await this.hintArrowRight.click();
    for (const state of stageFourCellNotes) {
      await this.cellHasContent(
        state.row,
        state.column,
        state.content,
        state.contentType
      );
    }

    await this.hintArrowRight.click();
    for (const state of stageFiveCellNotes) {
      await this.cellHasContent(
        state.row,
        state.column,
        state.content,
        state.contentType
      );
    }

    await this.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => hintSelectedColor(row, column),
        color: HINT_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => notHighlightedColor(row, column),
        color: NOT_HIGHLIGHTED_COLOR_RGB,
      },
      {
        condition: (row, column) => true,
        color: HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      },
    ]);

    await this.hintFinish.click();

    await this.isSudokuBoardHighlightedCorrectly([
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);

    for (const state of stageFiveCellNotes) {
      await this.cellHasContent(
        state.row,
        state.column,
        state.content,
        state.contentType
      );
    }

    // testing undo works at end of hint
    await this.undo.click();
    for (const state of initialCellState) {
      await this.cellHasContent(
        state.row,
        state.column,
        state.content,
        state.contentType
      );
    }
  }

  /**
   * Given stage number and hint type, returns the expected hint message
   * @param stage The stage of the hint to retrieve the hint message
   * @param hintType The hint type to recieve the hint message for
   * @returns A string with the hint message for the hint type and stage
   */
  getHintMessageForStage = (stage: number, hintType: SudokuStrategy) => {
    if (stage === 1) {
      return toTitle(hintType);
    } else if (stage === 2) {
      if (hintType === "AMEND_NOTES") {
        return "Amend notes are when you reset a cell's notes to contain every nonconflicting number";
      } else if (hintType === "SIMPLIFY_NOTES") {
        return "You can simplify notes using values already placed in cells at the start of the game";
      } else if (hintType === "NAKED_SINGLE") {
        return "Naked singles are when you only have one number left as a possibility in a cell";
      } else if (hintType === "NAKED_PAIR") {
        return "Naked pairs are when you only have the same two numbers left as a possibility in two cells in the same row, column, or box";
      } else if (hintType === "HIDDEN_SINGLE") {
        return "Hidden singles are when you only have one cell left still containing a specific value in a row, column, or box";
      } else {
        return "Could not find Hint Message";
      }
    } else {
      return "Could not find Hint Message";
    }
  };
}
