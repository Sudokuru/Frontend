export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to navigate to a new naked single drill.
       * @example cy.Start_Naked_Single_Drill()
       */
      Start_Naked_Single_Drill(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
