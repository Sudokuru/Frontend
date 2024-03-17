import {
  CELL_WITH_VALUE,
  DISMISS_DRILL_TUTORIAL_CHECKBOX,
  HIDE_DRILL_TUTORIAL_BUTTON,
  HINT_BUTTON,
  HINT_CHECK_MARK,
  HINT_RIGHT_ARROW,
  HOME_DRILL_BUTTON,
  LOCAL_STORAGE_ALL_LEARNED_LESSONS,
  VIEW_HOME_PAGE_BUTTON,
  VIEW_STATISTICS_PAGE_BUTTON,
} from "../global/testIds";

describe("naked single drills", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      LOCAL_STORAGE_ALL_LEARNED_LESSONS,
    );
    window.localStorage.setItem("dismissDrillTutorial", "true");
    cy.visit("");
  });

  it.skip("finds naked single in drill and hint is correctly applied", () => {
    cy.Start_Naked_Single_Drill();
    let singleCount: number = 0,
      singleRow: number = 0,
      singleCol: number = 0;
    let note: string = "";
    cy.Get_Cell_IDs("sudokuDrillBoard")
      .then((cellIds: string[][]) => {
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            cy.Get_Cell_Notes(cellIds[i][j]).then((notes) => {
              if (notes !== null) {
                if (notes.length === 1) {
                  singleCount++;
                  singleRow = i;
                  singleCol = j;
                  note = notes;
                }
              }
            });
          }
        }
      })
      .then(() => {
        expect(singleCount).to.equal(1);
        cy.get(HINT_BUTTON)
          .click()
          .get(HINT_RIGHT_ARROW)
          .click()
          .get(HINT_CHECK_MARK)
          .click()
          .get(CELL_WITH_VALUE(singleRow, singleCol, Number(note)))
          .should("exist")
          .then(() => {
            cy.contains("Submit").click();
          })
          .then(() => {
            cy.contains("Naked Single").should("exist");
          });
      });
  });

  it.skip("deletes statistics and verifies popup checking and unchecking works", () => {
    // Delete statistics so that the tutorial can be seen
    cy.get(VIEW_STATISTICS_PAGE_BUTTON).click();
    cy.contains("Delete Statistics").click();
    cy.get("[data-testid=awesome-alert-confirm-btn]").click();
    // Check then uncheck the checkbox to not show the tutorial again
    cy.get(VIEW_HOME_PAGE_BUTTON).last().click();
    cy.get(HOME_DRILL_BUTTON).click();
    cy.contains("Naked Single").click();
    cy.get(DISMISS_DRILL_TUTORIAL_CHECKBOX).click();
    cy.get(DISMISS_DRILL_TUTORIAL_CHECKBOX).click();
    // Do a drill to get back to the drill page
    cy.get(HIDE_DRILL_TUTORIAL_BUTTON).click();
    cy.get(HINT_BUTTON).click();
    cy.get(HINT_RIGHT_ARROW).click();
    cy.get(HINT_CHECK_MARK).click();
    cy.contains("Submit").click();
    // Check the checkbox to not show the tutorial again and do a drill to get back to the drill page
    cy.contains("Naked Single").click();
    cy.get(DISMISS_DRILL_TUTORIAL_CHECKBOX).click();
    cy.get(HIDE_DRILL_TUTORIAL_BUTTON).click();
    cy.get(HINT_BUTTON).click();
    cy.get(HINT_RIGHT_ARROW).click();
    cy.get(HINT_CHECK_MARK).click();
    cy.contains("Submit").click();
    // Start a new drill and verify the tutorial is not shown
    cy.contains("Naked Single").click();
    cy.contains("Submit").click();
  });
});
