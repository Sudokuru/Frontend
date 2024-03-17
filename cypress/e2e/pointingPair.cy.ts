import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
} from "../../app/Styling/HighlightColors";
import {
  CELL_WITH_NOTES,
  HINT_BUTTON,
  HINT_CHECK_MARK,
  HINT_RIGHT_ARROW,
  OPEN_DRAWER_NAVIGATION,
  PLAY_DRAWER_BUTTON,
  SUDOKU_BOARD,
} from "../global/testIds";

describe("Pointing pair strategy", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem("learned_lessons", '["POINTING_PAIR"]');
    window.localStorage.setItem(
      "active_game",
      '[{"puzzle":"123458976400397821789162453007080160000503798090070340000705209512000607970000504","puzzleSolution":"123458976456397821789162453237984165641523798895671342364715289512849637978236514","moves":[{"puzzleCurrentState":"123458976400397821789162453007080160000503798090070340000705209512000607970000504","puzzleCurrentNotesState":"000000000000000000000000000011000000010001000010001010001001010000000000000000000000000000000011000000000000001110000000101000000000000001101000000000000000000000000000000000011000000000000000000000100101000100011010000101010000000000000001010000000000000000000000000000010000001000000000010001000000000000000000011010001010000000000000000000000000000000000000110100000000000000101100000001100000111000000000000000000000000000000000000100001000000000100001000000000000000100001100001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000101000010001000010101000010000000000000000000000000000010010000000000000010010000000000000000000000000000000"}],"strategies":["NAKED_SINGLE","HIDDEN_SINGLE"],"difficulty":112,"drillStrategies":["NAKED_SINGLE","POINTING_PAIR","POINTING_TRIPLET"],"currentTime":10,"numHintsUsed":31,"numWrongCellsPlayed":0}]',
    );
    cy.visit("");
    cy.get(OPEN_DRAWER_NAVIGATION).click();
    cy.get(PLAY_DRAWER_BUTTON).click();
    cy.contains("Resume Puzzle").click();
  });

  it.skip("Uses pointing pair hint", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(HINT_BUTTON).click();
      cy.contains("Pointing Pair");
      cy.Board_Should_Have_Color_Except_For_Groups(
        -1,
        -1,
        6,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(2, 6, [0, 1]);
      cy.get(HINT_RIGHT_ARROW).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        6,
        -1,
        -1,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(0, 6, [0, 1]);
      cy.Cell_Should_Have_Notes_With_Colors(6, 4, "134", "3", "");
      cy.Cell_Should_Have_Notes_With_Colors(6, 7, "138", "3", "");
      cy.get(HINT_RIGHT_ARROW).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        6,
        -1,
        -1,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(0, 6, [0, 1]);
      cy.get(CELL_WITH_NOTES(6, 4, "14")).should("exist");
      cy.get(CELL_WITH_NOTES(6, 7, "18")).should("exist");
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
