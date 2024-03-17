import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
} from "../../app/Styling/HighlightColors";
import {
  HINT_BUTTON,
  HINT_CHECK_MARK,
  HINT_RIGHT_ARROW,
  LOCAL_STORAGE_ALL_LEARNED_LESSONS,
  OPEN_DRAWER_NAVIGATION,
  PLAY_DRAWER_BUTTON,
  SUDOKU_BOARD,
} from "../global/testIds";

describe("Amend notes strategy", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      LOCAL_STORAGE_ALL_LEARNED_LESSONS,
    );
    window.localStorage.setItem(
      "active_game",
      '[{"puzzle":"003070040006002301089000000000107080517000006000400000271009005095000000000020000","puzzleSolution":"123675948456982371789314562964157283517238496832496157271849635395761824648523719","moves":[{"puzzleCurrentState":"003070040006002301089000000000107080517000006000400000271009005095000000000020000","puzzleCurrentNotesState":"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000110000000000000"}],"strategies":["NAKED_SINGLE","HIDDEN_SINGLE","NAKED_PAIR"],"difficulty":348,"drillStrategies":["NAKED_SINGLE","POINTING_PAIR","POINTING_TRIPLET"],"currentTime":374,"numWrongCellsPlayed":235}]',
    );
    cy.visit("");
    cy.get(OPEN_DRAWER_NAVIGATION).click();
    cy.get(PLAY_DRAWER_BUTTON).click();
    cy.contains("Resume Puzzle").click();
  });

  it.skip("Uses amend notes hint", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(HINT_BUTTON).click();
      cy.contains("Amend Notes");
      cy.Board_Should_Have_Color_Except_For_Groups(
        0,
        0,
        0,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(0, 0, [2, 4, 7]);
      cy.Group_Should_Only_Have_Indexes_Selected(1, 0, [4, 6]);
      cy.Group_Should_Only_Have_Indexes_Selected(2, 0, [2, 5, 7, 8]);
      cy.Cell_Should_Have_Notes_With_Colors(0, 0, "123456789", "23456789", "");
      cy.get(HINT_RIGHT_ARROW).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        0,
        0,
        0,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(0, 0, [2, 4, 7]);
      cy.Group_Should_Only_Have_Indexes_Selected(1, 0, [4, 6]);
      cy.Group_Should_Only_Have_Indexes_Selected(2, 0, [2, 5, 7, 8]);
      cy.Cell_Should_Have_Notes_With_Colors(0, 0, "1", "", "");
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
