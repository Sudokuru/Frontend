export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to navigate to a new naked single drill.
       * @example cy.Start_Naked_Single_Drill()
       */
      Start_Naked_Single_Drill(): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to get the cell ids of the sudoku board.
       * @example cy.Get_Cell_IDs()
       * @param boardType - The type of board to get the cell ids from e.g. "sudokuDrillBoard"
       */
      Get_Cell_IDs(boardType: string): Chainable<string[][]>;

      /**
       * Custom command to get the notes from a cell id.
       * @example cy.Get_Cell_Notes()
       * @param cellId - The id of the cell to get the notes from
       * @returns The notes of the cell or null if the cell does not have notes
       */
      Get_Cell_Notes(cellId: string): Chainable<any>;

      /**
       * Custom command to check if a cell has a certain color.
       * @example cy.Cell_Should_Have_Color(0, 0, SELECTED_COLOR_RGB)
       * @param row - The row of the cell to check
       * @param column - The column of the cell to check
       * @param color - The color to check for
       */
      Cell_Should_Have_Color(
        row: number,
        column: number,
        color: string
      ): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to select a cell.
       * @example cy.Select_Cell(0, 0)
       * @param row - The row of the cell to select
       * @param column - The column of the cell to select
       */
      Select_Cell(row: number, column: number): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to get a cell.
       * @example cy.Get_Cell(0, 0)
       * @param row - The row of the cell to get
       * @param column - The column of the cell to get
       */
      Get_Cell(row: number, column: number): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to check if the board except for cells in certain groups have a certain color.
       * @example cy.Board_Should_Have_Color_Except_For_Groups(0, 3, -1, 3, SELECTED_COLOR_RGB)
       * @param row - The row to be ignored (-1 to not ignore any rows)
       * @param column - The column to be ignored (-1 to not ignore any columns)
       * @param box - The box to be ignored (-1 to not ignore any boxes)
       * @param color - The color to check for
       */
      Board_Should_Have_Color_Except_For_Groups(
        row: number,
        column: number,
        box: number,
        color: string
      ): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to get the box index from cell coordinates.
       * @example cy.Get_Box_Index_From_Cell_Coords(0, 0)
       * @param row - The row of the cell
       * @param column - The column of the cell
       * @returns The box index of the cell
       */
      Get_Box_Index_From_Cell_Coords(
        row: number,
        column: number
      ): Chainable<number>;
    }
  }
}
