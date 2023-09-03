import {
  HINT_SELECTED_COLOR_RGB,
  NOTE_TEXT_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  REMOVE_NOTE_TEXT_COLOR_RGB,
} from "../../app/Styling/HighlightColors";

describe("Amend notes strategy", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]'
    );
    window.localStorage.setItem(
      "active_game",
      '[{"puzzle":"003070040006002301089000000000107080517000006000400000271009005095000000000020000","puzzleSolution":"123675948456982371789314562964157283517238496832496157271849635395761824648523719","moves":[{"puzzleCurrentState":"003070040006002301089000000000107080517000006000400000271009005095000000000020000","puzzleCurrentNotesState":"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000110000000000000"}],"strategies":["NAKED_SINGLE","HIDDEN_SINGLE","NAKED_PAIR"],"difficulty":348,"drillStrategies":["NAKED_SINGLE","POINTING_PAIR","POINTING_TRIPLET"],"currentTime":374,"numWrongCellsPlayed":235}]'
    );
    cy.visit("");
    cy.get("[data-testid=OpenDrawerNavigation]").click();
    cy.get("[data-testid=PlayButton]").click();
    cy.contains("Resume Puzzle").click();
  });

  it("Uses amend notes hint", () => {
    cy.get("[data-testid=" + "sudokuBoard" + "]").within(() => {
      cy.get("[data-testid=hintButton]").click();
      cy.contains("Amend Notes");
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (row === 0 || column === 0 || (row < 3 && column < 3)) {
            if (
              (row === 0 && (column === 2 || column === 4 || column === 7)) ||
              (row === 1 && column === 2) ||
              (row === 2 && (column === 1 || column === 2)) ||
              (row === 4 && column === 0) ||
              (row === 6 && column === 0)
            ) {
              cy.Cell_Should_Have_Color(row, column, HINT_SELECTED_COLOR_RGB);
            } else {
              cy.Cell_Should_Have_Color(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
            }
          }
        }
      }
      cy.get("[data-testid=note1]")
        .children()
        .should("have.css", "color", NOTE_TEXT_COLOR_RGB);
      for (let i = 2; i <= 9; i++) {
        cy.get("[data-testid=note" + i + "]")
          .children()
          .should("have.css", "color", REMOVE_NOTE_TEXT_COLOR_RGB);
      }
      cy.get("[data-testid=rightArrow]").click();
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (row === 0 || column === 0 || (row < 3 && column < 3)) {
            if (
              (row === 0 && (column === 2 || column === 4 || column === 7)) ||
              (row === 1 && column === 2) ||
              (row === 2 && (column === 1 || column === 2)) ||
              (row === 4 && column === 0) ||
              (row === 6 && column === 0)
            ) {
              cy.Cell_Should_Have_Color(row, column, HINT_SELECTED_COLOR_RGB);
            } else {
              cy.Cell_Should_Have_Color(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
            }
          }
        }
      }
      cy.get("[data-testid=note1]")
        .children()
        .should("have.css", "color", NOTE_TEXT_COLOR_RGB);
      for (let i = 2; i <= 9; i++) {
        if (i !== 4 && i !== 5) {
          cy.get("[data-testid=note" + i + "]")
            .children()
            .should("not.exist");
        } else {
          cy.get("[data-testid=note" + i + "]")
            .children()
            .should("have.css", "color", NOTE_TEXT_COLOR_RGB);
        }
      }
    });
  });
});
