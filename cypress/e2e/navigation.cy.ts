describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays navbar", () => {
    cy.get('[data-testid="navbar"]').should("be.visible");
  });

  it("displays logo", () => {
    cy.get('[data-testid="logo"]').should("be.visible");
  });

  it("navigates to home on logo click", () => {
    cy.visit("/wiki/1");
    cy.get('[data-testid="logo"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("displays navigation menu items", () => {
    cy.get('[data-testid="navbar-menu"]').should("be.visible");
  });

  it("handles 404 page correctly", () => {
    cy.visit("/non-existent-page", { failOnStatusCode: false });
    cy.get('[data-testid="not-found-heading"]').should("contain", "404");
    cy.get('[data-testid="back-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("maintains navbar on all pages", () => {
    cy.get('[data-testid="navbar"]').should("be.visible");
    cy.get('[data-testid="wiki-card"]').first().click();
    cy.get('[data-testid="navbar"]').should("be.visible");
  });
});
