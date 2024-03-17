import {
  HINT_SELECTED_COLOR_RGB,
  NOTE_TEXT_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  PLACE_NOTE_TEXT_COLOR_RGB,
  REMOVE_NOTE_TEXT_COLOR_RGB,
} from "../../app/Styling/HighlightColors";
import {
  CELL_WITH_NOTES,
  DRILL_DRAWER_BUTTON,
  OPEN_DRAWER_NAVIGATION,
} from "../global/testIds";

Cypress.Commands.add("Start_Naked_Single_Drill", () => {
  cy.get(OPEN_DRAWER_NAVIGATION).click();
  cy.get(DRILL_DRAWER_BUTTON).click();
  cy.contains("Naked Single").click();
});

Cypress.Commands.add("Get_Cell_IDs", (boardType) => {
  const cellIds: string[][] = new Array(9);
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
  const notesIndex = cellId.indexOf("notes:");
  return cy.wrap(cellId.substring(notesIndex + 6));
});

Cypress.Commands.add("Cell_Should_Have_Color", (row, column, color) => {
  cy.get("[data-testid^=cellr" + row + "c" + column + "]").should(
    "have.css",
    "background-color",
    color,
  );
});

Cypress.Commands.add(
  "Board_Should_Have_Color_Except_For_Groups",
  (row, column, box, color) => {
    for (let r: number = 0; r < 9; r++) {
      for (let c: number = 0; c < 9; c++) {
        if (r !== row && c !== column) {
          cy.Get_Box_Index_From_Cell_Coords(r, c).then((boxIndex) => {
            if (boxIndex !== box) {
              cy.Cell_Should_Have_Color(r, c, color);
            }
          });
        }
      }
    }
  },
);

Cypress.Commands.add("Get_Box_Index_From_Cell_Coords", (row, column) => {
  const BOX_LENGTH = 3;
  let box: number = Math.floor(column / BOX_LENGTH);
  box += Math.floor(row / BOX_LENGTH) * BOX_LENGTH;
  return cy.wrap(box);
});

Cypress.Commands.add(
  "Group_Should_Have_Given_Indexes_Color_A_Rest_B",
  (groupType, index, selectedIndexes, colorA, colorB) => {
    let pointer: number = 0;
    for (let i: number = 0; i < 9; i++) {
      let selected: boolean = false;
      if (pointer < selectedIndexes.length && i === selectedIndexes[pointer]) {
        selected = true;
        pointer++;
      }
      if (groupType === 0) {
        // row
        cy.Cell_Should_Have_Color(index, i, selected ? colorA : colorB);
      } else if (groupType === 1) {
        // column
        cy.Cell_Should_Have_Color(i, index, selected ? colorA : colorB);
      } else {
        // box
        let row: number = Math.floor(index / 3) * 3; // gets first row of box
        row += Math.floor(i / 3); // adds offset
        let col: number = (index % 3) * 3; // gets first column of box
        col += i % 3; // adds offset
        cy.Cell_Should_Have_Color(row, col, selected ? colorA : colorB);
      }
    }
  },
);

Cypress.Commands.add(
  "Group_Should_Only_Have_Indexes_Selected",
  (groupType, index, selectedIndexes) => {
    cy.Group_Should_Have_Given_Indexes_Color_A_Rest_B(
      groupType,
      index,
      selectedIndexes,
      HINT_SELECTED_COLOR_RGB,
      NOT_HIGHLIGHTED_COLOR_RGB,
    );
  },
);

Cypress.Commands.add(
  "Cell_Should_Have_Notes_With_Colors",
  (row, column, notes, noteRemoveColored, notePlacedColored) => {
    cy.get(CELL_WITH_NOTES(row, column, notes)).within(() => {
      let color: string;
      for (let i: number = 0; i < notes.length; i++) {
        color = NOTE_TEXT_COLOR_RGB;
        if (noteRemoveColored.includes(notes[i])) {
          color = REMOVE_NOTE_TEXT_COLOR_RGB;
        } else if (notePlacedColored.includes(notes[i])) {
          color = PLACE_NOTE_TEXT_COLOR_RGB;
        }
        cy.get("[data-testid=note" + notes[i] + "]")
          .children()
          .should("have.css", "color", color);
      }
    });
  },
);
