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

  it("should display learned lesson cards with checkmark images", () => {
    for (let i: number = 0; i < 3; i++) {
      cy.get("[data-testid=learned" + i.toString() + "]");
    }
  });

  it("should display current lesson card with regular image", () => {
    cy.get("[data-testid=lesson3]");
  });

  it("should display locked lesson cards with lock images", () => {
    for (let i: number = 4; i < 8; i++) {
      cy.get("[data-testid=locked" + i.toString() + "]");
    }
  });
});
