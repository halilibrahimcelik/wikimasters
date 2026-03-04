// Custom Cypress commands for WikiMasters testing

// Login command
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/handler/sign-in");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should("not.include", "/sign-in");
});

// Logout command
Cypress.Commands.add("logout", () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should("include", "/handler/sign-in");
});

// Create article command
Cypress.Commands.add("createArticle", (title: string, content: string) => {
  cy.visit("/wiki/edit/new");
  cy.get('input[name="title"]').type(title);
  cy.get('[data-testid="editor-content"]').type(content);
  cy.get('button[type="submit"]').contains("Publish").click();
  cy.url().should("match", /\/wiki\/\d+/);
});

// Navigate to article
Cypress.Commands.add("visitArticle", (articleId: number) => {
  cy.visit(`/wiki/${articleId}`);
  cy.get('[data-testid="article-content"]').should("exist");
});

// Get article by ID
Cypress.Commands.add("getArticleById", (articleId: number) => {
  return cy.request(`/api/articles/${articleId}`);
});

// Delete article
Cypress.Commands.add("deleteArticle", () => {
  cy.get('[data-testid="delete-button"]').click();
  cy.get('[data-testid="confirm-delete"]').click();
  cy.url().should("not.include", "/wiki/");
});

// Wait for articles to load
Cypress.Commands.add("waitForArticles", () => {
  cy.get('[data-testid="articles-grid"]').should("exist");
  cy.get('[data-testid="wiki-card"]').should("have.length.greaterThan", 0);
});

// Custom command types
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      createArticle(title: string, content: string): Chainable<void>;
      visitArticle(articleId: number): Chainable<void>;
      getArticleById(articleId: number): Chainable<unknown>;
      deleteArticle(): Chainable<void>;
      waitForArticles(): Chainable<void>;
    }
  }
}

export {};
