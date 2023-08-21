describe("naked single drills", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]'
    );
    cy.visit("");
  });
  it("finds naked single in drill and hint is correctly applied", () => {
    cy.contains("Get Started").click();
    cy.contains("Start Drill").click();
    cy.contains("Naked Sets").click();
    cy.get('[data-testid="Naked Single"]').click();
    let singleCount = 0,
      singleRow = 0,
      singleCol = 0;
    let note = "";
    cy.get("[data-testid=sudokuBoard]")
      .within(() => {
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            cy.get("[data-testid^=cellr" + i + "c" + j + "]")
              .invoke("data", "testid")
              .then((cellId) => {
                let cellIdString = cellId.toString();
                if (cellIdString.includes("notes:")) {
                  let notesIndex = cellIdString.indexOf("notes:");
                  let notesString = cellIdString.substring(notesIndex + 6);
                  if (notesString.length === 1) {
                    singleCount++;
                    singleRow = i;
                    singleCol = j;
                    note = notesString;
                  }
                }
              });
          }
        }
      })
      .then(() => {
        expect(singleCount).to.equal(1);
        cy.get("[data-testid=hintButton]")
          .click()
          .get("[data-testid=rightArrow]")
          .click()
          .get("[data-testid=checkMark]")
          .click()
          .get(
            "[data-testid=cellr" +
              singleRow +
              "c" +
              singleCol +
              "value\\:" +
              note +
              "]"
          )
          .should("exist");
      });
  });
});
