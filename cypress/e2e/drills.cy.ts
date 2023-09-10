import {
  CELL_WITH_NOTES,
  CELL_WITH_VALUE,
  HINT_BUTTON,
  HINT_CHECK_MARK,
  HINT_RIGHT_ARROW,
  LOCAL_STORAGE_ALL_LEARNED_LESSONS,
} from "../global/testIds";

describe("naked single drills", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      LOCAL_STORAGE_ALL_LEARNED_LESSONS
    );
    cy.visit("");
  });
  it("finds naked single in drill and hint is correctly applied", () => {
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
            cy.contains("NAKED_SINGLE").should("exist");
          });
      });
  });
});
