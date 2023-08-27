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
       */
      Get_Cell_IDs(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
