describe("template spec", () => {
  it("passes", () => {
    cy.visit("");
    cy.contains("Get Started").click();
    cy.contains("Start Drill").click();
  });
});
