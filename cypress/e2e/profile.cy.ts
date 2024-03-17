import {
  GOLD_COLOR_RGB,
  IDENTICAL_VALUE_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  PEER_SELECTED_COLOR_RGB,
  PURPLE_COLOR_RGB,
} from "../../app/Styling/HighlightColors";
import {
  CELL,
  DARK_THEME_DISABLED_TOGGLE,
  DARK_THEME_ENABLED_TOGGLE,
  HIGHLIGHT_BOX_DISABLED,
  HIGHLIGHT_BOX_ENABLED,
  HIGHLIGHT_COLUMN_DISABLED,
  HIGHLIGHT_COLUMN_ENABLED,
  HIGHLIGHT_IDENTICAL_VALUES_DISABLED,
  HIGHLIGHT_IDENTICAL_VALUES_ENABLED,
  HIGHLIGHT_ROW_DISABLED,
  HIGHLIGHT_ROW_ENABLED,
  OPEN_DRAWER_NAVIGATION,
  PLAY_DRAWER_BUTTON,
  SUDOKU_BOARD,
  VIEW_HOME_PAGE_BUTTON,
  VIEW_PROFILE_PAGE_BUTTON,
} from "../global/testIds";

describe("Profile Tests", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem(
      "active_game",
      '[{"variant":"classic","version":"1.0.0","selectedCell":null,"puzzle":[[{"type":"value","entry":1},{"type":"value","entry":2},{"type":"given","entry":3},{"type":"value","entry":4},{"type":"given","entry":5},{"type":"value","entry":8},{"type":"value","entry":9},{"type":"given","entry":7},{"type":"value","entry":6}],[{"type":"value","entry":4},{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":3},{"type":"value","entry":9},{"type":"given","entry":7},{"type":"given","entry":8},{"type":"value","entry":2},{"type":"given","entry":1}],[{"type":"value","entry":7},{"type":"given","entry":8},{"type":"given","entry":9},{"type":"value","entry":1},{"type":"value","entry":6},{"type":"value","entry":2},{"type":"value","entry":4},{"type":"value","entry":5},{"type":"value","entry":3}],[{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":7},{"type":"value","entry":0},{"type":"value","entry":8},{"type":"value","entry":0},{"type":"value","entry":1},{"type":"given","entry":6},{"type":"value","entry":0}],[{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":5},{"type":"value","entry":0},{"type":"value","entry":3},{"type":"value","entry":7},{"type":"value","entry":9},{"type":"given","entry":8}],[{"type":"value","entry":0},{"type":"value","entry":9},{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":7},{"type":"value","entry":0},{"type":"value","entry":3},{"type":"value","entry":4},{"type":"value","entry":0}],[{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":7},{"type":"value","entry":0},{"type":"given","entry":5},{"type":"value","entry":2},{"type":"value","entry":0},{"type":"given","entry":9}],[{"type":"value","entry":5},{"type":"given","entry":1},{"type":"given","entry":2},{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":6},{"type":"value","entry":0},{"type":"value","entry":7}],[{"type":"value","entry":9},{"type":"value","entry":7},{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":0},{"type":"value","entry":5},{"type":"value","entry":0},{"type":"value","entry":4}]],"puzzleSolution":[[1,2,3,4,5,8,9,7,6],[4,5,6,3,9,7,8,2,1],[7,8,9,1,6,2,4,5,3],[2,3,7,9,8,4,1,6,5],[6,4,1,5,2,3,7,9,8],[8,9,5,6,7,1,3,4,2],[3,6,4,7,1,5,2,8,9],[5,1,2,8,4,9,6,3,7],[9,7,8,2,3,6,5,1,4]],"statistics":{"difficulty":"easy","internalDifficulty":348,"numHintsUsed":0,"numWrongCellsPlayed":235,"score":0,"time":374},"inNoteMode":false,"actionHistory":[]}]',
    );
    cy.visit("");
    cy.get(VIEW_PROFILE_PAGE_BUTTON).click();
  });

  // testing color of Home Button to validate theme changes
  it("Theme toggle is functional", () => {
    cy.get(VIEW_HOME_PAGE_BUTTON)
      .children()
      .should("have.css", "color", GOLD_COLOR_RGB);
    cy.get(DARK_THEME_ENABLED_TOGGLE).click();
    cy.get(DARK_THEME_DISABLED_TOGGLE).should("exist");
    cy.get(VIEW_HOME_PAGE_BUTTON)
      .children()
      .should("have.css", "color", PURPLE_COLOR_RGB);

    cy.reload();
    cy.get(VIEW_PROFILE_PAGE_BUTTON).click();

    cy.get(VIEW_HOME_PAGE_BUTTON)
      .children()
      .should("have.css", "color", PURPLE_COLOR_RGB);
    cy.get(DARK_THEME_DISABLED_TOGGLE).should("exist");
    cy.get(DARK_THEME_DISABLED_TOGGLE).click();
    cy.get(DARK_THEME_ENABLED_TOGGLE).should("exist");
    cy.get(VIEW_HOME_PAGE_BUTTON)
      .children()
      .should("have.css", "color", GOLD_COLOR_RGB);
  });

  it("Highlight Identical Values toggle is functional", () => {
    cy.get(HIGHLIGHT_IDENTICAL_VALUES_ENABLED).click();
    cy.get(HIGHLIGHT_IDENTICAL_VALUES_DISABLED).should("exist");

    cy.reload();
    cy.get(VIEW_PROFILE_PAGE_BUTTON).click();
    cy.get(HIGHLIGHT_IDENTICAL_VALUES_DISABLED).should("exist");

    cy.get(OPEN_DRAWER_NAVIGATION).filter(":visible").click();
    cy.get(PLAY_DRAWER_BUTTON).click();
    cy.contains("Resume Puzzle").click();

    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(0, 0)).click();
      cy.Cell_Should_Have_Color(1, 8, NOT_HIGHLIGHTED_COLOR_RGB);
      cy.Cell_Should_Have_Color(7, 1, NOT_HIGHLIGHTED_COLOR_RGB);
      cy.Cell_Should_Have_Color(2, 3, NOT_HIGHLIGHTED_COLOR_RGB);
      cy.Cell_Should_Have_Color(3, 6, NOT_HIGHLIGHTED_COLOR_RGB);
    });

    cy.get(VIEW_PROFILE_PAGE_BUTTON).filter(":visible").click();
    cy.get(HIGHLIGHT_IDENTICAL_VALUES_DISABLED).click();
    cy.get(HIGHLIGHT_IDENTICAL_VALUES_ENABLED).should("exist");

    cy.get(OPEN_DRAWER_NAVIGATION).filter(":visible").click();
    cy.get(PLAY_DRAWER_BUTTON).click();

    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(0, 0)).trigger("click");
      cy.Cell_Should_Have_Color(1, 8, IDENTICAL_VALUE_COLOR_RGB);
      cy.Cell_Should_Have_Color(7, 1, IDENTICAL_VALUE_COLOR_RGB);
      cy.Cell_Should_Have_Color(2, 3, IDENTICAL_VALUE_COLOR_RGB);
      cy.Cell_Should_Have_Color(3, 6, IDENTICAL_VALUE_COLOR_RGB);
    });
  });

  it("Highlight Box is functional", () => {
    cy.get(HIGHLIGHT_BOX_ENABLED).click();
    cy.get(HIGHLIGHT_BOX_DISABLED).should("exist");

    cy.reload();
    cy.get(VIEW_PROFILE_PAGE_BUTTON).click();
    cy.get(HIGHLIGHT_BOX_DISABLED).should("exist");

    cy.get(OPEN_DRAWER_NAVIGATION).filter(":visible").click();
    cy.get(PLAY_DRAWER_BUTTON).click();
    cy.contains("Resume Puzzle").click();

    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(1, 1)).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        1,
        1,
        -1,
        NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Cell_Should_Have_Color(0, 0, NOT_HIGHLIGHTED_COLOR_RGB);
    });

    cy.get(VIEW_PROFILE_PAGE_BUTTON).filter(":visible").click();
    cy.get(HIGHLIGHT_BOX_DISABLED).click();
    cy.get(HIGHLIGHT_BOX_ENABLED).should("exist");

    cy.get(OPEN_DRAWER_NAVIGATION).filter(":visible").click();
    cy.get(PLAY_DRAWER_BUTTON).click();

    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(1, 1)).trigger("click");
      cy.Board_Should_Have_Color_Except_For_Groups(
        1,
        1,
        0,
        NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Cell_Should_Have_Color(0, 0, PEER_SELECTED_COLOR_RGB);
    });
  });

  it("Highlight Row is functional", () => {
    cy.get(HIGHLIGHT_ROW_ENABLED).click();
    cy.get(HIGHLIGHT_ROW_DISABLED).should("exist");

    cy.reload();
    cy.get(VIEW_PROFILE_PAGE_BUTTON).click();
    cy.get(HIGHLIGHT_ROW_DISABLED).should("exist");

    cy.get(OPEN_DRAWER_NAVIGATION).filter(":visible").click();
    cy.get(PLAY_DRAWER_BUTTON).click();
    cy.contains("Resume Puzzle").click();

    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(1, 1)).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        -1,
        1,
        0,
        NOT_HIGHLIGHTED_COLOR_RGB,
      );
    });

    cy.get(VIEW_PROFILE_PAGE_BUTTON).filter(":visible").click();
    cy.get(HIGHLIGHT_ROW_DISABLED).click();
    cy.get(HIGHLIGHT_ROW_ENABLED).should("exist");

    cy.get(OPEN_DRAWER_NAVIGATION).filter(":visible").click();
    cy.get(PLAY_DRAWER_BUTTON).click();

    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(1, 1)).trigger("click");
      cy.Board_Should_Have_Color_Except_For_Groups(
        1,
        1,
        0,
        NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Cell_Should_Have_Color(1, 3, PEER_SELECTED_COLOR_RGB);
    });
  });

  it("Highlight Column is functional", () => {
    cy.get(HIGHLIGHT_COLUMN_ENABLED).click();
    cy.get(HIGHLIGHT_COLUMN_DISABLED).should("exist");

    cy.reload();
    cy.get(VIEW_PROFILE_PAGE_BUTTON).click();
    cy.get(HIGHLIGHT_COLUMN_DISABLED).should("exist");

    cy.get(OPEN_DRAWER_NAVIGATION).filter(":visible").click();
    cy.get(PLAY_DRAWER_BUTTON).click();
    cy.contains("Resume Puzzle").click();

    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(1, 1)).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        1,
        -1,
        0,
        NOT_HIGHLIGHTED_COLOR_RGB,
      );
    });

    cy.get(VIEW_PROFILE_PAGE_BUTTON).filter(":visible").click();
    cy.get(HIGHLIGHT_COLUMN_DISABLED).click();
    cy.get(HIGHLIGHT_COLUMN_ENABLED).should("exist");

    cy.get(OPEN_DRAWER_NAVIGATION).filter(":visible").click();
    cy.get(PLAY_DRAWER_BUTTON).click();

    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(CELL(1, 1)).trigger("click");
      cy.Board_Should_Have_Color_Except_For_Groups(
        1,
        1,
        0,
        NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Cell_Should_Have_Color(3, 1, PEER_SELECTED_COLOR_RGB);
    });
  });
});
