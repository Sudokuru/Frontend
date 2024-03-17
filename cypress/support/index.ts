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
        color: string,
      ): Chainable<JQuery<HTMLElement>>;

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
        color: string,
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
        column: number,
      ): Chainable<number>;

      /**
       * Custom command to check if only certain cells in a group have a certain color and the rest have a different color.
       * @example cy.Group_Should_Only_Have_Indexes_Selected(0, 1, {0, 1, 2}, SELECTED_COLOR_RGB, NOT_HIGHLIGHTED_COLOR_RGB)
       * @param groupType - The type of group to check (row = 0, column = 1, box = 2)
       * @param index - The index of the group to check (0 - 8)
       * @param selectedIndexes - The indexes of the cells in the group that should be selected in ascending order
       * @param colorA - The color that the selected cells should have
       * @param colorB - The color that the unselected cells should have
       */
      Group_Should_Have_Given_Indexes_Color_A_Rest_B(
        groupType: number,
        index: number,
        selectedIndexes: number[],
        colorA: string,
        colorB: string,
      ): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to check if only certain cells in a group have Hint Selected Color and the rest have Not Highlighted Color.
       * @example cy.Group_Should_Only_Have_Indexes_Selected(0, 1, {0, 1, 2})
       * @param groupType - The type of group to check (row = 0, column = 1, box = 2)
       * @param index - The index of the group to check (0 - 8)
       * @param selectedIndexes - The indexes of the cells in the group that should be selected in ascending order
       */
      Group_Should_Only_Have_Indexes_Selected(
        groupType: number,
        index: number,
        selectedIndexes: number[],
      ): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to check if a cell with given notes exists and the notes have remove or placed color (or NOTE_TEXT_COLOR if not specified)
       * @example cy.Cell_Should_Have_Notes_With_Colors(3, 5, "123", "12", "3", "")
       * @param row - The row of the cell
       * @param column - The column of the cell
       * @param notes - The notes of the cell (in ascending order)
       * @param noteRemoveColored - The notes that should have REMOVE_NOTE_TEXT_COLOR (in ascending order)
       * @param notePlaceColored - The notes that should have PLACE_NOTE_TEXT_COLOR (in ascending order)
       */
      Cell_Should_Have_Notes_With_Colors(
        row: number,
        column: number,
        notes: string,
        noteRemoveColored: string,
        notePlaceColored: string,
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}
