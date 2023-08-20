describe("Sudoku play component functions", () => {
  // Before tests insert learned lessons in localstorage
  before(() => {
    window.localStorage.setItem(
      "learned_lessons",
      '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]'
    );
    cy.visit("http://localhost:19000/");
  });

  it("Pause Button functions for sudoku play component", () => {
    cy.contains("Get Started").click();
    cy.contains("Start Puzzle").click();
    cy.get("[data-testid=PauseButton]").click();
    cy.contains("Resume Puzzle");
  });
});
