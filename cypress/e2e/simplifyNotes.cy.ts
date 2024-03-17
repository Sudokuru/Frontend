import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
} from "../../app/Styling/HighlightColors";
import {
  CELL_WITH_NOTES,
  HINT_BUTTON,
  HINT_CHECK_MARK,
  HINT_RIGHT_ARROW,
  LOCAL_STORAGE_ALL_LEARNED_LESSONS,
  OPEN_DRAWER_NAVIGATION,
  PLAY_DRAWER_BUTTON,
  SUDOKU_BOARD,
} from "../global/testIds";

describe("Simplify notes strategy", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      LOCAL_STORAGE_ALL_LEARNED_LESSONS,
    );
    window.localStorage.setItem(
      "active_game",
      '[{"puzzle":"103000900006000001009300024000006040060007813817005002090000430000009080000020000","puzzleSolution":"123574968456982371789361524932816745564297813817435692291658437375149286648723159","moves":[{"puzzleCurrentState":"103000900006000001009300024000006040060007813817005692090000430000009080000020000","puzzleCurrentNotesState":"000000000010110100000010100011010001010110001000000000010011100011111100001111100010110110010110110000010110011010000000000000000000000000000000011110100001110110000000000000000000000000000010010000010110000000000000110010010110110000100110010010111110010110111000000000110000011010100001000100001100011110100111100100111110000111110000110111100011110101000011000100001001100000100011110101111100000000000010100010010100010100000010000000000000000000000000000100000010000000000101100010000000000001010100000010100000010100000000000000000000000000000110010100100010100000011100000010100000000000000000000000000000000000000000000000000000000000011101000011110000000000000000000000010101000000000000000000000011100000011100000011101"}],"strategies":["NAKED_SINGLE","HIDDEN_SINGLE"],"difficulty":64,"drillStrategies":["NAKED_SINGLE","POINTING_TRIPLET","HIDDEN_QUADRUPLET"],"numWrongCellsPlayed":0,"numHintsUsed":68,"currentTime":1154}]',
    );
    cy.visit("");
    cy.get(OPEN_DRAWER_NAVIGATION).click();
    cy.get(PLAY_DRAWER_BUTTON).click();
    cy.contains("Resume Puzzle").click();
  });

  it.skip("Uses simplify notes hint for row, column, and box", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(HINT_BUTTON).click();
      cy.contains("Simplify Notes");
      cy.Board_Should_Have_Color_Except_For_Groups(
        5,
        -1,
        -1,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(0, 5, [7]);
      cy.Cell_Should_Have_Notes_With_Colors(5, 3, "49", "9", "");
      cy.get(HINT_RIGHT_ARROW).click();
      cy.get(CELL_WITH_NOTES(5, 3, "4")).should("exist");
      cy.get(HINT_CHECK_MARK).click();
      cy.get(HINT_BUTTON).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        -1,
        7,
        -1,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(1, 7, [5]);
      cy.Cell_Should_Have_Notes_With_Colors(8, 7, "5679", "9", "");
      cy.get(HINT_RIGHT_ARROW).click();
      cy.get(CELL_WITH_NOTES(8, 7, "567")).should("exist");
      cy.get(HINT_CHECK_MARK).click();
      cy.get(HINT_BUTTON).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        -1,
        -1,
        5,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(2, 5, [7]);
      cy.Cell_Should_Have_Notes_With_Colors(3, 8, "579", "9", "");
      cy.get(HINT_RIGHT_ARROW).click();
      cy.get(CELL_WITH_NOTES(3, 8, "57")).should("exist");
      cy.get(HINT_CHECK_MARK).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        -1,
        -1,
        -1,
        NOT_HIGHLIGHTED_COLOR_RGB,
      );
    });
  });
});
