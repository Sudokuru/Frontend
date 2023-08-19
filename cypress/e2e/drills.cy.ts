describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:19000/')
    cy.contains('Get Started').click()
    cy.contains('Start Drill').click()
  })
})