Cypress.Commands.add("Start_Naked_Single_Drill", () => {
  cy.contains("Drill").click();
  cy.contains("NAKED_SINGLE").click();
});

Cypress.Commands.add("Get_Cell_IDs", () => {
  let cellIds: string[][] = new Array(9);
  for (let i = 0; i < 9; i++) {
    cellIds[i] = new Array(9);
  }
  cy.get("[data-testid=sudokuDrillBoard]")
    .within(() => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          cy.get("[data-testid^=cellr" + i + "c" + j + "]")
            .invoke("data", "testid")
            .then((cellId) => {
              cellIds[i][j] = cellId.toString();
            });
        }
      }
    })
    .then(() => {
      return cellIds;
    });
});
