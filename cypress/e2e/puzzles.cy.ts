import {
  NOT_HIGHLIGHTED_COLOR_RGB,
  PEER_SELECTED_COLOR_RGB,
  SELECTED_COLOR_RGB,
  IDENTICAL_VALUE_COLOR_RGB,
  NOT_SELECTED_CONFLICT_COLOR_RGB,
} from "../../app/Styling/HighlightColors";

describe("Sudoku play component functions", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]'
    );
    window.localStorage.setItem(
      "active_game",
      '[{"puzzle":"003070040006002301089000000000107080517000006000400000271009005095000000000020000","puzzleSolution":"123675948456982371789314562964157283517238496832496157271849635395761824648523719","moves":[{"puzzleCurrentState":"123675948456982371789314562964157283517238496832496157271849635395761100648523719","puzzleCurrentNotesState":"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111000000000"}],"strategies":["NAKED_SINGLE","HIDDEN_SINGLE","NAKED_PAIR"],"difficulty":348,"drillStrategies":["NAKED_SINGLE","POINTING_PAIR","POINTING_TRIPLET"],"currentTime":374,"numWrongCellsPlayed":235}]'
    );
    cy.visit("");
    cy.get("[data-testid=OpenDrawerNavigation]").click();
    cy.get("[data-testid=PlayButton]").click();
    cy.contains("Resume Puzzle").click();
  });

  it("Pause button functions", () => {
    cy.get("[data-testid^=PauseButton]").click();
    cy.contains("Resume Puzzle");
  });

  it("Should solve game", () => {
    cy.get("[data-testid=" + "sudokuBoard" + "]").within(() => {
      cy.Cell_Should_Have_Color(7, 6, NOT_SELECTED_CONFLICT_COLOR_RGB);
    });
  });

  // todo update this test to resolve flaws
  // this test currently behaves differently in regards to peer highlighting
  // If r0c0 has a value, then this test validates peer highlighting
  // but if r0c0 does not have a value, this test does not validate peer highlighting
  /*it("Default highlighting functions", () => {
    cy.get("[data-testid=sudokuBoard]").within(() => {
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
  });*/
});
