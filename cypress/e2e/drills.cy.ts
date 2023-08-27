describe("naked single drills", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]'
    );
    cy.visit("");
  });
  it("finds naked single in drill and hint is correctly applied", () => {
    cy.Start_Naked_Single_Drill();
    let singleCount = 0,
      singleRow = 0,
      singleCol = 0;
    let note = "";
    cy.Get_Cell_IDs("sudokuDrillBoard")
      .then((cellIds) => {
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            if (cellIds[i][j].includes("notes:")) {
              let notesIndex = cellIds[i][j].indexOf("notes:");
              let notesString = cellIds[i][j].substring(notesIndex + 6);
              if (notesString.length === 1) {
                singleCount++;
                singleRow = i;
                singleCol = j;
                note = notesString;
              }
            }
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
          .should("exist")
          .then(() => {
            cy.contains("Submit").click();
          })
          .then(() => {
            cy.contains("NAKED_SINGLE").should("exist");
          });
      });
  });
});
