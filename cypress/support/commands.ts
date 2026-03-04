// Custom Cypress commands for WikiMasters testing

/**
 * Login using the dedicated E2E test user credentials stored in cypress.env.json.
 * Uses cy.session() to cache the authenticated session — login only runs once
 * per spec file, not before every single test. This is much faster.
 *
 * Credentials are read from cypress.env.json (gitignored):
 *   TEST_USER_EMAIL  — the real Stack Auth user email
 *   TEST_USER_PASSWORD — the real Stack Auth user password
 *
 * To set up: create a dedicated test user in your Stack Auth dashboard
 * at https://app.stack-auth.com and fill in cypress.env.json locally.
 */
Cypress.Commands.add("login", () => {
  const email = Cypress.env("TEST_USER_EMAIL") as string;
  const password = Cypress.env("TEST_USER_PASSWORD") as string;

  if (!email || !password) {
    throw new Error(
      "Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in cypress.env.json. " +
        "Create a dedicated test user in Stack Auth dashboard and add credentials.",
    );
  }

  // cy.session caches the session cookies/storage by the email key.
  // The login UI flow only runs on first call per spec; subsequent tests
  // restore the cached session instantly.
  cy.session(
    email,
    () => {
      cy.visit("/handler/sign-in");
      cy.get('input[type="email"]', { timeout: 10000 }).type(email);
      cy.get('input[type="password"]').type(password);
      cy.get('button[type="submit"]').click();
      // Wait until we're redirected away from the sign-in page
      cy.url({ timeout: 15000 }).should("not.include", "sign-in");
    },
    {
      // Re-use the cached session even across different specs
      cacheAcrossSpecs: true,
      // After restoring the session, validate we're actually logged in
      validate() {
        cy.visit("/");
        cy.url().should("not.include", "sign-in");
      },
    },
  );
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
Cypress.Commands.add("getArticleById", (articleId: unknown) => {
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
      /** Log in as the dedicated E2E test user (credentials from cypress.env.json). */
      login(): Chainable<void>;
      logout(): Chainable<void>;
      createArticle(title: string, content: string): Chainable<void>;
      visitArticle(articleId: number): Chainable<void>;
      // biome-ignore lint/suspicious/noExplicitAny: <we need to allow any type for response>
      getArticleById(articleId: number): Chainable<Response<any>>;
      deleteArticle(): Chainable<void>;
      waitForArticles(): Chainable<void>;
    }
  }
}

export {};
