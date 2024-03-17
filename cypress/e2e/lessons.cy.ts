import {
  EASY_COLOR_RGB,
  HARD_COLOR_RGB,
  INTERMEDIATE_COLOR_RGB,
  VERY_EASY_COLOR_RGB,
  VERY_HARD_COLOR_RGB,
} from "../../app/Styling/HighlightColors";
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
      LOCAL_STORAGE_SOME_LEARNED_LESSONS,
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

  it("should display correct difficulty text contents and colors", () => {
    // Very Easy Learned Cards
    for (let i: number = 0; i < 3; i++) {
      cy.get("[data-testid=learned" + i.toString() + "]").within(() => {
        cy.get("[data-testid=difficulty]").should("have.text", "Very Easy");
        cy.get("[data-testid=difficulty]").should(
          "have.css",
          "color",
          VERY_EASY_COLOR_RGB,
        );
      });
    }
    // Very Easy Current Card
    cy.get("[data-testid=lesson3]").within(() => {
      cy.get("[data-testid=difficulty]").should("have.text", "Very Easy");
      cy.get("[data-testid=difficulty]").should(
        "have.css",
        "color",
        VERY_EASY_COLOR_RGB,
      );
    });
    // Easy Locked Card
    cy.get("[data-testid=locked4]").within(() => {
      cy.get("[data-testid=difficulty]").should("have.text", "Easy");
      cy.get("[data-testid=difficulty]").should(
        "have.css",
        "color",
        EASY_COLOR_RGB,
      );
    });
    // Intermediate Locked Card
    cy.get("[data-testid=locked5]").within(() => {
      cy.get("[data-testid=difficulty]").should("have.text", "Intermediate");
      cy.get("[data-testid=difficulty]").should(
        "have.css",
        "color",
        INTERMEDIATE_COLOR_RGB,
      );
    });
    // Hard Locked Card
    cy.get("[data-testid=locked6]").within(() => {
      cy.get("[data-testid=difficulty]").should("have.text", "Hard");
      cy.get("[data-testid=difficulty]").should(
        "have.css",
        "color",
        HARD_COLOR_RGB,
      );
    });
    // Very Hard Locked Card
    cy.get("[data-testid=locked7]").within(() => {
      cy.get("[data-testid=difficulty]").should("have.text", "Very Hard");
      cy.get("[data-testid=difficulty]").should(
        "have.css",
        "color",
        VERY_HARD_COLOR_RGB,
      );
    });
  });

  it("should display warning popup when clicking on locked lesson card and go away when clicked no", () => {
    cy.get("[data-testid=locked4]").click();
    cy.contains("You have selected a lesson that is locked.");
    cy.contains("div", /^No$/).click();
    cy.contains("You have selected a lesson that is locked.").should(
      "not.exist",
    );
  });

  it("should display warning popup when clicking on locked lesson card, go to lesson when clicked yes, click finish lesson button, and verify card images are updated", () => {
    cy.get("[data-testid=locked4]").click();
    cy.contains("You have selected a lesson that is locked.");
    cy.contains("div", /^Yes$/).click();
    cy.contains("Naked Set Lesson");
    cy.get("[data-testid=finishLesson]").click();
    for (let i: number = 0; i < 3; i++) {
      cy.get("[data-testid=learned" + i.toString() + "]");
    }
    cy.get("[data-testid=lesson3]");
    cy.get("[data-testid=learned4]");
    for (let i: number = 5; i < 8; i++) {
      cy.get("[data-testid=locked" + i.toString() + "]");
    }
  });

  it("should click on learned lesson card and go to lesson", () => {
    cy.get("[data-testid=learned0]").click();
    cy.contains("Sudoku 101 Lesson");
  });

  it("should click on current lesson card, go to lesson, click finish lesson button, and verify card images are updated", () => {
    cy.get("[data-testid=lesson3]").click();
    cy.contains("Simplify Notes Lesson");
    cy.get("[data-testid=finishLesson]").click();
    for (let i: number = 0; i < 4; i++) {
      cy.get("[data-testid=learned" + i.toString() + "]");
    }
    cy.get("[data-testid=lesson4]");
    for (let i: number = 5; i < 8; i++) {
      cy.get("[data-testid=locked" + i.toString() + "]");
    }
  });

  it("should click on help button and display help popup", () => {
    cy.contains("div", "?").click();
    cy.contains("Learning Help");
  });
});
