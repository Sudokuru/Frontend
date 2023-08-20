describe("Pause Button functions for sudoku play component", () => {
  // Before tests insert learned lessons in localstorage
  before(() => {
    window.localStorage.setItem(
      "learned_lessons",
      '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]'
    );
  });

  it("Then the user navigates to the Home page", () => {
    cy.visit("http://localhost:19000/");
    cy.contains("Get Started").click();
    cy.contains("Start Puzzle").click();
    cy.get("[data-testid=PauseButton]").click();
    cy.contains("Resume Puzzle");
  });
});
