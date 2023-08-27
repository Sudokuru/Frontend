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
      Get_Cell_IDs(boardType: string): Chainable<JQuery<HTMLElement>>;

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
    }
  }
}
