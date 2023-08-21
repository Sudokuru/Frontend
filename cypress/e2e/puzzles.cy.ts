import {
  NOT_HIGHLIGHTED_COLOR_RGB,
  PEER_SELECTED_COLOR_RGB,
  SELECTED_COLOR_RGB,
  IDENTICAL_VALUE_COLOR_RGB,
} from "../../app/Styling/HighlightColors";

describe("Sudoku play component functions", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]'
    );
    cy.visit("");
    cy.contains("Get Started").click();
    cy.contains("Start Puzzle").click();
  });

  it("Pause button functions", () => {
    cy.get("[data-testid^=PauseButton]").click();
    cy.contains("Resume Puzzle");
  });

  // todo update this test to resolve flaws
  // this test currently behaves differently in regards to peer highlighting
  // If r0c0 has a value, then this test validates peer highlighting
  // but if r0c0 does not have a value, this test does not validate peer highlighting
  it("Default highlighting functions", () => {
    // select the first cell (^= means it should start with that string so it ignores the notes or value that comes after it)
    cy.get("[data-testid^=cellr0c0]").click();

    cy.get("[data-testid^=cellr0c0]")
      .invoke("text")
      .then((initialCellValue) => {
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            // validate background color of selected cell
            if (j === 0 && i === 0) {
              cy.get("[data-testid^=cellr" + i + "c" + j + "]").should(
                "have.css",
                "background-color",
                SELECTED_COLOR_RGB
              );
              // validate background color of surrounding cells
            } else if ((j < 3 && i < 3) || j === 0 || i === 0) {
              cy.get("[data-testid^=cellr" + i + "c" + j + "]").should(
                "have.css",
                "background-color",
                PEER_SELECTED_COLOR_RGB
              );
              // validate background of remaining cells
            } else {
              cy.get("[data-testid^=cellr" + i + "c" + j + "]")
                .invoke("text")
                .then((compareCellValue) => {
                  if (
                    compareCellValue === initialCellValue &&
                    initialCellValue !== ""
                  ) {
                    cy.log(compareCellValue, initialCellValue);
                    cy.get("[data-testid^=cellr" + i + "c" + j + "]").should(
                      "have.css",
                      "background-color",
                      IDENTICAL_VALUE_COLOR_RGB
                    );
                  } else {
                    cy.get("[data-testid^=cellr" + i + "c" + j + "]").should(
                      "have.css",
                      "background-color",
                      NOT_HIGHLIGHTED_COLOR_RGB
                    );
                  }
                });
            }
          }
        }
      });
  });
});
