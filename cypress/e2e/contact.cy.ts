import {
  CONTACT_DRAWER_BUTTON,
  OPEN_DRAWER_NAVIGATION,
} from "../global/testIds";

describe("Contact page functions", () => {
  // Before tests navigate to contact page
  beforeEach(() => {
    cy.visit("");
    cy.get(OPEN_DRAWER_NAVIGATION).click();
    cy.get(CONTACT_DRAWER_BUTTON).click();
  });

  it("should display the contact page", () => {
    cy.contains("Contact Us");
  });
});
