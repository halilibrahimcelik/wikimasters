describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays sign in link when not authenticated", () => {
    cy.get('[data-testid="signin-link"]').should("be.visible");
    cy.get('[data-testid="signup-link"]').should("be.visible");
  });

  it("navigates to sign in page", () => {
    cy.get('[data-testid="signin-link"]').click();
    cy.url().should("include", "/handler/sign-in");
  });

  it("navigates to sign up page", () => {
    cy.get('[data-testid="signup-link"]').click();
    cy.url().should("include", "/handler/sign-up");
  });

  it("displays user menu when authenticated", () => {
    cy.login("test@example.com", "password");
    cy.get('[data-testid="user-menu"]').should("be.visible");
  });

  it("can log out", () => {
    cy.login("test@example.com", "password");
    cy.logout();
    cy.url().should("include", "/handler/sign-in");
  });
});
