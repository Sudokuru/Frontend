import { getBoxIndexFromCellCoords } from "../../app/Components/Sudoku Board/Functions/BoardFunctions";

Cypress.Commands.add("Start_Naked_Single_Drill", () => {
  cy.get("[data-testid=OpenDrawerNavigation]").click();
  cy.get("[data-testid=DrillButton]").click();
  cy.contains("NAKED_SINGLE").click();
});

Cypress.Commands.add("Get_Cell_IDs", (boardType) => {
  let cellIds: string[][] = new Array(9);
  for (let i = 0; i < 9; i++) {
    cellIds[i] = new Array(9);
  }
  cy.get("[data-testid=" + boardType + "]")
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

Cypress.Commands.add("Get_Cell_Notes", (cellId) => {
  if (!cellId.includes("notes:")) {
    return cy.wrap(null);
  }
  let notesIndex = cellId.indexOf("notes:");
  return cy.wrap(cellId.substring(notesIndex + 6));
});

Cypress.Commands.add("Cell_Should_Have_Color", (row, column, color) => {
  cy.get("[data-testid^=cellr" + row + "c" + column + "]").should(
    "have.css",
    "background-color",
    color
  );
});

Cypress.Commands.add("Select_Cell", (row, column) => {
  cy.get("[data-testid^=cellr" + row + "c" + column + "]").click();
});

Cypress.Commands.add("Get_Cell", (row, column) => {
  cy.get("[data-testid^=cellr" + row + "c" + column + "]");
});

Cypress.Commands.add(
  "Board_Should_Have_Color_Except_For_Groups",
  (row, column, box, color) => {
    for (let r: number = 0; r < 9; r++) {
      for (let c: number = 0; c < 9; c++) {
        if (
          r !== row &&
          c !== column &&
          getBoxIndexFromCellCoords(r, c) !== box
        ) {
          cy.Cell_Should_Have_Color(r, c, color);
        }
      }
    }
  }
);
