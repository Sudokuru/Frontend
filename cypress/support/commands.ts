Cypress.Commands.add("Start_Naked_Single_Drill", () => {
  cy.contains("Drill").click();
  cy.contains("NAKED_SINGLE").click();
});
