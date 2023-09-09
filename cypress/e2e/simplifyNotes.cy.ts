import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  HINT_SELECTED_COLOR_RGB,
  NOTE_TEXT_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  REMOVE_NOTE_TEXT_COLOR_RGB,
} from "../../app/Styling/HighlightColors";

describe("Simplify notes strategy", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]'
    );
    window.localStorage.setItem(
      "active_game",
      '[{"puzzle":"103000900006000001009300024000006040060007813817005002090000430000009080000020000","puzzleSolution":"123574968456982371789361524932816745564297813817435692291658437375149286648723159","moves":[{"puzzleCurrentState":"103000900006000001009300024000006040060007813817005692090000430000009080000020000","puzzleCurrentNotesState":"000000000010110100000010100011010001010110001000000000010011100011111100001111100010110110010110110000010110011010000000000000000000000000000000011110100001110110000000000000000000000000000010010000010110000000000000110010010110110000100110010010111110010110111000000000110000011010100001000100001100011110100111100100111110000111110000110111100011110101000011000100001001100000100011110101111100000000000010100010010100010100000010000000000000000000000000000100000010000000000101100010000000000001010100000010100000010100000000000000000000000000000110010100100010100000011100000010100000000000000000000000000000000000000000000000000000000000011101000011110000000000000000000000010101000000000000000000000011100000011100000011101"}],"strategies":["NAKED_SINGLE","HIDDEN_SINGLE"],"difficulty":64,"drillStrategies":["NAKED_SINGLE","POINTING_TRIPLET","HIDDEN_QUADRUPLET"],"numWrongCellsPlayed":0,"numHintsUsed":68,"currentTime":1154}]'
    );
    cy.visit("");
    cy.get("[data-testid=OpenDrawerNavigation]").click();
    cy.get("[data-testid=PlayButton]").click();
    cy.contains("Resume Puzzle").click();
  });

  it("Uses simplify notes hint for row, column, and box", () => {
    cy.get("[data-testid=" + "sudokuBoard" + "]").within(() => {
      cy.get("[data-testid=hintButton]").click();
      cy.contains("Simplify Notes");
      cy.Board_Should_Have_Color_Except_For_Groups(
        5,
        -1,
        -1,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB
      );
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (row === 5) {
            if (column === 7) {
              cy.Cell_Should_Have_Color(row, column, HINT_SELECTED_COLOR_RGB);
            } else {
              cy.Cell_Should_Have_Color(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
            }
          }
        }
      }
      cy.get("[data-testid=cellr5c3notes\\:49]").within(() => {
        cy.get("[data-testid=note4]")
          .children()
          .should("have.css", "color", NOTE_TEXT_COLOR_RGB);
        cy.get("[data-testid=note9]")
          .children()
          .should("have.css", "color", REMOVE_NOTE_TEXT_COLOR_RGB);
      });
      cy.get("[data-testid=rightArrow]").click();
      cy.get("[data-testid=cellr5c3notes\\:4]").should("exist");
      cy.get("[data-testid=checkMark]").click();
      cy.get("[data-testid=hintButton]").click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        -1,
        7,
        -1,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB
      );
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (column === 7) {
            if (row === 5) {
              cy.Cell_Should_Have_Color(row, column, HINT_SELECTED_COLOR_RGB);
            } else {
              cy.Cell_Should_Have_Color(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
            }
          }
        }
      }
      cy.get("[data-testid=cellr8c7notes\\:5679]").within(() => {
        for (let note = 5; note < 8; note++) {
          cy.get("[data-testid=note" + note + "]")
            .children()
            .should("have.css", "color", NOTE_TEXT_COLOR_RGB);
        }
        cy.get("[data-testid=note9]")
          .children()
          .should("have.css", "color", REMOVE_NOTE_TEXT_COLOR_RGB);
      });
      cy.get("[data-testid=rightArrow]").click();
      cy.get("[data-testid=cellr8c7notes\\:567]").should("exist");
      cy.get("[data-testid=checkMark]").click();
      cy.get("[data-testid=hintButton]").click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        -1,
        -1,
        5,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB
      );
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (row > 2 && row < 6 && column > 5) {
            if (row === 5 && column === 7) {
              cy.Cell_Should_Have_Color(row, column, HINT_SELECTED_COLOR_RGB);
            } else {
              cy.Cell_Should_Have_Color(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
            }
          }
        }
      }
      cy.get("[data-testid=cellr3c8notes\\:579]").within(() => {
        cy.get("[data-testid=note5]")
          .children()
          .should("have.css", "color", NOTE_TEXT_COLOR_RGB);
        cy.get("[data-testid=note7]")
          .children()
          .should("have.css", "color", NOTE_TEXT_COLOR_RGB);
        cy.get("[data-testid=note9]")
          .children()
          .should("have.css", "color", REMOVE_NOTE_TEXT_COLOR_RGB);
      });
      cy.get("[data-testid=rightArrow]").click();
      cy.get("[data-testid=cellr3c8notes\\:57]").should("exist");
    });
  });
});
