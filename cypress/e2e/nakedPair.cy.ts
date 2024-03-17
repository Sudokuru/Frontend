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

describe("Naked pair strategy", () => {
  // Before tests insert learned lessons in localstorage
  beforeEach(() => {
    window.localStorage.setItem("learned_lessons", '["NAKED_PAIR"]');
    window.localStorage.setItem(
      "active_game",
      '[{"puzzle":"930040506000098071000000490009800000002019000380400609827134965193000004564982137","puzzleSolution":"938741526456298371271365498619853742742619853385427619827134965193576284564982137","moves":[{"puzzleCurrentState":"930040506000098071000000490009800000002019000380400609827134965193000004564982137","puzzleCurrentNotesState":"000000000010101000010001100000101100000101100000000000000000000000000000000000000000000000000110000100010100100110100000110100000000000000000000000000000000000000100000010000011000100011010000000000000000000100010000000000000000000000000000000010000100011011000011011100000000000001011100000000000000000000000011100000000000000000000000000000010011100010011100000000000010010100000000000000011100000000000100000100000000000101011100001011100000000000000010100000000000000011100000000000000000000011000000000000000011000100001000110000000000000000000010000010000000000010000010000000000000000000110110000000110010110010000000000000010000010000000000000000000000000000011000010011000000001000010000000000000000000000000000000000000"}],"strategies":["NAKED_SINGLE","HIDDEN_SINGLE","NAKED_PAIR"],"difficulty":348,"drillStrategies":["NAKED_SINGLE","POINTING_PAIR","POINTING_TRIPLET"],"currentTime":17,"numWrongCellsPlayed":0,"numHintsUsed":97}]',
    );
    cy.visit("");
    cy.get(OPEN_DRAWER_NAVIGATION).click();
    cy.get(PLAY_DRAWER_BUTTON).click();
    cy.contains("Resume Puzzle").click();
  });

  it.skip("Uses naked pair hint", () => {
    cy.get(SUDOKU_BOARD).within(() => {
      cy.get(HINT_BUTTON).click();
      cy.contains("Naked Pair");
      cy.Board_Should_Have_Color_Except_For_Groups(
        -1,
        7,
        -1,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(1, 7, [0, 7]);
      cy.Cell_Should_Have_Notes_With_Colors(3, 7, "1245", "2", "");
      cy.Cell_Should_Have_Notes_With_Colors(4, 7, "458", "8", "");
      cy.Cell_Should_Have_Notes_With_Colors(5, 7, "125", "2", "");
      cy.get(HINT_RIGHT_ARROW).click();
      cy.Board_Should_Have_Color_Except_For_Groups(
        -1,
        7,
        -1,
        HINT_NOT_HIGHLIGHTED_COLOR_RGB,
      );
      cy.Group_Should_Only_Have_Indexes_Selected(1, 7, [0, 7]);
      cy.get(CELL_WITH_NOTES(3, 7, "145")).should("exist");
      cy.get(CELL_WITH_NOTES(4, 7, "45")).should("exist");
      cy.get(CELL_WITH_NOTES(5, 7, "15")).should("exist");
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
