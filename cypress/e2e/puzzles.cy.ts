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
  ACTIVE_GAME,
  ACTIVE_GAME_TWO,
  CELL,
  CELL_WITH_NOTES,
  CELL_WITH_VALUE,
  END_GAME_DIFFICULTY,
  END_GAME_NUM_HINTS_USED,
  END_GAME_NUM_WRONG_CELLS_PLAYED,
  END_GAME_SCORE,
  END_GAME_TIME,
  ERASE_BUTTON,
  HINT_BUTTON,
  HINT_CHECK_MARK,
  HINT_RIGHT_ARROW,
  HOME_PLAY_BUTTON,
  LOCAL_STORAGE_ALL_LEARNED_LESSONS,
  NUMBER_BUTTON,
  OPEN_DRAWER_NAVIGATION,
  PAUSE_BUTTON,
  PLAY_DRAWER_BUTTON,
  START_NEW_GAME_BUTTON,
  STATISTICS_AVERAGE_SOLVE_TIME,
  STATISTICS_FASTEST_SOLVE_TIME,
  STATISTICS_NUM_GAMES_PLAYED,
  STATISTICS_NUM_HINTS_USED,
  STATISTICS_NUM_WRONG_CELLS_PLAYED,
  STATISTICS_TOTAL_SCORE,
  STATISTICS_TOTAL_SOLVE_TIME,
  SUDOKU_BOARD,
  TOGGLE_NOTE_MODE_BUTTON,
  UNDO_BUTTON,
  VIEW_STATISTICS_PAGE_BUTTON,
} from "../global/testIds";

describe("Sudoku play component functions", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      LOCAL_STORAGE_ALL_LEARNED_LESSONS,
    );
    window.localStorage.setItem("active_game", ACTIVE_GAME);
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
              NOT_SELECTED_CONFLICT_COLOR_RGB,
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

  // todo implement this
  it.skip("Board Highlighting should render correctly when cell is unselected", () => {});

  it("Board Highlighting should render correctly when cell value is entered", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 7)).trigger("click").type("1");
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
              NOT_SELECTED_CONFLICT_COLOR_RGB,
            );
          } else if (row === 7 && column === 7) {
            cy.Cell_Should_Have_Color(row, column, SELECTED_CONFLICT_COLOR_RGB);
          } else if (row === 7 || column === 7 || (row > 5 && column > 5)) {
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
          cy.get(CELL(7, 7)).trigger("click").type(i.toString());
          cy.get(CELL_WITH_VALUE(7, 7, i)).should("exist");
        });
      },
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
      },
    );
  }

  for (let i = 1; i <= 9; i++) {
    it(
      "Typing '" + i + "' in empty cell should fill cell with '" + i + "' note",
      () => {
        cy.get(SUDOKU_BOARD).within(() => {
          cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
          cy.get(CELL(7, 7)).trigger("click").type(i.toString());
          cy.get(CELL_WITH_NOTES(7, 7, i.toString())).should("exist");
        });
      },
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
      },
    );
  }

  // todo behavior of app has changed, this test should be fixed
  it.skip("Board Highlighting should render correctly when undo button is entered", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 7)).trigger("click").type("1");
      cy.get(UNDO_BUTTON).click();
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (row === 7 && column === 6) {
            cy.Cell_Should_Have_Color(
              row,
              column,
              NOT_SELECTED_CONFLICT_COLOR_RGB,
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
      cy.get(CELL(7, 7)).trigger("click").type("1");
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
      cy.get(CELL(7, 6)).trigger("click").type("2");
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
      cy.get(CELL(7, 7)).trigger("click").type("1");
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
      cy.get(CELL(7, 8)).trigger("click").type("5");
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

  it("Erase button should be disabled if a cell with a correct value is selected", () => {
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

  // todo re-enable when hint button is created
  it.skip("Should solve game with multiple action types", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).click();
      cy.get(ERASE_BUTTON).click();
      cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
      cy.get(CELL(7, 6)).trigger("click").type("12");
      cy.get(CELL(7, 6)).click();
      cy.get(NUMBER_BUTTON(3)).click();
      cy.get(CELL_WITH_NOTES(7, 6, "123")).should("exist");
      cy.get(TOGGLE_NOTE_MODE_BUTTON).click();
      cy.get(CELL(7, 6)).trigger("click").type("8");
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
    // for some reason it needs to wait or else it fails
    // maybe because it finishes with time = 0, this may be an edge case failure
    cy.wait(1000);
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).trigger("click").type("8");
      cy.get(CELL(7, 7)).trigger("click").type("2");
      cy.get(CELL(7, 8)).trigger("click").type("4");
    });
    cy.get(START_NEW_GAME_BUTTON).click();
    cy.contains("Start Puzzle");
  });

  it("Completing a game should display correct game results", () => {
    // for some reason it needs to wait or else it fails
    // maybe because it finishes with time = 0, this may be an edge case failure
    cy.wait(1000);
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).trigger("click").type("8");
      cy.get(CELL(7, 7)).trigger("click").type("2");
      cy.get(CELL(7, 8)).trigger("click").type("4");
    });
    cy.get(END_GAME_SCORE).should("have.text", "34");
    cy.get(END_GAME_TIME).should("contain.text", "06:1");
    cy.get(END_GAME_NUM_HINTS_USED).should("have.text", "0");
    cy.get(END_GAME_NUM_WRONG_CELLS_PLAYED).should("have.text", "235");
    cy.get(END_GAME_DIFFICULTY).should("have.text", "easy");
  });

  it("Completing a game should display correct statistics", () => {
    // for some reason it needs to wait or else it fails
    // maybe because it finishes with time = 0, this may be an edge case failure
    cy.wait(1000);
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).trigger("click").type("8");
      cy.get(CELL(7, 7)).trigger("click").type("2");
      cy.get(CELL(7, 8)).trigger("click").type("4");
    });
    cy.get(START_NEW_GAME_BUTTON).click();
    cy.get(VIEW_STATISTICS_PAGE_BUTTON).filter(":visible").click();
    cy.get(STATISTICS_TOTAL_SCORE).filter(":visible").should("have.text", "34");
    cy.get(STATISTICS_NUM_GAMES_PLAYED)
      .filter(":visible")
      .should("have.text", "1");
    cy.get(STATISTICS_FASTEST_SOLVE_TIME)
      .filter(":visible")
      .should("contain.text", "06:1");
    cy.get(STATISTICS_AVERAGE_SOLVE_TIME)
      .filter(":visible")
      .should("contain.text", "06:1");
    cy.get(STATISTICS_TOTAL_SOLVE_TIME)
      .filter(":visible")
      .should("contain.text", "06:1");
    cy.get(STATISTICS_NUM_HINTS_USED)
      .filter(":visible")
      .should("have.text", "0");
    cy.get(STATISTICS_NUM_WRONG_CELLS_PLAYED)
      .filter(":visible")
      .should("have.text", "235");
  });

  // todo fix ACTIVE_GAME_TWO
  it.skip("Completing multiple games should display correct statistics", () => {
    // for some reason it needs to wait or else it fails
    // maybe because it finishes with time = 0, this may be an edge case failure
    cy.wait(1000);
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).trigger("click").type("8");
      cy.get(CELL(7, 7)).trigger("click").type("2");
      cy.get(CELL(7, 8)).trigger("click").type("4");
    });
    cy.get(START_NEW_GAME_BUTTON).click();
    cy.visit("", {
      onBeforeLoad(win) {
        win.localStorage.setItem("active_game", ACTIVE_GAME_TWO);
      },
    });
    cy.get(HOME_PLAY_BUTTON).click();
    cy.contains("Resume Puzzle").click();
    // for some reason it needs to wait or else it fails
    // maybe because it finishes with time = 0, this may be an edge case failure
    cy.wait(1000);
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(7, 6)).trigger("click").type("8");
      cy.get(CELL(7, 7)).trigger("click").type("2");
      cy.get(CELL(7, 8)).trigger("click").type("4");
    });
    cy.get(START_NEW_GAME_BUTTON).click();
    cy.get(VIEW_STATISTICS_PAGE_BUTTON).filter(":visible").click();
    cy.get(STATISTICS_TOTAL_SCORE).filter(":visible").should("have.text", "73");
    cy.get(STATISTICS_NUM_GAMES_PLAYED)
      .filter(":visible")
      .should("have.text", "2");
    cy.get(STATISTICS_FASTEST_SOLVE_TIME)
      .filter(":visible")
      .should("have.text", "03:21");
    cy.get(STATISTICS_AVERAGE_SOLVE_TIME)
      .filter(":visible")
      .should("have.text", "04:48");
    cy.get(STATISTICS_TOTAL_SOLVE_TIME)
      .filter(":visible")
      .should("have.text", "09:36");
    cy.get(STATISTICS_NUM_HINTS_USED)
      .filter(":visible")
      .should("have.text", "50");
    cy.get(STATISTICS_NUM_WRONG_CELLS_PLAYED)
      .filter(":visible")
      .should("have.text", "435");
  });
});
