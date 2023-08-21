describe("template spec", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]'
    );
    cy.visit("");
  });
  it("passes", () => {
    cy.contains("Get Started").click();
    cy.contains("Start Drill").click();
    cy.contains("Naked Sets").click();
    cy.get('[data-testid="Naked Single"]').click();
    cy.log("test");
    let singleCount = 0;
    cy.get("[data-testid=sudokuBoard]")
      .within(() => {
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            cy.get("[data-testid^=cellr" + i + "c" + j + "]")
              .invoke("data", "testid")
              .then((cellId) => {
                let cellIdString = cellId.toString();
                cy.log(cellIdString);
                if (cellIdString.includes("notes:")) {
                  let notesIndex = cellIdString.indexOf("notes:");
                  let notesString = cellIdString.substring(notesIndex + 6);
                  if (notesString.length === 1) {
                    singleCount++;
                  }
                }
              });
          }
        }
      })
      .then(() => {
        expect(singleCount).to.equal(1);
      });
  });
});
