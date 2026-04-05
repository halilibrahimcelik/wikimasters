describe("AI Features", () => {
  beforeEach(() => {
    cy.login();
    cy.createArticle(
      "Article for AI",
      "This is content that needs improvement",
    );
  });

  it("displays AI suggestion button", () => {
    cy.get('[data-testid="ai-button"]').should("be.visible");
  });

  it("opens AI suggestion panel", () => {
    cy.get('[data-testid="ai-button"]').click();
    cy.get('[data-testid="ai-panel"]').should("be.visible");
  });

  it("sends prompt to AI", () => {
    cy.get('[data-testid="ai-button"]').click();
    cy.get('[data-testid="ai-input"]').type("Improve this content");
    cy.get('[data-testid="ai-submit"]').click();
  });

  it("displays AI suggestions", () => {
    cy.get('[data-testid="ai-button"]').click();
    cy.get('[data-testid="ai-input"]').type("Improve this content");
    cy.get('[data-testid="ai-submit"]').click();
    cy.get('[data-testid="ai-suggestion"]').should("be.visible");
  });

  it("applies AI suggestion to content", () => {
    cy.get('[data-testid="ai-button"]').click();
    cy.get('[data-testid="ai-input"]').type("Improve this content");
    cy.get('[data-testid="ai-submit"]').click();
    cy.get('[data-testid="apply-suggestion"]').click();
    cy.get('[data-testid="ai-panel"]').should("not.exist");
  });
});
