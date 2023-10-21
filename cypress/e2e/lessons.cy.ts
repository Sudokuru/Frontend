import {
  LEARN_DRAWER_BUTTON,
  LOCAL_STORAGE_SOME_LEARNED_LESSONS,
  OPEN_DRAWER_NAVIGATION,
} from "../global/testIds";

describe("Sudoku lesson page functions", () => {
  // Before tests insert learned lessons in local storage
  beforeEach(() => {
    window.localStorage.setItem(
      "learned_lessons",
      LOCAL_STORAGE_SOME_LEARNED_LESSONS
    );
    cy.visit("");
    cy.get(OPEN_DRAWER_NAVIGATION).click();
    cy.get(LEARN_DRAWER_BUTTON).click();
  });

  it("should display the lesson page", () => {
    cy.contains("Learn new strategies");
  });
});
