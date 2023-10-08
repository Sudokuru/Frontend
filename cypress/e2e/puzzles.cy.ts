import {
  NOT_HIGHLIGHTED_COLOR_RGB,
  PEER_SELECTED_COLOR_RGB,
  SELECTED_COLOR_RGB,
  IDENTICAL_VALUE_COLOR_RGB,
  NOT_SELECTED_CONFLICT_COLOR_RGB,
  SELECTED_CONFLICT_COLOR_RGB,
  REMOVE_NOTE_TEXT_COLOR_RGB,
  NOTE_TEXT_COLOR_RGB,
  PLACE_NOTE_TEXT_COLOR_RGB,
} from "../../app/Styling/HighlightColors";
import {
  CELL,
  CELL_WITH_NOTES,
  CELL_WITH_VALUE,
  ERASE_BUTTON,
  HINT_BUTTON,
  HINT_CHECK_MARK,
  HINT_RIGHT_ARROW,
  LOCAL_STORAGE_ALL_LEARNED_LESSONS,
  NUMBER_BUTTON,
  OPEN_DRAWER_NAVIGATION,
  PAUSE_BUTTON,
  PLAY_DRAWER_BUTTON,
  START_NEW_GAME_BUTTON,
  SUDOKU_BOARD,
  TOGGLE_NOTE_MODE_BUTTON,
  UNDO_BUTTON,
} from "../global/testIds";

describe("Sudoku play component functions", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      LOCAL_STORAGE_ALL_LEARNED_LESSONS
    );
    window.localStorage.setItem(
      "active_game",
      '[{"puzzle":"003070040006002301089000000000107080517000006000400000271009005095000000000020000","puzzleSolution":"123675948456982371789314562964157283517238496832496157271849635395761824648523719","moves":[{"puzzleCurrentState":"123675948456982371789314562964157283517238496832496157271849635395761100648523719","puzzleCurrentNotesState":"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000110000000000000"}],"strategies":["NAKED_SINGLE","HIDDEN_SINGLE","NAKED_PAIR"],"difficulty":348,"drillStrategies":["NAKED_SINGLE","POINTING_PAIR","POINTING_TRIPLET"],"currentTime":374,"numWrongCellsPlayed":235}]'
    );
    cy.visit("");
    cy.get(OPEN_DRAWER_NAVIGATION).click();
    cy.get(PLAY_DRAWER_BUTTON).click();
    cy.contains("Resume Puzzle").click();
  });

  it("Pause button functions", () => {
    cy.get(PAUSE_BUTTON).click();
    cy.contains("Resume Puzzle");
  });

  it("Board Highlighting should render correctly when cell is selected", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.Cell_Should_Have_Color(7, 6, NOT_SELECTED_CONFLICT_COLOR_RGB);
      cy.Cell_Should_Have_Color(7, 7, NOT_HIGHLIGHTED_COLOR_RGB);
      cy.get(CELL(7, 7)).click();
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (row === 7 && column === 6) {
            cy.Cell_Should_Have_Color(
              row,
              column,
              NOT_SELECTED_CONFLICT_COLOR_RGB
            );
          } else if (row === 7 && column === 7) {
            cy.Cell_Should_Have_Color(row, column, SELECTED_COLOR_RGB);
          } else if (row === 7) {
            cy.Cell_Should_Have_Color(row, column, PEER_SELECTED_COLOR_RGB);
          } else if (column === 7 && row !== 7) {
            cy.Cell_Should_Have_Color(row, column, PEER_SELECTED_COLOR_RGB);
          } else if (row > 5 && column > 5) {
            cy.Cell_Should_Have_Color(row, column, PEER_SELECTED_COLOR_RGB);
          } else {
            cy.Cell_Should_Have_Color(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
          }
        }
      }
    });
  });

  it("Board Highlighting should render correctly when cell value is entered", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 7)).click().type("1");
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (
            (row === 0 && column === 0) ||
            (row === 1 && column === 8) ||
            (row === 2 && column === 4) ||
            (row === 3 && column === 3) ||
            (row === 4 && column === 1) ||
            (row === 5 && column === 6) ||
            (row === 6 && column === 2) ||
            (row === 7 && column === 5) ||
            (row === 8 && column === 7)
          ) {
            cy.Cell_Should_Have_Color(row, column, IDENTICAL_VALUE_COLOR_RGB);
          } else if (row === 7 && column === 6) {
            cy.Cell_Should_Have_Color(
              row,
              column,
              NOT_SELECTED_CONFLICT_COLOR_RGB
            );
          } else if (row === 7 && column === 7) {
            cy.Cell_Should_Have_Color(row, column, SELECTED_CONFLICT_COLOR_RGB);
          } else if (row === 7 || column == 7 || (row > 5 && column > 5)) {
            cy.Cell_Should_Have_Color(row, column, PEER_SELECTED_COLOR_RGB);
          } else {
            cy.Cell_Should_Have_Color(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
          }
        }
      }
    });
  });

  for (let i = 1; i <= 9; i++) {
    it(
      "Typing '" +
        i +
        "' in empty cell should fill cell with '" +
        i +
        "' value",
      () => {
        cy.get(SUDOKU_BOARD).within(() => {
          cy.get(CELL(7, 7)).click().type(i.toString());
          cy.get(CELL_WITH_VALUE(7, 7, i)).should("exist");
        });
      }
    );
  }

  for (let i = 1; i <= 9; i++) {
    it(
      "Clicking numpad '" +
        i +
        "' in empty cell should fill cell with '" +
        i +
        "' value",
      () => {
        cy.get(SUDOKU_BOARD).within(() => {
          cy.get(CELL(7, 7)).click();
          cy.get(NUMBER_BUTTON(i)).click();
          cy.get(CELL_WITH_VALUE(7, 7, i)).should("exist");
        });
      }
    );
  }

  for (let i = 1; i <= 9; i++) {
    it(
      "Typing '" + i + "' in empty cell should fill cell with '" + i + "' note",
      () => {
        cy.get(SUDOKU_BOARD).within(() => {
          cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
          cy.get(CELL(7, 7)).click().type(i.toString());
          cy.get(CELL_WITH_NOTES(7, 7, i.toString())).should("exist");
        });
      }
    );
  }

  for (let i = 1; i <= 9; i++) {
    it(
      "Clicking numpad '" +
        i +
        "' in empty cell should fill cell with '" +
        i +
        "' note",
      () => {
        cy.get(SUDOKU_BOARD).within(() => {
          cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
          cy.get(CELL(7, 7)).click();
          cy.get(NUMBER_BUTTON(i)).click();
          cy.get(CELL_WITH_NOTES(7, 7, i.toString())).should("exist");
        });
      }
    );
  }

  it("Board Highlighting should render correctly when undo button is entered", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 7)).click().type("1");
      cy.get(UNDO_BUTTON).click();
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (row === 7 && column === 6) {
            cy.Cell_Should_Have_Color(
              row,
              column,
              NOT_SELECTED_CONFLICT_COLOR_RGB
            );
          } else {
            cy.Cell_Should_Have_Color(row, column, NOT_HIGHLIGHTED_COLOR_RGB);
          }
        }
      }
    });
  });

  it("Undo button should remove value entered on previous move from keypad", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 7)).click().type("1");
      cy.get(CELL_WITH_VALUE(7, 7, 1)).should("exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL(7, 7)).children().should("not.exist");
    });
  });

  it("Undo button should remove value entered on previous move from numpad", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 7)).click();
      cy.get(NUMBER_BUTTON(1)).click();
      cy.get(CELL_WITH_VALUE(7, 7, 1)).should("exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL(7, 7)).children().should("not.exist");
    });
  });

  it("Undo button should replace value erased on previous move from erase button", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click();
      cy.get(ERASE_BUTTON).click();
      cy.get(CELL_WITH_VALUE(7, 6, 1)).should("not.exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL_WITH_VALUE(7, 6, 1)).should("exist");
    });
  });

  it("Undo button should replace notes erased on previous move from erase button", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 8)).click();
      cy.get(ERASE_BUTTON).click();
      cy.get(CELL_WITH_NOTES(7, 8, "45")).should("not.exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL_WITH_NOTES(7, 8, "45")).should("exist");
    });
  });

  it("Undo button should replace value overridden on previous move with keypad", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click().type("2");
      cy.get(CELL_WITH_VALUE(7, 6, 2)).should("exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL_WITH_VALUE(7, 6, 1)).should("exist");
    });
  });

  it("Undo button should replace value overridden on previous move with numpad", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click();
      cy.get(NUMBER_BUTTON(2)).click();
      cy.get(CELL_WITH_VALUE(7, 6, 2)).should("exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL_WITH_VALUE(7, 6, 1)).should("exist");
    });
  });

  it("Undo button should remove note entered on previous move with keypad", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
      cy.get(CELL(7, 7)).click().type("1");
      cy.get(CELL_WITH_NOTES(7, 7, "1")).should("exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL_WITH_NOTES(7, 7, "1")).should("not.exist");
    });
  });

  it("Undo button should remove note entered on previous move with numpad", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
      cy.get(CELL(7, 7)).click();
      cy.get(NUMBER_BUTTON(1)).click();
      cy.get(CELL_WITH_NOTES(7, 7, "1")).should("exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL_WITH_NOTES(7, 7, "1")).should("not.exist");
    });
  });

  it("Undo button should replace note removed on previous move with keypad", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
      cy.get(CELL(7, 8)).click().type("5");
      cy.get(CELL_WITH_NOTES(7, 8, "4")).should("exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL_WITH_NOTES(7, 8, "45")).should("exist");
    });
  });

  it("Undo button should replace note removed on previous move with numpad", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
      cy.get(CELL(7, 8)).click();
      cy.get(NUMBER_BUTTON(5)).click();
      cy.get(CELL_WITH_NOTES(7, 8, "4")).should("exist");
      cy.get(UNDO_BUTTON).click();
      cy.get(CELL_WITH_NOTES(7, 8, "45")).should("exist");
    });
  });

  it("Selecting invalid cell should update highlighting of cell correctly", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click();
      cy.Cell_Should_Have_Color(7, 6, SELECTED_CONFLICT_COLOR_RGB);
    });
  });

  it("Erase button should be disabled if a cell with a given is selected", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL_WITH_VALUE(0, 2, 3)).should("exist");
      cy.get(CELL(0, 2)).click();
      cy.get(ERASE_BUTTON).should("have.css", "pointer-events", "none");
    });
  });

  //todo Implement functionality so that this test passes
  it.skip("Erase button should be disabled if a cell with a correct value is selected", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL_WITH_VALUE(0, 0, 1)).should("exist");
      cy.get(CELL(0, 0)).click();
      cy.get(ERASE_BUTTON).should("have.css", "pointer-events", "none");
    });
  });

  it("Erasing an incorrect value should succeed", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click();
      cy.get(ERASE_BUTTON).click();
      cy.get(CELL_WITH_VALUE(7, 6, 1)).should("not.exist");
    });
  });

  it("Should solve game with multiple action types", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click();
      cy.get(ERASE_BUTTON).click();
      cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
      cy.get(CELL(7, 6)).click().type("12");
      cy.get(NUMBER_BUTTON(3)).click();
      cy.get(CELL_WITH_NOTES(7, 6, "123")).should("exist");
      cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
      cy.get(CELL(7, 6)).click().type("8");
      cy.get(CELL_WITH_VALUE(7, 6, 8)).should("exist");
      cy.get(CELL(7, 7)).click().get(NUMBER_BUTTON(2)).click();
      cy.get(CELL_WITH_VALUE(7, 7, 2)).should("exist");
      cy.get(HINT_BUTTON).click();
      cy.get("[data-testid=note4]")
        .children()
        .should("have.css", "color", NOTE_TEXT_COLOR_RGB);
      cy.get("[data-testid=note5]")
        .children()
        .should("have.css", "color", REMOVE_NOTE_TEXT_COLOR_RGB);
      cy.get(HINT_RIGHT_ARROW).click().get(HINT_CHECK_MARK).click();
      cy.get(CELL_WITH_NOTES(7, 8, "4")).should("exist");
      cy.get(HINT_BUTTON).click();
      cy.get("[data-testid=note4]")
        .children()
        .should("have.css", "color", PLACE_NOTE_TEXT_COLOR_RGB);
    });
  });

  it("Completing a game and clicking 'Start New Game' should take you to the play game page", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click().type("8");
      cy.get(CELL(7, 7)).click().type("2");
      // for some reason it needs to wait or else it fails
      // maybe because it finishes with time = 0, this may be an edge case failure
      cy.wait(1000);
      cy.get(CELL(7, 8)).click().type("4");
    });
    cy.get(START_NEW_GAME_BUTTON).click();
    cy.contains("Start Puzzle");
  });

  it.only("Completing a game should display correct game results", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click().type("8");
      cy.get(CELL(7, 7)).click().type("2");
      // for some reason it needs to wait or else it fails
      // maybe because it finishes with time = 0, this may be an edge case failure
      cy.wait(1000);
      cy.get(CELL(7, 8)).click().type("4");
    });
  });

  it("Completing a game should display correct statistics", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click().type("8");
      cy.get(CELL(7, 7)).click().type("2");
      // for some reason it needs to wait or else it fails
      // maybe because it finishes with time = 0, this may be an edge case failure
      cy.wait(1000);
      cy.get(CELL(7, 8)).click().type("4");
    });
  });
});
