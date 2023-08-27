Cypress.Commands.add("Start_Naked_Single_Drill", () => {
  cy.contains("Get Started").click();
  cy.contains("Start Drill").click();
  cy.contains("Naked Sets").click();
  cy.get('[data-testid="Naked Single"]').click();
});
